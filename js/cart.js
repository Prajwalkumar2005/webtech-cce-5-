/**
 * BAGÉRA - Cart & Wishlist Manager
 * Handles Cart persistence, Quantity calculations, Drawer UI,
 * Wishlist storage, Toast notifications, and Checkout integration.
 */

// LocalStorage Keys
const CART_STORAGE_KEY = "bagera_cart_items";
const WISHLIST_STORAGE_KEY = "bagera_wishlist_items";

// Cart State
let bageraCart = [];
let bageraWishlist = [];

// Initialize Cart & Wishlist on load
function initCartAndWishlist() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      bageraCart = JSON.parse(savedCart);
    }
  } catch (e) {
    console.warn("Could not load cart from localStorage", e);
    bageraCart = [];
  }

  try {
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      bageraWishlist = JSON.parse(savedWishlist);
    }
  } catch (e) {
    console.warn("Could not load wishlist from localStorage", e);
    bageraWishlist = [];
  }

  updateCartBadges();
  updateWishlistBadges();
  renderCartDrawer();
  renderWishlistDrawer();
}

// Save Cart to LocalStorage
function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(bageraCart));
  updateCartBadges();
  renderCartDrawer();
}

// Save Wishlist to LocalStorage
function saveWishlist() {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(bageraWishlist));
  updateWishlistBadges();
  renderWishlistDrawer();
}

// Add item to Cart
function addToCart(itemId, qty = 1, customBundle = null) {
  const item = ALL_CATALOG_ITEMS.find(p => p.id === itemId);
  if (!item && !customBundle) return;

  const cartItemId = customBundle ? `bundle-${Date.now()}` : itemId;
  const existingIndex = bageraCart.findIndex(cartItem => cartItem.cartId === cartItemId || (!customBundle && cartItem.id === itemId));

  if (existingIndex > -1) {
    bageraCart[existingIndex].quantity += qty;
    showToast(`Updated "${bageraCart[existingIndex].name}" quantity to ${bageraCart[existingIndex].quantity}`, "🛍️");
  } else {
    if (customBundle) {
      bageraCart.push({
        cartId: cartItemId,
        id: customBundle.id,
        name: customBundle.name,
        price: customBundle.price,
        image: customBundle.image,
        fallbackImage: customBundle.fallbackImage || "assets/images/bag-cherry-mini.svg",
        category: "Custom Bundle",
        quantity: qty,
        bundleDetails: customBundle.details || "Bag + Custom Sticker Pack"
      });
      showToast(`Added Custom Bundle to your bag! 💖`, "✨");
    } else {
      bageraCart.push({
        cartId: cartItemId,
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        fallbackImage: item.fallbackImage,
        category: item.category,
        quantity: qty
      });
      showToast(`Added "${item.name}" to your bag! 💕`, "🛍️");
    }
  }

  saveCart();
  openCartDrawer();
}

// Remove item from Cart
function removeFromCart(cartId) {
  const item = bageraCart.find(i => i.cartId === cartId || i.id === cartId);
  bageraCart = bageraCart.filter(i => (i.cartId || i.id) !== cartId);
  saveCart();
  if (item) {
    showToast(`Removed "${item.name}" from your bag`, "🗑️");
  }
}

// Update quantity
function updateCartQuantity(cartId, change) {
  const item = bageraCart.find(i => (i.cartId || i.id) === cartId);
  if (!item) return;

  const newQty = item.quantity + change;
  if (newQty <= 0) {
    removeFromCart(cartId);
  } else {
    item.quantity = newQty;
    saveCart();
  }
}

// Clear cart
function clearCart() {
  bageraCart = [];
  saveCart();
}

// Cart Subtotal & Summary calculations
function getCartCalculations() {
  const itemCount = bageraCart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = bageraCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingThreshold = 299;
  const shipping = subtotal === 0 ? 0 : (subtotal >= shippingThreshold ? 0 : 29);
  const discount = 0; // standard baseline
  const total = subtotal + shipping - discount;

  return {
    itemCount,
    subtotal,
    shipping,
    shippingThreshold,
    awayFromFreeShipping: Math.max(0, shippingThreshold - subtotal),
    total
  };
}

