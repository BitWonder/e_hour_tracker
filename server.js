// Deno code goes here!
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// database setup
const database = await Deno.openKv();

if ( !(await database.get(["user", "admin", await hashPassword("Z9AY,N25W£E&y_+=1p|s<:,T#&I#L/T},i85m!O4};ir[*i=QK")])).value ) {
    // comment out after init
    //await delete_all();

    // keep this code
    await database.set(["user", "admin", await hashPassword("Z9AY,N25W£E&y_+=1p|s<:,T#&I#L/T},i85m!O4};ir[*i=QK")], {
        username: "admin",
        full_name: "Admin",
        user: "admin",
        academy: "all",
        password: await hashPassword("Z9AY,N25W£E&y_+=1p|s<:,T#&I#L/T},i85m!O4};ir[*i=QK")
    })
}

// for not plain text
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function delete_all() {
    const entries = database.list({ prefix: [] });
    for await (let entry of entries) {
        database.delete(entry.key);
    }
}

const app = new Application();
const router = new Router();
const port = 1027;

// router gets go here
router.post("/login",            async (context) => {
    const input = await context.request.body.json();
    let user = ( await database.get(["user", input.username, await hashPassword(input.password)]) ).value;
    if ( !user ) {
        context.response.status = 401;
        return;
    }
    // if didn't fail to retrieve user data then send ok (user exists)
    let uuid = crypto.randomUUID();
    await database.set(["uuid", uuid], {
        username: user.username,
        password: user.password
    }, { expireIn: 3600000 }); // a database linker that expires in one hour
    context.response.status = 200;
    context.response.body = JSON.stringify({
        uuid: uuid,
        user: user.user
    });
    context.response.type = "json";
    return;
});

router.post("/newUser",          async (context) => {
    // input.data should be json
    const input = await context.request.body.json();
    let hashed_password = await hashPassword(input.password);
    input.data.password = hashed_password
    let primary_key = ["user", input.username, hashed_password];
    if ( input.user == "student" ) {
        let response = await database.atomic()
            .check({key: primary_key})
            .set(primary_key, input.data)
            .set(["academy", input.academy, input.username], input.data)
            .commit();
        if ( response.ok == true ) {
            context.response.status = 200;
            return;
        }
        context.response.status = 401;
        return;
        // auto 500 if database connection error
    }
    // diff set for admin
    let response = await database.atomic()
        .check({key: primary_key})
        .set(primary_key, input.data)
        .set(["admin", input.academy, input.username])
        .commit();
    if ( response.ok == true ) {
        context.response.status = 200;
        return;
    }
    context.response.status = 401;
    return;
});

router.post("/submitHours",      async (context) => {
    const input = await context.request.body.formData();
    // json containing user stuff
    let info = ( await database.get(["uuid", input.get("id")]) ).value;
    let user = (await database.get(["user", info.username, info.password])).value;
    // Check if user.pending_hours is undefined, if so, initialize it as an empty array
    if (!user.pending_hours) {
        user.pending_hours = [];
    }
    
    // Now you can safely push the new item
    user.pending_hours.push({
        title: input.get("title"),
        amount: input.get("amount"),
        date: input.get("date"),
        submitted: input.get("submitted"),
        description: input.get("description"),
        images: input.get("images")
    });

    // see what images is (currently I don't know what it would be)
    console.log("images: " + input.get("images"));
    await database.set(["user", info.username, info.password], user);
    await database.set(["academy", user.academy, info.username], user);
    context.response.status = 200;
});

router.get("/user/:id",          async (context) => {
    const input = context.params.id;
    console.log(`input type: ${typeof input}, input data: ${input}`);
    let data    = ( await database.get(["uuid", input]) ).value
    context.response.status = 200;
    context.response.body = JSON.stringify(( await database.get(["user", data.username, data.password]) ).value);
    context.response.type = "json";
})

router.get("/students/:academy", async (context) => {
    const input = context.request.url.searchParams.get("academy");
    const entries = database.list({ prefix: ["academy", input] });
    users = [];
    for await (const entry of entries) {
        users.push(entry.value); // { ... }
    }
    context.response.status = 200;
    context.response.body = users;
    context.response.type = "json"
    return;
});

router.delete("/deleteUser/:username",     async (context) => {
    const username = context.params.username;

    // Look up the user in the database
    const user = (await database.get(["user", username])).value;
    console.log("User deleting: " + username);
    console.log("user data: " + user);

    if (user) {
        // Delete the user from the database
        await database.delete(["user", username]);

        // Delete associated entries from the secondary account
        const academy = user.academy; // Assuming user data contains 'academy' field
        await database.delete(["academy", academy, username]);
        context.response.status = 200;
        context.response.body = { message: 'User deleted successfully' };
    } else {
        context.response.status = 404;
        context.response.body = { message: 'User not found' };
        console.log("user not found: " + username)
    }
    context.response.type = "json";
    return;
});

// setup initialize app
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
    await context.send({
        root: `${Deno.cwd()}/`,
        index: "./index.html",
    });
});

console.log("Server is running");
await app.listen({ port });