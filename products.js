const products = [
  {
    id: 1,
    name: "Classic Denim Jacket",
    price: 89.99,
    category: "men",
    image: "https://placehold.co/400x500/f5f5f5/333?text=Denim+Jacket",
    description: "Classic denim jacket, perfect for any occasion. Made with premium quality denim."
  },
  {
    id: 2,
    name: "Floral Summer Dress",
    price: 59.99,
    category: "women",
    image: "https://placehold.co/400x500/f5f5f5/333?text=Summer+Dress",
    description: "Beautiful floral summer dress. Lightweight and comfortable."
  },
  {
    id: 3,
    name: "Leather Sneakers",
    price: 79.99,
    category: "footwear",
    image: "https://placehold.co/400x500/f5f5f5/333?text=Sneakers",
    description: "Premium leather sneakers. Style meets comfort."
  },
  {
    id: 4,
    name: "Minimalist Watch",
    price: 129.99,
    category: "accessories",
    image: "https://placehold.co/400x500/f5f5f5/333?text=Watch",
    description: "Elegant minimalist watch. Stainless steel case."
  },
  {
    id: 5,
    name: "Wool Blend Coat",
    price: 149.99,
    category: "women",
    image: "https://placehold.co/400x500/f5f5f5/333?text=Wool+Coat",
    description: "Warm wool blend coat. Perfect for winter."
  },
  {
    id: 6,
    name: "Running Shoes",
    price: 99.99,
    category: "footwear",
    image: "https://placehold.co/400x500/f5f5f5/333?text=Running+Shoes",
    description: "Lightweight running shoes. Maximum comfort."
  },
  {
    id: 7,
    name: "Leather Backpack",
    price: 69.99,
    category: "accessories",
    image: "https://placehold.co/400x500/f5f5f5/333?text=Backpack",
    description: "Genuine leather backpack. Spacious and stylish."
  },
  {
    id: 8,
    name: "Cotton T-Shirt",
    price: 29.99,
    category: "men",
    image: "https://placehold.co/400x500/f5f5f5/333?text=T-Shirt",
    description: "Soft cotton t-shirt. Available in multiple colors."
  }
];

// Cart functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(el => {
    if (el) el.textContent = count;
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  showToast('Added to cart!');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  if (window.location.pathname.includes('cart.html')) {
    displayCart();
  }
}

function updateQuantity(productId, newQuantity) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      saveCart();
    }
  }
  if (window.location.pathname.includes('cart.html')) {
    displayCart();
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #84CC16;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 1000;
    animation: fadeInOut 2s;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function displayFeaturedProducts() {
  const grid = document.getElementById('featuredProducts');
  if (!grid) return;
  
  const featured = products.slice(0, 4);
  grid.innerHTML = featured.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">$${product.price}</div>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `).join('');
  
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(parseInt(btn.dataset.id));
    });
  });
  
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      window.location.href = `product.html?id=${id}`;
    });
  });
}

function displayCart() {
  const cartContainer = document.getElementById('cartItems');
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p style="text-align:center; padding:2rem;">Your cart is empty. <a href="shop.html">Continue shopping</a></p>';
    document.getElementById('cartTotal').textContent = '$0.00';
    return;
  }
  
  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>${item.name}</div>
      <div>$${item.price}</div>
      <div>
        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
      </div>
      <div>$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');
  
  document.getElementById('cartTotal').textContent = `$${getCartTotal().toFixed(2)}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  displayFeaturedProducts();
});