// Update Badge Counts in Navigation
function updateCartBadges() {
  const { itemCount } = getCartCalculations();
  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach(badge => {
    badge.textContent = itemCount;
    badge.style.display = itemCount > 0 ? "flex" : "none";
  });
}

// Toggle Wishlist Item
function toggleWishlist(itemId) {
  const item = ALL_CATALOG_ITEMS.find(p => p.id === itemId);
  if (!item) return;

  const index = bageraWishlist.findIndex(id => id === itemId);
  if (index > -1) {
    bageraWishlist.splice(index, 1);
    showToast(`Removed from Wishlist`, "🤍");
  } else {
    bageraWishlist.push(itemId);
    showToast(`Saved "${item.name}" to your Wishlist! 💖`, "❤️");
  }

  saveWishlist();
  updateWishlistButtons(itemId);
}

function isInWishlist(itemId) {
  return bageraWishlist.includes(itemId);
}

function updateWishlistBadges() {
  const count = bageraWishlist.length;
  const badges = document.querySelectorAll(".wishlist-count-badge");
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  });
}

function updateWishlistButtons(itemId = null) {
  const buttons = document.querySelectorAll(`[data-wishlist-id]`);
  buttons.forEach(btn => {
    const id = btn.getAttribute("data-wishlist-id");
    if (!itemId || id === itemId) {
      if (isInWishlist(id)) {
        btn.classList.add("active");
        btn.setAttribute("aria-label", "Remove from Wishlist");
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#8F1728" stroke="#8F1728" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-label", "Add to Wishlist");
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
      }
    }
  });
}

