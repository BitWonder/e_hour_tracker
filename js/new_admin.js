document.getElementById("new").onsubmit = async function(event) {
    event.preventDefault();

    const response = await fetch(`https://${window.location.host}/newUser`,
    {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: {
            username: document.getElementById("user").value,
            password: document.getElementById("password").value,
            academy: document.getElementById("academy").value,
            user: "student",
            data: JSON.stringify({
                full_name: document.getElementById("name").value,
                username: document.getElementById("user").value,
                password: document.getElementById("password"),
                academy: document.getElementById("academy"),
                user: document.getElementById("user_group"),
            })
        }, // body data type must match "Content-Type" header)
    });

    if (response.status == 200) {
        let name = document.getElementById("user").value;
        document.getElementById("name").value = "";
        document.getElementById("user").value = "";
        document.getElementById("password").value = "";
        document.getElementById("academy").value = "";
        s = document.createElement("p")
        s.innerText = `Created ${name} successfully`
        s.classList.add("good");
        document.getElementById("done").insertBefore(s, document.getElementById("done").firstChild);
        return;
    }
    let name = document.getElementById("user").value;
    s = document.createElement("p")
    s.innerText = `Failed to create ${name}`
    s.classList.add("bad");
    document.getElementById("done").insertBefore(s, document.getElementById("done").firstChild);
    return;
}