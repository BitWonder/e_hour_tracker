function next(user_json) {
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
        accept_button.addEventListener("onclick", async function () {await fetch(
            `https://${window.location.host}/handle_hours`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({
                    element: element,
                    comments: document.getElementsByClassName(`comments_${x}`)[0].value,
                    username: sessionStorage.getItem("student"),
                    type: "accept"
                })
            }
        );
        window.location.reload();});
        let reject_button = document.createElement("button"); // e 11
        reject_button.innerText = "Reject";
        reject_button.classList.add(`reject_${x}`);
        reject_button.addEventListener("onclick", async function () {await fetch(
            `https://${window.location.host}/handle_hours`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({
                    element: element,
                    comments: document.getElementsByClassName(`comments_${x}`)[0].value,
                    username: sessionStorage.getItem("student"),
                    type: "reject"
                })
            }
        );
        window.location.reload();});
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
    });
}