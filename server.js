// Deno code goes here!
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// database setup
const database = Deno.openKv();
console.log("database setup");

// key value where key can contain two things... the academy and the username
database.then(async db => {
    if (await db.get(["users", "admin"]) === undefined) {
        // the all academy is for later... don't want to go back and convolutedly find the group their apart of by secondary key
        console.log("making first admin");
        await new_admin("admin", "V!o1€n7C0nserv@7iv€DueToC0ntr@ctAgr3€", "all", "admin");
    }

    // to make sure admin is set and accessible... once committed there is no going back
    var x = (await db.get(["users", "admin"]));
    console.log("Admin: " + x.value);
}).catch(error => {
    console.error("Error opening the database:", error);
});

// using one-to-many found: https://docs.deno.com/deploy/kv/manual/secondary_indexes
// data needs to be a JSON stringed
// academy user is in for group
async function new_user(username, group, data) {
    const primaryKey = ["users", username];
    const secondaryKey = ["academy", group, username];
    await database.then(db => {
        db.atomic()
            .check(primaryKey)
            .set(primaryKey, data)
            .set(secondaryKey, data)
            .commit()
    });
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
    console.log("context: " + context);
    console.log("context.request: " + context.request);
    console.log("context.request.body: " + context.request.body);
    console.log("context.request.body.json: " + context.request.body.json());
    const body = await context.request().body({ type: "json" }).value;
    console.log("Data: " + data)
    const user = await database.get(["users", body.username]);
    if (user && user.value.password === body.password) {
        context.response.status = 200;
        context.response.body = { user: user.value.user };
        context.response.type = "json";
        return;
    }
    context.response.status = 401;
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
