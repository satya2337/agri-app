document.addEventListener("DOMContentLoaded", function () {

    const API_BASE = "https://agri-app-production.up.railway.app";

    const form = document.getElementById("signupForm");
    const nameInput = document.getElementById("name");
    const contactInput = document.getElementById("contact");
    const emailInput = document.getElementById("email");
    const farmSizeInput = document.getElementById("farmSize");
    const cropTypeInput = document.getElementById("cropType");
    const passwordInput = document.getElementById("password");
    const showPasswordCheckbox = document.getElementById("showPassword");
    const notification = document.getElementById("notification");

    // SHOW / HIDE PASSWORD
    showPasswordCheckbox.addEventListener("change", function () {
        passwordInput.type = this.checked ? "text" : "password";
    });

    // FORM SUBMIT
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const contact = contactInput.value.trim();
        const email = emailInput.value.trim();
        const farmSize = farmSizeInput.value.trim();
        const cropType = cropTypeInput.value.trim();
        const password = passwordInput.value.trim();

        // VALIDATIONS
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return displayNotification("Name must contain only letters and spaces.");
        }

        if (!/^\d{10}$/.test(contact)) {
            return displayNotification("Contact number must be a 10-digit number.");
        }

        if (!validateEmail(email)) {
            return displayNotification("Please enter a valid email address.");
        }

        if (farmSize <= 0) {
            return displayNotification("Farm size must be a positive number.");
        }

        if (cropType === "") {
            return displayNotification("Please select your primary crop type.");
        }

        if (!/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$/.test(password)) {
            return displayNotification("Password must be at least 8 characters long and include letters and special characters.");
        }

        // BACKEND REQUEST (LIVE URL)
        const signupData = {
            name: name,
            phone: contact,
            email: email,
            role: "farmer",
            password: password
        };

        fetch(`${API_BASE}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signupData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                displayNotification("Signup Successful! Redirecting...", true);

                setTimeout(() => {
                    window.location.href = "farmer_login.html";
                }, 1500);
            } else {
                displayNotification("Error: " + data.error);
            }
        })
        .catch(err => {
            displayNotification("Server Error: " + err);
        });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function displayNotification(message, success = false) {
        notification.textContent = message;
        notification.style.display = "block";
        notification.style.backgroundColor = success ? "#4CAF50" : "#f44336";

        setTimeout(() => notification.style.display = "none", 3000);
    }
});
