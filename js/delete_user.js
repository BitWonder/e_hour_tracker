document.getElementById("new").onsubmit = async function(event) {
    event.preventDefault();

    const response = await fetch(`https://${window.location.host}/deleteUser/${document.getElementById("user").value}`,
    {
        method: "delete", // *GET, POST, PUT, DELETE, etc.
    });

    if (response.status == 200) {
        document.getElementById("user").value = "";
        alert("Deleted!")
        return;
    }
    alert("Failed to Delete!");
    return;
}