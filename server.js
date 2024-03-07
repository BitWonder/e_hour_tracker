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
const decoder = new TextDecoder();
const port = 1027;

// router gets go here
router.get("/login", async (context) => {
    let body = context.body;
    let data = JSON.parse(decoder.decode(body));
    if (await database.get(["users", data.username]).value.password == data.password) {
        let user = await database.get(["users", data.username]).value.user;
        ctx.response.status = 200;
        ctx.response.body = {user: user};
        ctx.response.type = "json";
        return
    }
    ctx.response.status = 401;
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
