// Sample data for cart items (This would typically come from a database or API)
const cartItems = [
    { name: 'Wheat', price: 20.00, quantity: 2 },
    { name: 'Rice', price: 25.00, quantity: 1 },
    { name: 'Corn', price: 15.00, quantity: 3 },
];

// Function to display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    let total = 0; // Initialize total price

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal; // Add to total

        // Create item element
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    // Update total price
    document.getElementById('total-price').innerText = `Total: $${total.toFixed(2)}`;
}

// Handle checkout button click
document.getElementById('checkout-button').addEventListener('click', () => {
    alert('Proceeding to checkout...');
    // You can redirect to the checkout page or implement checkout logic here
});

// Call the display function to populate the cart on page load
displayCartItems();




// Function to add item to cart
function addToCart(productName, productPrice) {
    // Get the current cart from local storage or create a new one
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add the new item to the cart
    cart.push({ name: productName, price: productPrice });

    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Redirect to the cart page
    window.location.href = 'cart.html';
}

// Event listener for "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.getAttribute('data-product-name');
        const productPrice = this.getAttribute('data-product-price');
        addToCart(productName, productPrice);
    });
});








// Function to display cart items
function displayCartItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceDiv = document.getElementById('total-price');
    
    let total = 0;

    // Clear existing items
    cartItemsDiv.innerHTML = '';

    // Display each item
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `<p>${item.name} - $${item.price}</p>`;
        cartItemsDiv.appendChild(itemDiv);
        total += parseFloat(item.price);
    });

    // Update total price
    totalPriceDiv.innerText = `Total: $${total.toFixed(2)}`;
}

// Call the function on page load
window.onload = displayCartItems;
