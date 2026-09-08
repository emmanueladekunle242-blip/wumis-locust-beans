let cart = [];

window.addEventListener('scroll', () => {
  const backToTopButton = document.querySelector('.back-to-top');
  if (!backToTopButton) return;

  if (window.scrollY > 300) {
    backToTopButton.style.opacity = '1';
    backToTopButton.style.visibility = 'visible';
    backToTopButton.style.transform = 'translateY(0)';
  } else {
    backToTopButton.style.opacity = '0';
    backToTopButton.style.visibility = 'hidden';
    backToTopButton.style.transform = 'translateY(12px)';
  }
});

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function showCartStatus(message, type = 'success') {
  const status = document.getElementById('cart-status');
  if (!status) return;

  status.textContent = message;
  status.classList.toggle('success', type === 'success');
}

function getQuantity(quantityId) {
  const input = document.getElementById(quantityId);
  if (!input) return 1;

  const value = Number.parseInt(input.value, 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function addpackToCart(product, price, quantityId) {
  const quantity = getQuantity(quantityId);
  cart.push({
    product: product,
    price: Number(price),
    quantity: quantity
  });

  showCartStatus(`${product} added to cart!`);
  displayCart();
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function displayCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const subtotal = document.getElementById('subtotal');
  const emptyCartMessage = document.getElementById('empty-cart-message');

  if (!cartItems || !cartTotal || !subtotal || !emptyCartMessage) {
    return;
  }

  cartItems.innerHTML = '';
  const total = getSubtotal();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    cartItems.style.display = 'none';
    emptyCartMessage.style.display = 'block';
    cartTotal.textContent = '0';
    subtotal.textContent = '0';
    updateCartCount();
    return;
  }

  cartItems.style.display = 'grid';
  emptyCartMessage.style.display = 'none';

  cart.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';

    const itemTotal = item.price * item.quantity;
    itemElement.innerHTML = `
      <div class="cart-item-top">
        <span class="cart-item-name">${item.product}</span>
        <button type="button" onclick="removeFromCart(${index})">Remove</button>
      </div>
      <div class="cart-item-line">₦${item.price} × ${item.quantity} = ₦${itemTotal}</div>
    `;

    cartItems.appendChild(itemElement);
  });

  subtotal.textContent = total;
  cartTotal.textContent = total;
  updateCartCount();

  if (itemCount > 0) {
    showCartStatus(`You have ${itemCount} item${itemCount > 1 ? 's' : ''} in your cart.`);
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  displayCart();
}

function checkoutWhatsapp() {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add at least one pack before checking out.');
    return;
  }

  const nameField = document.getElementById('customer-name');
  const phoneField = document.getElementById('customer-phone');
  const addressField = document.getElementById('customer-address');

  if (!nameField || !phoneField || !addressField) {
    alert('Customer details form is missing. Please refresh the page.');
    return;
  }

  const name = nameField.value.trim();
  const phone = phoneField.value.trim();
  const address = addressField.value.trim();

  if (!name || !phone || !address) {
    alert('Please fill in your name, phone number and delivery address.');
    return;
  }

  let total = 0;
  let message = '🛍️ NEW ORDER — WUMI\'S LOCUST BEANS%0A%0A';
  message += '👤 Customer: ' + name + '%0A';
  message += '📞 Phone: ' + phone + '%0A';
  message += '📍 Address: ' + address + '%0A%0A';
  message += 'ORDER%0A';

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    message += '• ' + item.product + ' × ' + item.quantity + ' = ₦' + itemTotal + '%0A';
    total += itemTotal;
  });

  message += '%0A💰 TOTAL: ₦' + total;

  const phoneNumber = '2348088003988';
  const whatsappURL = 'https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(message);
  window.open(whatsappURL, '_blank');
}

window.addEventListener('DOMContentLoaded', () => {
  displayCart();
});