// Render Cart Drawer Content
function renderCartDrawer() {
  const cartContainer = document.getElementById("cart-drawer-items");
  const cartSubtotalEl = document.getElementById("cart-subtotal");
  const cartShippingEl = document.getElementById("cart-shipping");
  const cartTotalEl = document.getElementById("cart-total");
  const freeShippingBar = document.getElementById("free-shipping-progress");
  const freeShippingText = document.getElementById("free-shipping-text");
  const checkoutBtn = document.getElementById("cart-checkout-btn");

  if (!cartContainer) return;

  const calcs = getCartCalculations();

  if (bageraCart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <img src="assets/images/sticker-cherries.svg" alt="Empty Bag" width="90">
        </div>
        <h3 class="empty-state-title">Your bag is empty!</h3>
        <p class="empty-state-desc">Your outfit is waiting. Explore our cute collection and pick your little companion.</p>
        <a href="shop.html" class="btn btn-primary" onclick="closeCartDrawer()">Explore Cute Bags →</a>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = "₹0";
    if (cartShippingEl) cartShippingEl.textContent = "₹0";
    if (cartTotalEl) cartTotalEl.textContent = "₹0";
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (freeShippingText) freeShippingText.innerHTML = `Add ₹${calcs.shippingThreshold} for <strong>FREE Delivery</strong> ✨`;
    if (freeShippingBar) freeShippingBar.style.width = "0%";
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;
  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${calcs.subtotal}`;
  if (cartShippingEl) {
    cartShippingEl.innerHTML = calcs.shipping === 0 ? `<span class="text-success">FREE</span>` : `₹${calcs.shipping}`;
  }
  if (cartTotalEl) cartTotalEl.textContent = `₹${calcs.total}`;

  // Free shipping meter
  if (freeShippingBar && freeShippingText) {
    const percent = Math.min(100, Math.round((calcs.subtotal / calcs.shippingThreshold) * 100));
    freeShippingBar.style.width = `${percent}%`;
    if (calcs.awayFromFreeShipping > 0) {
      freeShippingText.innerHTML = `Add <strong>₹${calcs.awayFromFreeShipping}</strong> more to unlock <strong>FREE Delivery</strong> 🚚`;
    } else {
      freeShippingText.innerHTML = `🎉 You unlocked <strong>FREE Delivery!</strong>`;
    }
  }

  // Generate cart items HTML
  cartContainer.innerHTML = bageraCart.map(item => {
    const key = item.cartId || item.id;
    return `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='${item.fallbackImage || 'assets/images/bag-cherry-mini.svg'}'">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-head">
            <h4 class="cart-item-title">${item.name}</h4>
            <button class="cart-item-remove" onclick="removeFromCart('${key}')" aria-label="Remove item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          ${item.bundleDetails ? `<p class="cart-item-meta">${item.bundleDetails}</p>` : `<p class="cart-item-meta">${item.category}</p>`}
          <div class="cart-item-footer">
            <div class="cart-quantity-selector">
              <button class="qty-btn" onclick="updateCartQuantity('${key}', -1)" aria-label="Decrease quantity">−</button>
              <span class="qty-count">${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartQuantity('${key}', 1)" aria-label="Increase quantity">+</button>
            </div>
            <div class="cart-item-price">₹${item.price * item.quantity}</div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Render Wishlist Drawer
function renderWishlistDrawer() {
  const container = document.getElementById("wishlist-drawer-items");
  if (!container) return;

  if (bageraWishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <img src="assets/images/sticker-heart.svg" alt="Empty Wishlist" width="80">
        </div>
        <h3 class="empty-state-title">No favourites yet</h3>
        <p class="empty-state-desc">Click the little heart on any bag to save it here for later.</p>
        <a href="shop.html" class="btn btn-secondary" onclick="closeWishlistDrawer()">Explore Collection →</a>
      </div>
    `;
    return;
  }

  const wishlistProducts = bageraWishlist
    .map(id => ALL_CATALOG_ITEMS.find(p => p.id === id))
    .filter(Boolean);

  container.innerHTML = wishlistProducts.map(item => `
    <div class="wishlist-item">
      <div class="wishlist-item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='${item.fallbackImage || 'assets/images/bag-cherry-mini.svg'}'">
      </div>
      <div class="wishlist-item-details">
        <h4 class="wishlist-item-title">${item.name}</h4>
        <div class="wishlist-item-price">₹${item.price}</div>
        <div class="wishlist-item-actions">
          <button class="btn btn-sm btn-primary" onclick="addToCart('${item.id}'); toggleWishlist('${item.id}');">Move to Bag</button>
          <button class="btn-text" onclick="toggleWishlist('${item.id}')">Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

// UI Drawer Open & Close Functions
function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.add("open");
    overlay.classList.add("visible");
    document.body.classList.add("modal-open");
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.remove("open");
    overlay.classList.remove("visible");
    document.body.classList.remove("modal-open");
  }
}

function openWishlistDrawer() {
  const drawer = document.getElementById("wishlist-drawer");
  const overlay = document.getElementById("wishlist-overlay");
  if (drawer && overlay) {
    drawer.classList.add("open");
    overlay.classList.add("visible");
    document.body.classList.add("modal-open");
  }
}

function closeWishlistDrawer() {
  const drawer = document.getElementById("wishlist-drawer");
  const overlay = document.getElementById("wishlist-overlay");
  if (drawer && overlay) {
    drawer.classList.remove("open");
    overlay.classList.remove("visible");
    document.body.classList.remove("modal-open");
  }
}

// Toast Notifications
function showToast(message, icon = "✨", duration = 3000) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "bagera-toast";
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger entrance
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  initCartAndWishlist();
  
  // Attach Cart Drawer Toggles
  document.querySelectorAll(".cart-drawer-trigger").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  // Attach Wishlist Drawer Toggles
  document.querySelectorAll(".wishlist-drawer-trigger").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openWishlistDrawer();
    });
  });

  // Attach Close Buttons
  const cartClose = document.getElementById("cart-drawer-close");
  const cartOverlay = document.getElementById("cart-overlay");
  if (cartClose) cartClose.addEventListener("click", closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

  const wishlistClose = document.getElementById("wishlist-drawer-close");
  const wishlistOverlay = document.getElementById("wishlist-overlay");
  if (wishlistClose) wishlistClose.addEventListener("click", closeWishlistDrawer);
  if (wishlistOverlay) wishlistOverlay.addEventListener("click", closeWishlistDrawer);
});
