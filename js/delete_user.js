document.getElementById("new").onsubmit = async function(event) {
    event.preventDefault();

    const response = await fetch(`https://${window.location.host}/delete`,
    {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            username: document.getElementById("user").value,
        }), // body data type must match "Content-Type" header)
    });

    if (response.status == 200) {
        document.getElementById("user").value = "";
        alert("Created Successfully!")
        return;
    }
    alert("Failed to Create New Student!");
    return;
}