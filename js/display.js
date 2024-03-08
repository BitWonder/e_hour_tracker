let username = localStorage.getItem("username");
var json_user = false;
let url = `../users/${username}/${username}.json`;
var client = new XMLHttpRequest();
client.open('GET', url);
client.onloadend = function() {
    json_user = client.responseText;
    continue_function()
}
client.send();

// now for the formatting stuff
function continue_function() {
    let user = JSON.parse(json_user);
    document.getElementById("welcome").innerText = `Welcome, ${user.full_name}!`
    document.getElementById("academy").src = `../images/academy/${user.academy}.png`
    let total_hours = 0;
    user.hours.forEach(element => {
        total_hours += element.hours
        let place = document.getElementById("accepted_hours");
        let p = document.createElement("div");
        if ( element.hours == 1 ) {
            p.innerHTML = `<section><h3>${element.title}</h3> <p>${element.hours} hour</p></section> <section><h4>Description:</h4> </p>${element.description}</p></section> <section><h4>Comments:</h4> <p>No Comments</p></section>`;
        } else {
            p.innerHTML = `<section><h3>${element.title}</h3> <p>${element.hours} hours</p></section> <section><h4>Description:</h4> </p>${element.description}</p></section> <section><h4>Comments:</h4> <p>No Comments</p></section>`;
        }
        p.classList.add("hours");
        place.append(p);
    });
    let pending = 0;
    user.requested.forEach(element => {
        pending += element.hours
        // if error or no hours then don't show
        if (element.title === null || element.description === null || element.hours === null) {
            return
        }
        let place = document.getElementById("pending_hours");
        let p = document.createElement("div");
        if ( element.hours == 1 ) {
            p.innerHTML = `<section><h3>${element.title}</h3> <p>${element.hours} hour</p></section> <section><h4>Description:</h4> </p>${element.description}</p></section>`;
        } else {
            p.innerHTML = `<section><h3>${element.title}</h3> <p>${element.hours} hours</p></section> <section><h4>Description:</h4> </p>${element.description}</p></section>`;
        }
        p.classList.add("hours");
        place.append(p);
    });
    let min_precent = total_hours / 200;
    let min_pending = pending     / 200;
    let mid_precent = total_hours / 300;
    let mid_pending = pending     / 300;
    let max_precent = total_hours / 400;
    let max_pending = pending     / 400;
    let done_color = "var(--accent-color)"
    let pending_color = "lightblue"
    let not_done_color = "white"
    document.getElementById("less_hours").style = `background: linear-gradient(90deg, ${done_color} 0%, ${done_color} ${min_precent * 100}%, ${pending_color} ${min_precent * 100}%, ${pending_color} ${(min_pending + min_precent) * 100}%, ${not_done_color} ${(min_pending + min_precent) * 100}%, ${not_done_color} 100%); border: solid 1px black;`;
    document.getElementById("less_hours").innerHTML = `<h3>${total_hours} / 200</h3>`;
    document.getElementById("mid_hours").style = `background: linear-gradient(90deg, ${done_color} 0%, ${done_color} ${mid_precent * 100}%, ${pending_color} ${mid_precent * 100}%, ${pending_color} ${(mid_pending + mid_precent) * 100}%, ${not_done_color} ${(mid_pending + mid_precent) * 100}%, ${not_done_color} 100%); border: solid 1px black;`;
    document.getElementById("mid_hours").innerHTML = `<h3>${total_hours} / 300</h3>`;
    document.getElementById("total_hours").style = `background: linear-gradient(90deg, ${done_color} 0%, ${done_color} ${max_precent * 100}%, ${pending_color} ${max_precent * 100}%, ${pending_color} ${(max_pending + max_precent) * 100}%, ${not_done_color} ${(max_precent + max_pending) * 100}%, ${not_done_color} 100%); border: solid 1px black;`;
    document.getElementById("total_hours").innerHTML = `<h3>${total_hours} / 400</h3>`;
}