function next(user_json) {
    console.log(user_json);
    document.getElementById("academy").src = `../images/academy/${user_json.academy}.png`;
    document.getElementById("welcome").innerText = `Welcome ${user_json.full_name}!`;
    let pending_hours = 0;
    let place = document.getElementById("pending_hours");
    user_json.pending_hours.forEach(hour => {
        pending_hours += parseFloat(hour.amount);
        let p = document.createElement("div");
        if ( hour.hours == 1 ) {
            s1 = document.createElement("section");
            title = document.createElement("h3");
            title.innerText = hour.title;
            hour_text = document.createElement("p");
            hour_text.innerText = `${hour.amount} hour`;
            s1.append(title);
            s1.append(hour_text);
            s2 = document.createElement("section");
            description_title = document.createElement("h3");
            description_title.innerText = "Description:";
            description = document.createElement("p");
            description.innerText = `${hour.description}`;
            s2.append(description_title);
            s2.append(description);
            p.append(s1);
            p.append(s2);

        } else {
            s1 = document.createElement("section");
            title = document.createElement("h3");
            title.innerText = hour.title;
            hour_text = document.createElement("p");
            hour_text.innerText = `${hour.amount} hours`;
            s1.append(title);
            s1.append(hour_text);
            s2 = document.createElement("section");
            description_title = document.createElement("h3");
            description_title.innerText = "Description:";
            description = document.createElement("p");
            description.innerText = `${hour.description}`;
            s2.append(description_title);
            s2.append(description);
            p.append(s1);
            p.append(s2);
        }
        p.classList.add("hours");
        place.append(p);
    })
    if (!place.hasChildNodes()) {
        none = document.createElement("div");
        none.classList.add("none")
        text = document.createElement("p");
        text.innerText = "No Pending Hours";
        none.append(text);
        place.append(none);
    }

    // total hours aren't done yet
    let total_hours = 0;
    place = document.getElementById("accepted_hours");
    user_json.accepted_hours.forEach(hour => {
        total_hours += hour.amount;
        let p = document.createElement("div");
        if ( hour.hours == 1 ) {
            s1 = document.createElement("section");
            title = document.createElement("h3");
            title.innerText = hour.title;
            hour_text = document.createElement("p");
            hour_text.innerText = `${hour.amount} hour`;
            s1.append(title);
            s1.append(hour_text);
            s2 = document.createElement("section");
            title = document.createElement("h3");
            title.innerText = "Description:";
            hour_text = document.createElement("p");
            hour_text.innerText = `${hour.description}`;
            s2.append(title);
            s2.append(hour_text);
            p.append(s1);
            p.append(s2);
        } else {
            s1 = document.createElement("section");
            title = document.createElement("h3");
            title.innerText = hour.title;
            hour_text = document.createElement("p");
            hour_text.innerText = `${hour.amount} hours`;
            s1.append(title);
            s1.append(hour_text);
            s2 = document.createElement("section");
            title = document.createElement("h3");
            title.innerText = "Description:";
            hour_text = document.createElement("p");
            hour_text.innerText = `${hour.description}`;
            s2.append(title);
            s2.append(hour_text);
            p.append(s1);
            p.append(s2);
        }
        p.classList.add("hours");
        place.append(p);
    })
    if (!place.hasChildNodes()) {
        none = document.createElement("div");
        none.classList.add("none")
        text = document.createElement("p");
        text.innerText = "No Accepted Hours";
        none.append(text);
        place.append(none);
    }

    // denied isn't done yet
    place = document.getElementById("denied_hours");
    user_json.denied_hours.forEach(hour => {
        let p = document.createElement("div");
        if ( hour.hours == 1 ) {
            s1 = document.createElement("section");
            title = document.createElement("h3");
            title.innerText = hour.title;
            hour_text = document.createElement("p");
            hour_text.innerText = `${hour.amount} hour`;
            s1.append(title);
            s1.append(hour_text);
            s2 = document.createElement("section");
            title = document.createElement("h3");
            title.innerText = "Description:";
            hour_text = document.createElement("p");
            hour_text.innerText = `${hour.description}`;
            s2.append(title);
            s2.append(hour_text);
            p.append(s1);
            p.append(s2);
        } else {
            s1 = document.createElement("section");
            title = document.createElement("h3");
            title.innerText = hour.title;
            hour_text = document.createElement("p");
            hour_text.innerText = `${hour.amount} hours`;
            s1.append(title);
            s1.append(hour_text);
            s2 = document.createElement("section");
            description_title = document.createElement("h3");
            description_title.innerText = "Description:";
            description = document.createElement("p");
            description.innerText = `${hour.description}`;
            s2.append(description_title);
            s2.append(description);
            p.append(s1);
            p.append(s2);
        }
        p.classList.add("hours");
        place.append(p);
    })
    if (!place.hasChildNodes()) {
        none = document.createElement("div");
        none.classList.add("none")
        text = document.createElement("p");
        text.innerText = "No Denied Hours";
        none.append(text);
        place.append(none);
    }

    // the show amount of hours
    let needed = 400;
    if (user_json.needed_hours === undefined) {
        needed = 400;
    } else {
        needed = user_json.needed_hours;
    }
    let min_percent = total_hours   / (needed - 200);
    let min_pending = pending_hours / (needed - 200);
    let mid_percent = total_hours   / (needed - 100);
    let mid_pending = pending_hours / (needed - 100);
    let max_percent = total_hours   / needed;
    let max_pending = pending_hours / needed;
    let done_color = "var(--accent-color)"
    let pending_color = "lightblue"
    let not_done_color = "white"

    less_text = document.createElement("h3");
    minNeed = needed - 200;
    less_text.innerText = `${total_hours} / ${minNeed}`;

    mid_text = document.createElement("h3");
    midNeed = needed - 100;
    mid_text.innerText = `${total_hours} / ${midNeed}`;

    max_text = document.createElement("h3");
    maxNeed = needed;
    max_text.innerText = `${total_hours} / ${maxNeed}`;

    document.getElementById("less_hours").style = `background: linear-gradient(90deg, ${done_color} 0%, ${done_color} ${min_percent * 100}%, ${pending_color} ${min_percent * 100}%, ${pending_color} ${(min_pending + min_percent) * 100}%, ${not_done_color} ${(min_pending + min_percent) * 100}%, ${not_done_color} 100%); border: solid 1px black;`;
    document.getElementById("less_hours").append(less_text);
    document.getElementById("mid_hours").style = `background: linear-gradient(90deg, ${done_color} 0%, ${done_color} ${mid_percent * 100}%, ${pending_color} ${mid_percent * 100}%, ${pending_color} ${(mid_pending + mid_percent) * 100}%, ${not_done_color} ${(mid_pending + mid_percent) * 100}%, ${not_done_color} 100%); border: solid 1px black;`;
    document.getElementById("mid_hours").append(mid_text);
    document.getElementById("total_hours").style = `background: linear-gradient(90deg, ${done_color} 0%, ${done_color} ${max_percent * 100}%, ${pending_color} ${max_percent * 100}%, ${pending_color} ${(max_pending + max_percent) * 100}%, ${not_done_color} ${(max_percent + max_pending) * 100}%, ${not_done_color} 100%); border: solid 1px black;`;
    document.getElementById("total_hours").append(max_text);

}