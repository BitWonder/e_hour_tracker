// Deno code goes here!
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// database setup
const database = await Deno.openKv();
console.log("database setup");

// key value where key can contain two things... the academy and the username
if (await database.get(["users", "admin"]) === undefined) {
    // the all academy is for later... don't want to go back and convolutedly find the group their apart of by secondary key
    console.log("making first admin");
    await new_admin("admin", "V!o1€n7C0nserv@7iv€DueToC0ntr@ctAgr3€", "all", "admin");
}

// to make user admin is set and accessible... once committed their is no going back
let x = database.list({prefix: ["academy", "all"]});
for await (const entry of x) {
    entry.key; // ["users", "alice"]
    entry.value; // { name: "Alice" }
  }

console.log(await database.get([]));

// using one-to-many found : https://docs.deno.com/deploy/kv/manual/secondary_indexes
// data needs to be a JSON stringed
// academy user is in for group
async function new_user(username, group, data) {
    const primaryKey   = ["users", username];
    const secondaryKey = ["academy", group, username];
    await database.atomic()
        .check({key: primaryKey})
        .set(primaryKey, data)
        .set(secondaryKey, data)
        .commit();
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