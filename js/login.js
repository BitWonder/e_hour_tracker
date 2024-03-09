let attempts = 3

document.getElementById("login").onsubmit = async function(event) {
    event.preventDefault()

    if ( attempts <= 0 ) {
        return
    }

    let password = document.getElementById("password").value;
    let username = document.getElementById("username").value;
    const response = await fetch(`https://${window.location.host}/login`, {
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
            username: username,
            password: password
        }), // body data type must match "Content-Type" header
    });


    if (response.status == 200) {
        let user = await response.json()
        localStorage.setItem("user_id", user.id)
        if (user.user == "admin") {
            if (user.academy !== "all") {
                window.location.href = "./teacher/";
                return;
            }
            window.location.href = "./admin/";
            return;
        }
        window.location.href = "./student/";
        return;
    }
    attempts -= 1;
    alert(`You have ${attempts} attempts(s) left`);
    return;
}