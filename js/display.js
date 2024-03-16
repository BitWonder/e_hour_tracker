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
        total_hours += parseFloat(hour.amount);
        let p = document.createElement("div");
        if ( hour.hours == 1 ) {
            let s1 = document.createElement("section");
            let title_s1 = document.createElement("h3");
            title_s1.innerText = hour.title;
            let hour_text_s1 = document.createElement("p");
            hour_text_s1.innerText = `${hour.amount} hour`;
            s1.append(title_s1);
            s1.append(hour_text_s1);
            s2 = document.createElement("section");
            let title = document.createElement("h3");
            title.innerText = "Description:";
            let hour_text = document.createElement("p");
            hour_text.innerText = `${hour.description}`;
            s2.append(title);
            s2.append(hour_text);
            let s3 = document.createElement("section");
            let comment_title = document.createElement("h3");
            comment_title.innerText = "Comments";
            let comment = document.createElement("p");
            comment.innerText = hour.comment;
            s3.append(comment_title);
            s3.append(comment);
            p.append(s1);
            p.append(s2);
            p.append(s3);
        } else {
            let s1 = document.createElement("section");
            let title_s1 = document.createElement("h3");
            title_s1.innerText = hour.title;
            let hour_text_s1 = document.createElement("p");
            hour_text_s1.innerText = `${hour.amount} hours`;
            s1.append(title_s1);
            s1.append(hour_text_s1);
            s2 = document.createElement("section");
            let title = document.createElement("h3");
            title.innerText = "Description:";
            let hour_text = document.createElement("p");
            hour_text.innerText = `${hour.description}`;
            s2.append(title);
            s2.append(hour_text);
            let s3 = document.createElement("section");
            let comment_title = document.createElement("h3");
            comment_title.innerText = "Comments";
            let comment = document.createElement("p");
            comment.innerText = hour.comment;
            s3.append(comment_title);
            s3.append(comment);
            p.append(s1);
            p.append(s2);
            p.append(s3);
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
            let s1 = document.createElement("section");
            let title_s1 = document.createElement("h3");
            title_s1.innerText = hour.title;
            let hour_text_s1 = document.createElement("p");
            hour_text_s1.innerText = `${hour.amount} hour`;
            s1.append(title_s1);
            s1.append(hour_text_s1);
            s2 = document.createElement("section");
            let title = document.createElement("h3");
            title.innerText = "Description:";
            let hour_text = document.createElement("p");
            hour_text.innerText = `${hour.description}`;
            s2.append(title);
            s2.append(hour_text);
            let s3 = document.createElement("section");
            let comment_title = document.createElement("h3");
            comment_title.innerText = "Comments";
            let comment = document.createElement("p");
            comment.innerText = hour.comment;
            s3.append(comment_title);
            s3.append(comment);
            p.append(s1);
            p.append(s2);
            p.append(s3);
        } else {
            let s1 = document.createElement("section");
            let title_s1 = document.createElement("h3");
            title_s1.innerText = hour.title;
            let hour_text_s1 = document.createElement("p");
            hour_text_s1.innerText = `${hour.amount} hours`;
            s1.append(title_s1);
            s1.append(hour_text_s1);
            s2 = document.createElement("section");
            let title = document.createElement("h3");
            title.innerText = "Description:";
            let hour_text = document.createElement("p");
            hour_text.innerText = `${hour.description}`;
            s2.append(title);
            s2.append(hour_text);
            let s3 = document.createElement("section");
            let comment_title = document.createElement("h3");
            comment_title.innerText = "Comments";
            let comment = document.createElement("p");
            comment.innerText = hour.comment;
            s3.append(comment_title);
            s3.append(comment);
            p.append(s1);
            p.append(s2);
            p.append(s3);
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

    less_text = document.createElement("h3");
    minNeed = needed - 200;
    less_text.innerText = `${total_hours} / ${minNeed}`;
    document.getElementById("less_hours").append(less_text);
    document.getElementById("less_hours").classList.add("loaded");

    mid_text = document.createElement("h3");
    midNeed = needed - 100;
    mid_text.innerText = `${total_hours} / ${midNeed}`;
    document.getElementById("mid_hours").append(mid_text);
    document.getElementById("mid_hours").classList.add("loaded");

    max_text = document.createElement("h3");
    maxNeed = needed;
    max_text.innerText = `${total_hours} / ${maxNeed}`;
    document.getElementById("total_hours").append(max_text);
    document.getElementById("total_hours").classList.add("loaded");
    // loaded is for if someone can figure out how to smooth transition

    var root = document.querySelector(':root');

    root.style.setProperty('--done-min-amount', `${min_percent * 100}%`);
    root.style.setProperty('--pending-min-amount', `${min_pending * 100}%`);

    root.style.setProperty('--done-mid-amount', `${mid_percent * 100}%`);
    root.style.setProperty('--pending-mid-amount', `${mid_pending * 100}%`);

    root.style.setProperty('--done-max-amount', `${max_percent * 100}%`);
    root.style.setProperty('--pending-max-amount', `${max_pending * 100}%`);

}