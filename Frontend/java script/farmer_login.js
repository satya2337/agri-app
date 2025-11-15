document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "https://agri-app-production.up.railway.app";

    const loginForm = document.getElementById("loginForm");
    const notification = document.getElementById("notification");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            return show("Please enter email & password");
        }

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!data.success) {
                return show("Error: " + data.error);
            }

            // ROLE CHECK → Only allow farmers
            if (data.user.role !== "farmer") {
                return show("This login is for FARMERS only!");
            }

            // SAVE USER OBJECT
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("farmer_id", data.user.id);

            show("Login Successful!", true);

            setTimeout(() => {
                window.location.href = "farmer_dashboard.html";
            }, 1000);

        } catch (err) {
            show("Server Error: " + err);
        }
    });

    function show(msg, success = false) {
        notification.textContent = msg;
        notification.style.display = "block";
        notification.style.backgroundColor = success ? "#4CAF50" : "#e63946";

        setTimeout(() => notification.style.display = "none", 2500);
    }
});
