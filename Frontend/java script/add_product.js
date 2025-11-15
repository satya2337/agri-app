document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("productForm");
    const notification = document.getElementById("responseMsg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Check if farmer logged in
        const farmer_id = localStorage.getItem("farmer_id");
        if (!farmer_id) {
            return show("Please login as Farmer first!");
        }

        // Read form fields
        const title = document.getElementById("title").value.trim();
        const description = document.getElementById("description").value.trim();
        const price = document.getElementById("price").value;
        const quantity = document.getElementById("quantity").value;
        const imageFile = document.getElementById("imageFile").files[0];

        if (!title || !description || !price || !quantity) {
            return show("All fields are required!");
        }

        if (!imageFile) {
            return show("Please choose an image file!");
        }

        // Create FormData to send file
        const data = new FormData();
        data.append("farmer_id", farmer_id);
        data.append("title", title);
        data.append("description", description);
        data.append("price", price);
        data.append("quantity", quantity);
        data.append("image", imageFile);

        try {
            const res = await fetch("http://localhost:5000/api/products/add", {
                method: "POST",
                body: data
            });

            const result = await res.json();

            if (result.success) {
                show("Product added successfully!", true);
                form.reset();
            } else {
                show("Error: " + result.error);
            }

        } catch (error) {
            show("Server error: " + error);
        }
    });

    // Show notification
    function show(msg, success = false) {
        notification.style.display = "block";
        notification.style.color = success ? "green" : "red";
        notification.innerText = msg;

        setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    }

});
