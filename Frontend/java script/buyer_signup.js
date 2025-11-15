document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signupForm");
    const nameInput = document.getElementById("name");
    const contactInput = document.getElementById("contact");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const showPasswordCheckbox = document.getElementById("showPassword");
    const notification = document.getElementById("notification");

    // SHOW / HIDE PASSWORD
    showPasswordCheckbox.addEventListener("change", function () {
        passwordInput.type = this.checked ? "text" : "password";
    });

    // FORM SUBMISSION
    form.addEventListener("submit", function (event) {
        event.preventDefault(); 

        const name = nameInput.value.trim();
        const contact = contactInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // VALIDATION
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return displayNotification("Name must contain only letters.");
        }

        if (!/^\d{10}$/.test(contact)) {
            return displayNotification("Contact number must be 10 digits.");
        }

        if (!validateEmail(email)) {
            return displayNotification("Enter a valid email address.");
        }

        if (password.length < 6) {
            return displayNotification("Password must be at least 6 characters.");
        }

        // BACKEND REQUEST
        fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                phone: contact,
                email: email,
                password: password,
                role: "buyer"     // VERY IMPORTANT
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                displayNotification("Signup Successful! Redirecting...", true);
                
                setTimeout(() => {
                    window.location.href = "buyer_login.html";
                }, 1200);
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
