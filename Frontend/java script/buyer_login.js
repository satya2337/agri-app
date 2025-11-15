document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const showPassword = document.getElementById("showPassword");
    const notification = document.getElementById("notification");

    // Show / Hide Password
    showPassword.addEventListener("change", () => {
        passwordInput.type = showPassword.checked ? "text" : "password";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // VALIDATION
        if (!validateEmail(email)) {
            return show("Please enter a valid email.");
        }
        if (password.length < 6) {
            return show("Password must be at least 6 characters.");
        }

        try {
            // BACKEND LOGIN API
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!data.success) {
                return show("Error: " + data.error);
            }

            // ROLE CHECK – only BUYER allowed here
            if (data.user.role !== "buyer") {
                return show("Access denied! This login is for BUYERS only.");
            }

            // SAVE FULL USER DATA EXACTLY AS BACKEND SENDS
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("buyer_id", data.user.id);

            show("Login Successful! Redirecting...", true);

            setTimeout(() => {
                window.location.href = "buyer_dashboard.html";
            }, 1000);

        } catch (err) {
            show("Server Error: " + err);
        }
    });

    // VALID EMAIL CHECK
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    // NOTIFICATION BOX
    function show(msg, success = false) {
        notification.textContent = msg;
        notification.style.display = "block";
        notification.style.backgroundColor = success ? "#4CAF50" : "#f44336";

        setTimeout(() => {
            notification.style.display = "none";
        }, 2500);
    }
});
