async function handle(element, type, acc) {
    let class_name = element.className;
    let position = parseInt(class_name.substring(7)); // from 7th character to end
    var valueToSet = acc === "_" ? document.getElementsByClassName(`comments_${position}`)[0].value : document.getElementsByClassName(`comment2_${position}`)[0].value;
    // as told
    let parent_child;
    if (acc === "_") {
        // https://stackoverflow.com/questions/48129301/get-the-nth-child-of-a-div-by-pure-javascript
        parent_child = document.getElementById('students').children.item(position - 1);
    }
    else {
        parent_child = document.getElementById('hours').children.item(position - 1);
    }
    // reforming element from inputted data... this is a pain
    var data = {
        title: parent_child.children.item(1).innerText,
        amount: parseFloat(parent_child.children.item(2).innerText.split(" hours")),
        description: parent_child.children.item(4).innerText,
        date: parent_child.children.item(6).innerText.substring(15),
        submitted: parent_child.children.item(6).innerText.substring(14)
    }
    fetch(
        `https://${window.location.host}/handle${acc}hours`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                element: data,
                comments: valueToSet,
                username: sessionStorage.getItem("student"),
                type: type,
                position: ( position - 1 )
            })
        })
        .then(() => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Error occurred:', error);
            // Handle error appropriately
        });
}

function next(user_json) {
    document.getElementById("title_of_student_accepted").innerText = `${user_json.full_name} Accepted Hours`;
    let x = 0 
    user_json.pending_hours.forEach(element => {
        x += 1;
        let div = document.createElement("div");
        let h2 = document.createElement("h2"); // e 1
        h2.innerText = element.title;
        let hours = document.createElement("p"); // e 2
        hours.innerText = `${element.amount} hours`;
        let h3 = document.createElement("h3"); // e 3
        h3.innerText = "Description";
        let description = document.createElement("p"); // e 4
        description.innerText = element.description;
        let hr = document.createElement("hr"); // e 5
        let date_did = document.createElement("p"); // e 6
        date_did.innerText = `Activity done: ${element.date}`;
        let date_submitted = document.createElement("p"); // e 7
        date_submitted.innerText = `Submitted on: ${element.submitted}`;
        // the none use inputted stuff
        let comment_title = document.createElement("h3"); // e 8
        comment_title.innerText = "Comments:";
        let comments = document.createElement("textarea"); // e 9
        comments.classList.add(`comments_${x}`);
        // the buttons
        let accept_button = document.createElement("button"); // e 10
        accept_button.innerText = "Accept";
        accept_button.classList.add(`accept_${x}`);
        accept_button.addEventListener("click", async function () {await handle(this, "accept", "_")});
        let reject_button = document.createElement("button"); // e 11
        reject_button.innerText = "Reject";
        reject_button.classList.add(`reject_${x}`);
        reject_button.addEventListener("click", async function () {await handle(this, "reject", "_")});
        div.append(h2);
        div.append(hours);
        div.append(h3);
        div.append(description);
        div.append(hr);
        div.append(date_did);
        div.append(date_submitted);
        div.append(comment_title);
        div.append(comments);
        div.append(accept_button);
        div.append(reject_button);
        document.getElementById("students").append(div);
    });
    if (!document.getElementById("students").hasChildNodes()) {
        none = document.createElement("div");
        none.classList.add("none")
        text = document.createElement("p");
        text.innerText = "No Pending Hours Hours";
        none.append(text);
        document.getElementById("students").append(none);
    }

    let y = 0;
    user_json.accepted_hours.forEach(element => {
        y += 1;
        let div = document.createElement("div");
        let h2 = document.createElement("h2"); // e 1
        h2.innerText = element.title;
        let hours = document.createElement("p"); // e 2
        hours.innerText = `${element.amount} hours`;
        let h3 = document.createElement("h3"); // e 3
        h3.innerText = "Description";
        let description = document.createElement("p"); // e 4
        description.innerText = element.description;
        let hr = document.createElement("hr"); // e 5
        let date_did = document.createElement("p"); // e 6
        date_did.innerText = `Activity done: ${element.date}`;
        let date_submitted = document.createElement("p"); // e 7
        date_submitted.innerText = `Submitted on: ${element.submitted}`;
        // the none use inputted stuff
        let comment_title = document.createElement("h3"); // e 8
        comment_title.innerText = "Comments:";
        let comments = document.createElement("textarea"); // e 9
        comments.classList.add(`comment2_${y}`);
        // the button
        let reject_button = document.createElement("button"); // e 11
        reject_button.innerText = "Reject";
        reject_button.classList.add(`reject_${y}`);
        reject_button.addEventListener("click", async function () {await handle(this, "accept", "_acc_")});
        div.append(h2);
        div.append(hours);
        div.append(h3);
        div.append(description);
        div.append(hr);
        div.append(date_did);
        div.append(date_submitted);
        div.append(comment_title);
        div.append(comments);
        div.append(reject_button);
        document.getElementById("hours").append(div);
    });
    if (!document.getElementById("hours").hasChildNodes()) {
        none = document.createElement("div");
        none.classList.add("none")
        text = document.createElement("p");
        text.innerText = "No Accepted Hours";
        none.append(text);
        document.getElementById("hours").append(none);
    }
}