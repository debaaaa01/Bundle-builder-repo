const addButtons = document.querySelectorAll('.add-btn');
const cartItemsDiv = document.getElementById('cart-items');
const subtotalText = document.getElementById('subtotal');
const discountText = document.getElementById('discount-text');
const progressText = document.getElementById('progress');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = {};

addButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.parentElement;
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const image = card.querySelector('img').src;

   

    // Add or increase quantity
    if (cart[id]) {
      cart[id].quantity += 1;
    } else {
      cart[id] = { name, price, quantity: 1, image };
      btn.classList.add('added');
      btn.textContent = 'Added to Bundle';
      btn.disabled = true;
    }

    updateCart();
  });
});

function updateCart() {
  cartItemsDiv.innerHTML = '';
  let subtotal = 0;

  Object.entries(cart).forEach(([id, item]) => {
    subtotal += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <p>${item.name}</p>
        <p>$${item.price}</p>
        <div class="qty-controls">
          <button onclick="decreaseQty('${id}')">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQty('${id}')">+</button>
        </div>
      </div>
      <button class="delete-btn" onclick="removeItem('${id}')">🗑️</button>
    `;
    cartItemsDiv.appendChild(div);
  });

  // Apply discount if 3 unique items
  let discount = 0;
  if (Object.keys(cart).length === 3) {
    discount = subtotal * 0.3;
    discountText.textContent = `Discount (30%): -$${discount.toFixed(2)}`;
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = 'Proceed to Checkout';
  } else {
    discountText.textContent = 'Add at least 3 products to save 30%';
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Add 3 items to proceed';
  }

  subtotalText.textContent = `Total: $${(subtotal - discount).toFixed(2)}`;
 
const bundleCount = Object.keys(cart).length;
const fill = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');

fill.style.width = `${(bundleCount / 3) * 100}%`;

if (bundleCount === 3) {
  progressLabel.textContent = ` Bundle Ready! 30% discount applied`;
  progressLabel.style.color = 'green';
} else {
  progressLabel.textContent = `${bundleCount}/3 products in bundle`;
  progressLabel.style.color = '#333';
}

}



function increaseQty(id) {
  cart[id].quantity += 1;
  updateCart();
}

function decreaseQty(id) {
  cart[id].quantity -= 1;
  if (cart[id].quantity === 0) {
    removeItem(id);
  } else {
    updateCart();
  }
}

function removeItem(id) {
  delete cart[id];
  updateCart();

  // Reset the button
  const card = document.querySelector(`.product-card[data-id="${id}"]`);
  const btn = card.querySelector('.add-btn');
  btn.disabled = false;
  btn.textContent = 'Add to Bundle +';
  btn.classList.remove('added');
}


document.getElementById("checkout-btn").addEventListener("click", function () {
  if (Object.keys(cart).length >= 3) {
    this.textContent = "✅ Items added to cart!";
    this.disabled = true;
  }
});

