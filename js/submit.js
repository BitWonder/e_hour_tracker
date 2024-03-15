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
            e.addEventListener("click", function () {document.getElementById(`img_${num_o_imag}`).remove()});
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

    const formData = new FormData();
    formData.append('id', sessionStorage.getItem('user_id'));
    formData.append('title', document.getElementById('title').value);
    formData.append('date', document.getElementById('datePicker').value);
    formData.append('amount', document.getElementById('hours').value);
    formData.append('submitted', new Date());
    formData.append('description', document.getElementById('description_text').value);

    const fileInput = document.getElementById('image_getter');
    images = []
    for (const file of fileInput.files) {
        images.push(file);
    }
    formData.append('images', images);

    try {
        const response = await fetch(`https://${window.location.host}/submitHours`, {
            method: 'POST',
            body: formData
        });

        if (response.status === 200) {
            // Handle success
            alert('Submission successful');
            return;
        } else {
            // Handle error
            alert('Submission failed');
            return;
        }
    } catch (error) {
        console.error('Error occurred during submission:', error);
        alert('Submission failed');
    }
}