document.getElementById('datePicker').valueAsDate = new Date();

let x_number = 0

let firstRun = true

let num_o_imag = 0

function hours() {
    console.log("hours")
    let x = document.getElementById("hours").value
    if (x <= 8) {
        if (document.getElementById("description").innerText == "5 or more sentences!") {
            return
        }
        document.getElementById("description").innerText = "5 or more sentences!";
    } else if ( x <= 16 ) {
        if (document.getElementById("description").innerText == "8 or more sentences!") {
            return
        }
        document.getElementById("description").innerText = "8 or more sentences!";
    } else if ( x <= 32 ) {
        if (document.getElementById("description").innerText == "10 or more sentences!") {
            return
        }
        document.getElementById("description").innerText = "10 or more sentences!";
    } else {
        if (document.getElementById("description").innerText == "20 or more sentences!") {
            return
        }
        document.getElementById("description").innerText = "20 or more sentences!";
    }
    if (firstRun == false) {
        document.getElementById("description").classList.add("emphasize");
        setTimeout(() => {
            document.getElementById("description").classList.remove("emphasize")
        }, 1500)
    }
    else {
        firstRun = false
    }
}

document.getElementById("hours").onchange = () => {hours()}

function previewFile() {
    const file = document.getElementById("image_getter").files[0];
    const reader = new FileReader();
          
    reader.addEventListener(
        "load",
        () => {
            // convert image file to base64 string
            let e = document.createElement("img");
            e.src = reader.result;
            e.classList.add("epic")
            e.setAttribute("id",`img_${num_o_imag}`)
            e.setAttribute("onclick",`document.getElementById(img_${num_o_imag}).remove()`)
            document.getElementById("place_images_here").append(e);
            num_o_imag += 1
        },
        false
    );
      
    if (file) {
        reader.readAsDataURL(file);
    }
}

hours()

function checkFirstVisit(){
    console.log(`was_visited = ${localStorage.getItem('was_visited')}`);
    if(localStorage.getItem('was_visited') == 1){
        return;
    }
    first_visit = true;
    localStorage.setItem('was_visited', 1);
    console.log("Showing")
    document.getElementById("description").innerText = "The number of sentences you need is determined by the amount of hours that you're submitting.\n Check here to see how many sentences you need";
    document.getElementById("description").classList.add("emphasize");
    setTimeout(() => {
        document.getElementById("description").classList.remove("emphasize")
    }, 1500)
}

checkFirstVisit();

document.getElementById("hour").onsubmit = async function(event) {
    event.preventDefault();

    let images = [];

    document.getElementById("place_images_here").childNodes.forEach(element => {
        images.push(element.src);
    })

    const response = await fetch(`https://${window.location.host}/submitHours`,
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
            id: localStorage.getItem("user_id"),
            title:  document.getElementById("title").value,
            date:   document.getElementById("date").value,
            amount: document.getElementById("hours").value,
            description: document.getElementById("description_text").value,
            images: images
        }), // body data type must match "Content-Type" header)
    });

    if (response.status == 200) {
        document.getElementById("title").value = "";
        document.getElementById("date").value = "";
        document.getElementById("hours").value = "";
        document.getElementById("description_text").value = "";
        document.getElementById("place_images_here").innerHTML = "";
        alert("Submitted!")
        return;
    }
    alert("Out of Sync!");
    return;
}