document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contentForm");
    const displayUI = document.getElementById("displayUI");
    const formContainer = document.getElementById("form1");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 
        document.getElementById("heading").innerText = document.getElementById("title_0").value;
        document.getElementById("para").innerText = document.getElementById("description_0").value;
        document.getElementById("jack").innerText = document.getElementById("author").value;
        document.getElementById("dynamicTitle").innerText = document.getElementById("title").value;
        document.getElementById("dynamicDescription").innerText = document.getElementById("description").value;

        const imageInput = document.getElementById("image");
        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("newimage").src = e.target.result;
            };
            reader.readAsDataURL(imageInput.files[0]);
        }

        document.getElementById("im_head").innerText = document.getElementById("im_title").value;
        document.getElementById("im_para").innerText = document.getElementById("im_description").value;
        document.getElementById("con1_heading").innerText = document.getElementById("con2_title").value;
        document.getElementById("con1_para").innerText = document.getElementById("con2_description").value;
        document.getElementById("con4_head").innerText = document.getElementById("img2_title").value;
        document.getElementById("con4_para").innerText = document.getElementById("img2_description").value;
        document.getElementById("last_head").innerText = document.getElementById("last_title").value;
        document.getElementById("last_para").innerText = document.getElementById("last_description").value;

        formContainer.style.display = "none";
        displayUI.style.display = "block";
    });
});