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
    
    // Check if user exists
    const userRecord = await database.get(primaryKey);
    if (!userRecord || typeof userRecord.value === "undefined") {
        return { ok: false };
    }
    
    // User exists, set data
    await database.set(primaryKey, data);
    await database.set(secondaryKey, data);
    return { ok: true };
}

async function new_admin(full_name, password, academy, username) {
    let response = await new_user(username, academy, JSON.stringify({
        username: username,
        full_name: full_name,
        password: password,
        academy: academy,
        user: "admin"
    }));
    return response;
}

async function new_student(full_name, password, academy, username) {
    console.log("Creating new student:");
    console.log("Full Name:", full_name);
    console.log("Password:", password);
    console.log("Academy:", academy);
    console.log("Username:", username);

    let studentObj = JSON.stringify({
        username: username,
        full_name: full_name,
        password: password,
        academy: academy,
        needed_hours: 400,
        user: "student",
        hours: [],
        requested: [],
        denied: []
    });

    console.log("Student Object: ", studentObj);

    let response = await new_user(username, academy, studentObj);

    console.log("Response from new_user:", response);

    return response;
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

router.post("/newStudent", async (context) => {
    const input = await context.request.body.text();
    let body = JSON.parse(input);
    console.log("Data: {" + body.full_name + ", " + body.password + ", " + body.academy + ", " + body.username + "}");
    let response = await new_student(body.full_name, body.password, body.academy, body.username);
    if ( response.ok == false) {
        context.response.status = 401;
        return;
    }
    context.response.status = 200;
    return;
});

router.post("/newAdmin", async (context) => {
    const input = await context.request.body.text();
    let body = JSON.parse(input);
    console.log("Data: {" + body.full_name + ", " + body.password + ", " + body.academy + ", " + body.username + ", " + body.user + "}");
    let response = await new_user(body.username, body.academy, JSON.stringify({
        username: body.username,
        full_name: body.full_name,
        password: body.password,
        academy: body.academy,
        user: body.user
    }));
    if ( response.ok == false) {
        context.response.status = 401;
        return;
    }
    context.response.status = 200;
    return;
});

router.post("/delete", async (context) => {
    const input = await context.request.body.text();
    let body = JSON.parse(input);

    // Log parsed data
    console.log("Parsed Data: {" + body.username + "}");

    let data = JSON.parse((await database.get(["users", body.username])).value);
    console.log("User data: " + data);
    let group = data.academy;

    // Log data retrieval and group determination
    console.log("Retrieved data for username: " + body.username);
    console.log("User belongs to academy group: " + group);

    // Delete user from academy group
    await database.delete(["academy", group, body.username]);
    console.log("User deleted from academy group: " + group);

    // Delete user from users database
    await database.delete(["users", body.username]);
    console.log("User data deleted: " + body.username);

    // Set response status
    context.response.status = 200;
    console.log("Response status set to 200");

    // End function
    return;
});

router.post("/submitHours", async (context) => {
    console.log("Received POST request to submit hours");

    const input = await context.request.body.text();
    console.log("Received input data:", input);

    let body = JSON.parse(input);
    console.log("Parsed input data:", body);

    let person = (await database.get([body.id])).value;
    console.log("Retrieved person data from database:", person);

    if (JSON.stringify(person) !== (await database.get(["users", person.username])).value) {
        console.log("Data inconsistency detected. Aborting submission.");
        context.request.status = 409;
        return;
    }

    console.log("No data inconsistency detected. Continuing with submission.");

    person.requested.push({
        title: body.title,
        date: body.date,
        amount: body.amount,
        description: body.description,
        images: body.images
    });
    console.log("Added submitted hours to person's requested list:", person.requested);

    await database.set(["users", person.username], JSON.stringify(person));
    console.log("Updated user data in the database:", person);

    await database.set(["academy", person.academy, person.username], JSON.stringify(person));
    console.log("Updated academy data in the database:", person);

    context.response.status = 200;
    console.log("Submission successful. Responding with status 200.");
    return;
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