// Deno code goes here!
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// database setup
const database = await Deno.openKv();
console.log("database setup");

// key value where key can contain two things... the academy and the username
if (await database.get(["users", "admin"]) === undefined) {
    // the all academy is for later... don't want to go back and convolutedly find the group their apart of by secondary key
    console.log("making first admin");
    //               name     password                                user   username
    await new_admin("admin", "V!o1€n7C0nserv@7iv€DueToC0ntr@ctAgr3€", "all", "admin");
}

// to make sure admin is set and accessible... once committed there is no going back
var x = (await database.get(["users", "admin"]));
console.log("Admin => " + x.value);
// using one-to-many found: https://docs.deno.com/deploy/kv/manual/secondary_indexes
// data needs to be a JSON stringed
// academy user is in for group
async function new_user(username, group, data) {
    const primaryKey = ["users", username];
    const secondaryKey = ["academy", group, username];
    await database.atomic()
        .check(primaryKey)
        .set(primaryKey, data)
        .set(secondaryKey, data)
        .commit()
}

async function new_admin(full_name, password, academy, username) {
    await new_user(username, academy, JSON.stringify({
        username: username,
        full_name: full_name,
        password: password,
        academy: academy,
        user: "admin"
    }));
}

async function new_student(full_name, password, academy, username) {
    await new_user(username, academy, JSON.stringify({
        username: username,
        full_name: full_name,
        password: password,
        academy: academy,
        user: "student",
        hours: [],
        requested: [],
        denied: []
    }));
}

const app = new Application();
const router = new Router();
const port = 1027;

// router gets go here
router.post("/login", async (context) => {
    try {
        const input = await context.request.body.text();
        let body = JSON.parse(input);
        console.log("Data: {" + body.username + ", " + body.password + "}");

        const userData = await database.get(["users", body.username]);
        if (!userData) {
            console.log("User not found");
            context.response.status = 401;
            return;
        }

        const user = JSON.parse(userData.value);
        console.log("User: {" + user.username + ", " + user.password + "}");

        if (user.password === body.password) {
            console.log("Login successful... sending 200");

            const sessionId = crypto.randomUUID();
            console.log("New Session ID: " + sessionId);

            await database.set([sessionId], user, { expireIn: 3600000 });

            context.response.status = 200;
            context.response.body = { user: user.user, id: sessionId };
            context.response.type = "json";
            console.log("Sending user: " + user.user);
            return;
        } else {
            console.log("Password incorrect... sending 401");
            context.response.status = 401;
            return;
        }
    } catch (error) {
        console.error("Error occurred:", error);
        context.response.status = 500;
        return;
    }
});

router.get("/user/:id", async (context) => {
    const userId = context.params.id;
    console.log("Fetching user with ID:", userId);
    const userRecord = (await database.get([userId])).value;
    console.log("User record from database:", userRecord);
    if (userRecord !== undefined) {
        context.response.status = 200;
        context.response.body = JSON.stringify(userRecord);
        context.response.type = "json";
        console.log("User found and sent successfully.");
        return;
    }
    console.log("User not found or error retrieving user data.");
    context.response.status = 401;
})

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