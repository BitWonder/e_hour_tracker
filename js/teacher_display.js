let user_id = sessionStorage.getItem("user_id");
const response = await fetch(`https://${window.location.host}/user/${user_id}`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
});

next((await response.json()));

async function next(user_json) {
    document.getElementById("academy").src = `../images/academy/${user_json.academy}.png`;
    document.getElementById("welcome").innerText = `Welcome ${user_json.full_name}!`;
    let response = await fetch(`https://${window.location.host}/students/${user_json.academy}`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
    let students = await response.json();
    const place = document.getElementById("students")
    students.users.forEach(student => {
        console.log(student);
        let total_hours = 0;
        for (let request in student.requested) {
            total_hours += parseFloat(student.requested[parseInt(request)].amount);
        }
        let a = document.createElement("a");
        a.href = "./student.html";
        a.addEventListener("mouseover", function () {sessionStorage.setItem("student", student.username)}) // when clicked we can go to that var and get student that way
        let s = document.createElement("div");
        s.classList.add("student");
        let t = document.createElement("h3");
        t.innerText = student.full_name;
        let h = document.createElement("p");
        h.innerText = total_hours + " pending hours";
        s.append(t);
        s.append(h);
        a.append(s);
        place.append(a);
    });
}