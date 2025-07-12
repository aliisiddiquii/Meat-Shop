let cart = [];
let cartCount = 0;
let cartTotal = 0;

// DOM Elements
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeModal = document.getElementById('closeModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');
const checkoutForm = document.getElementById('checkoutForm');
const deliveryTimeSelect = document.getElementById('deliveryTimeSelect');
const scheduleContainer = document.getElementById('scheduleContainer');

// Toggle Cart Modal
cartButton.addEventListener('click', () => {
    cartModal.style.display = 'block';
    updateDeliveryTime();
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Search functionality
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Add to Cart function
function addToCart(name, price, unit) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1,
            unit: unit
        });
    }

    updateCart();
    showCartNotification(name);
}

// Update cart UI
function updateCart() {
    cartItemsContainer.innerHTML = '';
    cartCount = 0;
    cartTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        cartCount += item.quantity;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price} / ${item.unit}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
            </div>
            <div class="cart-item-price">
                ₹${itemTotal}
            </div>
            <span class="cart-item-remove" onclick="removeFromCart('${item.name}')">
                <i class="fas fa-times"></i>
            </span>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotalElement.textContent = cartTotal;
    cartCountElement.textContent = cartCount;
}

// Update item quantity in cart
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;

        // Remove item if quantity reaches 0
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.name !== name);
        }

        updateCart();
    }
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

// Show notification when item is added to cart
function showCartNotification(name) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `${name} added to cart!`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

// Proceed to checkout
function proceedToCheckout() {
    cartModal.style.display = 'none';
    checkoutForm.style.display = 'block';
    window.scrollTo({ top: checkoutForm.offsetTop, behavior: 'smooth' });
}

// Update delivery time based on cart contents
function updateDeliveryTime() {
    const deliveryTimeElement = document.getElementById('deliveryTime');
    let estimatedTime = '30-45 minutes';

    if (cart.length > 5) {
        estimatedTime = '45-60 minutes';
    } else if (cart.some(item => item.name.includes('Seafood'))) {
        estimatedTime = '40-55 minutes';
    }

    deliveryTimeElement.textContent = estimatedTime;
}

// Handle delivery time selection
deliveryTimeSelect.addEventListener('change', (e) => {
    if (e.target.value === 'specific') {
        scheduleContainer.style.display = 'block';
    } else {
        scheduleContainer.style.display = 'none';
    }
});

// Form submission
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty. Please add some items before checkout.');
        return;
    }

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    let deliveryTime = deliveryTimeSelect.value;

    if (deliveryTime === 'specific') {
        deliveryTime = document.getElementById('scheduledTime').value;
        if (!deliveryTime) {
            alert('Please select a date and time for delivery.');
            return;
        }
    }

    // Prepare order summary
    let orderSummary = `Order Received!\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\nDelivery Time: ${deliveryTime}\n\nOrder Items:\n`;

    cart.forEach(item => {
        orderSummary += `${item.name} - ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });

    orderSummary += `\nTotal: ₹${cartTotal}`;

    alert(orderSummary);

    // Reset everything
    this.reset();
    cart = [];
    updateCart();
    checkoutForm.style.display = 'none';
    scheduleContainer.style.display = 'none';
});

// Initialize with some styles for notification
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.5s forwards;
    }
    
    .fade-out {
        animation: fadeOut 0.5s forwards;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .quantity-btn {
        width: 25px;
        height: 25px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #dc3545;
    }
    
    .quantity-btn:hover {
        background-color: #c82333;
    }
    
    .quantity {
        min-width: 20px;
        text-align: center;
    }
`;
document.head.appendChild(style);