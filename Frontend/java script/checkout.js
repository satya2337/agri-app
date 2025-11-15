document.addEventListener("DOMContentLoaded", loadCart);

async function loadCart() {

    const buyer_id = localStorage.getItem("buyer_id");

    if (!buyer_id) {
        alert("Please login first!");
        window.location.href = "buyer_login.html";
        return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/cart/${buyer_id}`);
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

        totalAmount.textContent = total;

    } catch (err) {
        console.log("Error:", err);
    }
}


async function removeItem(cart_id) {
    if (!confirm("Remove this item?")) return;

    const res = await fetch(`http://localhost:5000/api/cart/remove/${cart_id}`, {
        method: "DELETE"
    });

    const data = await res.json();
    alert(data.message);

    loadCart(); // refresh cart
}
