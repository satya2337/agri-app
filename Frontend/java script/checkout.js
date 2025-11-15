document.addEventListener("DOMContentLoaded", loadCart);

const API_BASE = "https://agri-app-production.up.railway.app";

// ------------------- LOAD CART -------------------
async function loadCart() {
    const buyer_id = localStorage.getItem("buyer_id");

    if (!buyer_id) {
        alert("Please login first!");
        window.location.href = "buyer_login.html";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/cart/${buyer_id}`);
        const cart = await res.json();

        const container = document.getElementById("cartItems");
        const totalAmount = document.getElementById("totalAmount");

        container.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image_url}" alt="${item.title}">

                    <div class="info">
                        <h3>${item.title}</h3>
                        <p>Price: ₹${item.price}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Subtotal: ₹${subtotal}</p>
                    </div>

                    <button class="remove-btn" onclick="removeItem(${item.id})">
                        Remove
                    </button>
                </div>
            `;
        });

        totalAmount.textContent = `₹${total}`;
        localStorage.setItem("checkout_total", total);

    } catch (err) {
        console.log("Error:", err);
    }
}

// ------------------- REMOVE ITEM -------------------
async function removeItem(cart_id) {
    if (!confirm("Remove this item?")) return;

    const res = await fetch(`${API_BASE}/api/cart/remove/${cart_id}`, {
        method: "DELETE"
    });

    const data = await res.json();
    alert(data.message);

    loadCart(); // refresh cart
}

// ------------------- PLACE ORDER -------------------
async function placeOrder() {
    const buyer_id = localStorage.getItem("buyer_id");
    const total = localStorage.getItem("checkout_total");

    if (!buyer_id || !total) {
        return alert("Something went wrong! Please reload.");
    }

    try {
        const res = await fetch(`${API_BASE}/api/checkout/place-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                buyer_id,
                total
            })
        });

        const data = await res.json();
        if (!data.success) {
            return alert("Error: " + data.error);
        }

        alert("Order placed successfully!");

        window.location.href = "transaction.html";

    } catch (err) {
        console.log("Order error:", err);
        alert("Server error placing order!");
    }
}

// Button Listener
document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
