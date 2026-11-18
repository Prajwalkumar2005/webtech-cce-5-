/**
 * BAGÉRA - Main Application Script
 * Orchestrates Homepage interactions, Quick View, Search modal,
 * Checkout simulation, Bundle customizer, and Newsletter validation.
 */

// Global State for Interactive Bundle Customizer
const bundleState = {
  selectedBag: BAGERA_PRODUCTS[0], // default: Cherry Pop Mini Bag (₹199)
  selectedPack: BAGERA_STICKERS[0], // default: Cute Chaos Sticker Pack (₹79)
  bundleDiscount: 29 // Bundle savings
};

// Document Loaded Handler
document.addEventListener("DOMContentLoaded", () => {
  // Render Homepage Components if present
  renderFeaturedProducts();
  renderStickerClub();
  renderNewArrivals();
  initBundleCustomizer();
  initSearchModal();
  initMobileMenu();
  initNewsletter();
  initCheckoutFlow();
  initCategoryClicks();
});

/* ==========================================================================
   1. FEATURED PRODUCTS (HOMEPAGE)
   ========================================================================== */
function renderFeaturedProducts() {
  const container = document.getElementById("featured-products-grid");
  if (!container) return;

  // First 8 realistic products for homepage
  const featured = BAGERA_PRODUCTS.slice(0, 8);

  container.innerHTML = featured.map(prod => createProductCardHtml(prod)).join("");
  updateWishlistButtons();
}

/* Helper: Generate reusable Product Card HTML */
function createProductCardHtml(product) {
  const isWished = isInWishlist(product.id);
  const badgeHtml = product.badge
    ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>`
    : "";

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-card-visual">
        ${badgeHtml}
        <button class="wishlist-heart-btn ${isWished ? 'active' : ''}" 
                data-wishlist-id="${product.id}" 
                onclick="toggleWishlist('${product.id}')"
                aria-label="Save to Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWished ? '#8F1728' : 'none'}" stroke="${isWished ? '#8F1728' : 'currentColor'}" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <img src="${product.image}" 
             alt="${product.name}" 
             loading="lazy"
             onerror="this.onerror=null; this.src='${product.fallbackImage || 'assets/images/bag-cherry-mini.svg'}'">

        <button class="quick-view-overlay-btn" onclick="openQuickView('${product.id}')">
          Quick View 👁️
        </button>
      </div>

      <div class="product-card-body">
        <span class="product-card-cat">${product.category}</span>
        <h3 class="product-card-title">${product.name}</h3>
        <div class="product-card-price-row">
          <span class="product-price">₹${product.price}</span>
        </div>
        <div class="product-card-footer">
          <button class="btn-add-cart" onclick="addToCart('${product.id}')">
            <span>Add to Bag</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   2. THE STICKER CLUB
   ========================================================================== */
function renderStickerClub() {
  // Render 3 Sticker Packs
  const packsContainer = document.getElementById("sticker-packs-grid");
  if (packsContainer) {
    const packs = BAGERA_STICKERS.filter(s => s.category === "Sticker Pack");
    packsContainer.innerHTML = packs.map(pack => `
      <div class="sticker-pack-card">
        <span class="sticker-pack-badge">${pack.badge || 'PACK'}</span>
        <div class="sticker-pack-img">
          <img src="${pack.image}" alt="${pack.name}" onerror="this.onerror=null; this.src='${pack.fallbackImage}'">
        </div>
        <h3 class="sticker-pack-title">${pack.name}</h3>
        <span class="sticker-pack-count">${pack.count}</span>
        <p class="sticker-pack-desc">${pack.description}</p>
        <div class="sticker-pack-price-row">
          <span class="sticker-pack-price">₹${pack.price}</span>
          <button class="btn btn-sm btn-primary" onclick="addToCart('${pack.id}')">Add Pack 💕</button>
        </div>
      </div>
    `).join("");
  }

  // Render Individual Stickers Gallery (Pinterest aesthetic)
  const singleContainer = document.getElementById("single-stickers-grid");
  if (singleContainer) {
    const singles = BAGERA_STICKERS.filter(s => s.category === "Sticker");
    singleContainer.innerHTML = singles.map(stk => `
      <div class="single-sticker-item" onclick="openStickerPreview('${stk.id}')" title="Click to inspect sticker">
        <div class="single-sticker-img">
          <img src="${stk.image}" alt="${stk.name}" onerror="this.onerror=null; this.src='${stk.fallbackImage}'">
        </div>
        <div class="single-sticker-name">${stk.name}</div>
        <div class="single-sticker-price">₹${stk.price}</div>
      </div>
    `).join("");
  }
}

/* ==========================================================================
   3. NEW ARRIVALS HORIZONTAL SHOWCASE
   ========================================================================== */
function renderNewArrivals() {
  const container = document.getElementById("new-arrivals-slider");
  if (!container) return;

  const newItems = BAGERA_PRODUCTS.filter(p => p.isNew || p.badge === "NEW");
  container.innerHTML = newItems.map(prod => createProductCardHtml(prod)).join("");
}

/* ==========================================================================
   4. BUNDLE & CUSTOMISE SECTION ("Your bag. Your rules.")
   ========================================================================== */
function initBundleCustomizer() {
  const bagOptions = [
    { id: "bag-1", name: "Cherry Pop Mini", price: 199, img: "assets/images/bag-cherry-mini.svg" },
    { id: "bag-2", name: "Everyday Canvas", price: 149, img: "assets/images/bag-canvas-tote.svg" },
    { id: "bag-3", name: "Blush Baguette", price: 199, img: "assets/images/bag-blush-shoulder.svg" }
  ];

  const packOptions = [
    { id: "pack-1", name: "Cute Chaos", price: 79, img: "assets/images/pack-cute-chaos.svg", previewSticker1: "assets/images/sticker-cherries.svg", previewSticker2: "assets/images/sticker-bow.svg" },
    { id: "pack-2", name: "Main Character", price: 89, img: "assets/images/pack-main-character.svg", previewSticker1: "assets/images/sticker-star.svg", previewSticker2: "assets/images/sticker-heart.svg" },
    { id: "pack-3", name: "Little Happy", price: 69, img: "assets/images/pack-happy-things.svg", previewSticker1: "assets/images/sticker-flower.svg", previewSticker2: "assets/images/sticker-coffee.svg" }
  ];

  const bagContainer = document.getElementById("bundle-bag-picker");
  const packContainer = document.getElementById("bundle-pack-picker");
  const previewBagImg = document.getElementById("bundle-preview-bag-img");
  const previewSticker1 = document.getElementById("bundle-preview-stk-1");
  const previewSticker2 = document.getElementById("bundle-preview-stk-2");
  const totalDisplay = document.getElementById("bundle-total-display");
  const addBundleBtn = document.getElementById("bundle-add-to-cart-btn");

  if (!bagContainer || !packContainer) return;

  let currentBag = bagOptions[0];
  let currentPack = packOptions[0];

  function renderPickerTiles() {
    bagContainer.innerHTML = bagOptions.map(bag => `
      <div class="custom-picker-tile ${bag.id === currentBag.id ? 'active' : ''}" data-bag-id="${bag.id}">
        <img src="${bag.img}" alt="${bag.name}">
        <span>${bag.name} (₹${bag.price})</span>
      </div>
    `).join("");

    packContainer.innerHTML = packOptions.map(pack => `
      <div class="custom-picker-tile ${pack.id === currentPack.id ? 'active' : ''}" data-pack-id="${pack.id}">
        <img src="${pack.img}" alt="${pack.name}">
        <span>${pack.name} (₹${pack.price})</span>
      </div>
    `).join("");

    // Attach click events
    bagContainer.querySelectorAll(".custom-picker-tile").forEach(tile => {
      tile.addEventListener("click", () => {
        const selectedId = tile.getAttribute("data-bag-id");
        currentBag = bagOptions.find(b => b.id === selectedId);
        updatePreview();
      });
    });

    packContainer.querySelectorAll(".custom-picker-tile").forEach(tile => {
      tile.addEventListener("click", () => {
        const selectedId = tile.getAttribute("data-pack-id");
        currentPack = packOptions.find(p => p.id === selectedId);
        updatePreview();
      });
    });
  }

  function updatePreview() {
    renderPickerTiles();

    if (previewBagImg) previewBagImg.src = currentBag.img;
    if (previewSticker1) previewSticker1.src = currentPack.previewSticker1;
    if (previewSticker2) previewSticker2.src = currentPack.previewSticker2;

    const bundleCombined = currentBag.price + currentPack.price;
    const bundleSavings = 29; // bundle discount
    const finalPrice = bundleCombined - bundleSavings;

    if (totalDisplay) {
      totalDisplay.innerHTML = `₹${finalPrice} <span style="font-size:0.85rem; color:var(--body-muted); text-decoration:line-through; font-weight:400;">₹${bundleCombined}</span>`;
    }
  }

  if (addBundleBtn) {
    addBundleBtn.addEventListener("click", () => {
      const bundleCombined = currentBag.price + currentPack.price - 29;
      const customBundleData = {
        id: `bundle-${currentBag.id}-${currentPack.id}`,
        name: `${currentBag.name} + ${currentPack.name} Bundle`,
        price: bundleCombined,
        image: currentBag.img,
        details: `Includes 1x ${currentBag.name} Handbag + 1x ${currentPack.name} Sticker Pack (Saved ₹29!)`
      };
      addToCart(null, 1, customBundleData);
    });
  }

  updatePreview();
}

/* ==========================================================================
   5. QUICK VIEW MODAL
   ========================================================================== */
function openQuickView(productId) {
  const product = ALL_CATALOG_ITEMS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("quick-view-modal");
  const body = document.getElementById("quick-view-modal-body");
  if (!modal || !body) return;

  const isWished = isInWishlist(product.id);
  const detailsList = product.details
    ? product.details.map(d => `<li>${d}</li>`).join("")
    : `<li>Premium handcrafted quality</li><li>Signature Bagéra cherry hardware</li><li>Includes protective dustbag</li>`;

  body.innerHTML = `
    <div class="quick-view-grid">
      <div class="quick-view-visual">
        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='${product.fallbackImage || 'assets/images/bag-cherry-mini.svg'}'">
      </div>
      <div class="quick-view-info">
        <span class="section-eyebrow">${product.category}</span>
        <h3>${product.name}</h3>
        <div class="quick-view-price">₹${product.price}</div>
        <p class="quick-view-desc">${product.description}</p>
        <ul class="quick-view-bullets">
          ${detailsList}
        </ul>
        <div style="display:flex; gap:14px; margin-top:20px;">
          <button class="btn btn-primary" style="flex-grow:1;" onclick="addToCart('${product.id}'); closeQuickView();">
            Add to Bag (₹${product.price})
          </button>
          <button class="btn btn-secondary" onclick="toggleWishlist('${product.id}');" style="padding:12px 18px;">
            ${isWished ? '❤️ Saved' : '🤍 Wishlist'}
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeQuickView() {
  const modal = document.getElementById("quick-view-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }
}

/* Modal for Single Sticker Preview */
function openStickerPreview(stickerId) {
  const sticker = BAGERA_STICKERS.find(s => s.id === stickerId);
  if (!sticker) return;

  const modal = document.getElementById("quick-view-modal");
  const body = document.getElementById("quick-view-modal-body");
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="quick-view-grid">
      <div class="quick-view-visual" style="display:flex; align-items:center; justify-content:center; padding:30px;">
        <img src="${sticker.image}" alt="${sticker.name}" style="max-height:260px; object-fit:contain;">
      </div>
      <div class="quick-view-info">
        <span class="section-eyebrow">The Sticker Club</span>
        <h3>${sticker.name}</h3>
        <div class="quick-view-price">₹${sticker.price}</div>
        <p class="quick-view-desc">${sticker.description}</p>
        <ul class="quick-view-bullets">
          <li>Die-cut premium vinyl with glossy finish</li>
          <li>Waterproof & scratch-resistant</li>
          <li>Perfect for laptops, phone cases, and tote bag tags</li>
          <li>Size: ${sticker.size || '6cm x 6cm'}</li>
        </ul>
        <button class="btn btn-primary" style="width:100%;" onclick="addToCart('${sticker.id}'); closeQuickView();">
          Add Sticker to Bag (₹${sticker.price})
        </button>
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

/* ==========================================================================
   6. GLOBAL LIVE SEARCH MODAL
   ========================================================================== */
function initSearchModal() {
  const modal = document.getElementById("search-modal");
  const input = document.getElementById("search-modal-input");
  const resultsContainer = document.getElementById("search-results-list");
  const openButtons = document.querySelectorAll(".search-modal-trigger");
  const closeButton = document.getElementById("search-modal-close");

  if (!modal || !input || !resultsContainer) return;

  function openSearch() {
    modal.classList.add("active");
    document.body.classList.add("modal-open");
    setTimeout(() => input.focus(), 100);
    renderSearchResults("");
  }

  function closeSearch() {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    input.value = "";
  }

  openButtons.forEach(btn => btn.addEventListener("click", (e) => {
    e.preventDefault();
    openSearch();
  }));

  if (closeButton) closeButton.addEventListener("click", closeSearch);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeSearch();
  });

  input.addEventListener("input", (e) => {
    renderSearchResults(e.target.value.trim().toLowerCase());
  });

  function renderSearchResults(query) {
    let matches = ALL_CATALOG_ITEMS;
    if (query.length > 0) {
      matches = ALL_CATALOG_ITEMS.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align:center; padding:30px 10px; color:var(--body-muted);">
          <p>No results found for "<strong>${query}</strong>".</p>
          <p style="font-size:0.85rem; margin-top:6px;">Try searching for "mini", "tote", "cherry", or "sticker".</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.slice(0, 6).map(item => `
      <div class="search-item-row" onclick="openQuickView('${item.id}'); closeSearch();">
        <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='${item.fallbackImage || 'assets/images/bag-cherry-mini.svg'}'">
        <div style="flex-grow:1;">
          <h4 style="font-size:0.95rem; color:var(--deep-burgundy); font-family:var(--font-serif);">${item.name}</h4>
          <span style="font-size:0.78rem; color:var(--body-muted);">${item.category}</span>
        </div>
        <div style="font-weight:700; color:var(--cherry-red); font-size:0.95rem;">₹${item.price}</div>
      </div>
    `).join("");
  }
}

/* ==========================================================================
   7. CHECKOUT DEMONSTRATION & ORDER CONFIRMATION
   ========================================================================== */
function initCheckoutFlow() {
  const checkoutBtn = document.getElementById("cart-checkout-btn");
  const modal = document.getElementById("checkout-modal");
  const closeBtn = document.getElementById("checkout-modal-close");
  const form = document.getElementById("checkout-form");

  if (!checkoutBtn || !modal) return;

  checkoutBtn.addEventListener("click", () => {
    closeCartDrawer();
    openCheckoutModal();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeCheckoutModal);

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      processCheckoutSubmission();
    });
  }
}

function openCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  const itemsContainer = document.getElementById("checkout-order-items");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const shippingEl = document.getElementById("checkout-shipping");
  const totalEl = document.getElementById("checkout-total");

  if (!modal) return;

  const calcs = getCartCalculations();

  if (itemsContainer) {
    itemsContainer.innerHTML = bageraCart.map(item => `
      <div class="checkout-summary-item">
        <span>${item.name} (x${item.quantity})</span>
        <span>₹${item.price * item.quantity}</span>
      </div>
    `).join("");
  }

  if (subtotalEl) subtotalEl.textContent = `₹${calcs.subtotal}`;
  if (shippingEl) shippingEl.textContent = calcs.shipping === 0 ? "FREE" : `₹${calcs.shipping}`;
  if (totalEl) totalEl.textContent = `₹${calcs.total}`;

  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }
}

function processCheckoutSubmission() {
  const nameInput = document.getElementById("checkout-name");
  const emailInput = document.getElementById("checkout-email");
  const phoneInput = document.getElementById("checkout-phone");
  const addressInput = document.getElementById("checkout-address");
  const cityInput = document.getElementById("checkout-city");
  const postalInput = document.getElementById("checkout-postal");

  let isValid = true;
  const inputs = [nameInput, emailInput, phoneInput, addressInput, cityInput, postalInput];

  inputs.forEach(input => {
    if (input) {
      if (!input.value.trim()) {
        input.classList.add("error");
        isValid = false;
      } else {
        input.classList.remove("error");
      }
    }
  });

  // Email format check
  if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
    emailInput.classList.add("error");
    isValid = false;
  }

  if (!isValid) {
    showToast("Please fill in all required shipping fields properly.", "⚠️");
    return;
  }

  // Simulation: Order Success!
  const orderId = `BAG-${Math.floor(100000 + Math.random() * 900000)}`;
  const calcs = getCartCalculations();
  const customerName = nameInput.value.trim();

  const checkoutCard = document.querySelector(".checkout-modal-card");
  if (checkoutCard) {
    checkoutCard.innerHTML = `
      <div class="order-confirmed-screen">
        <div class="confirmed-icon">
          <img src="assets/images/sticker-cherries.svg" alt="Success Cherry">
        </div>
        <span class="section-eyebrow">ORDER CONFIRMED</span>
        <h2 style="font-size:2.4rem; color:var(--deep-burgundy); margin:12px 0;">Thank you, ${customerName}!</h2>
        <p style="color:var(--body-muted); max-width:500px; margin:0 auto 24px auto;">
          Your little world is on its way. We have received your order <strong>#${orderId}</strong> for <strong>₹${calcs.total}</strong>. A confirmation email has been dispatched to <em>${emailInput.value.trim()}</em>.
        </p>
        <div style="background:var(--warm-ivory); border-radius:var(--radius-md); padding:20px; max-width:440px; margin:0 auto 28px auto; text-align:left;">
          <div style="font-size:0.85rem; color:var(--deep-burgundy); font-weight:700; margin-bottom:8px;">📦 Delivery Address:</div>
          <div style="font-size:0.88rem; color:var(--body-muted);">${addressInput.value}, ${cityInput.value} - ${postalInput.value}</div>
          <div style="font-size:0.85rem; color:var(--deep-burgundy); font-weight:700; margin-top:12px; margin-bottom:4px;">💳 Payment Mode:</div>
          <div style="font-size:0.88rem; color:var(--body-muted);">Cash on Delivery / UPI on Delivery (Demo)</div>
        </div>
        <button class="btn btn-primary" onclick="clearCart(); closeCheckoutModal(); window.location.href='index.html';">
          Continue Shopping 🛍️
        </button>
      </div>
    `;
  }

  // Clear cart and celebrate with toast
  clearCart();
  showToast(`Order #${orderId} placed successfully! 🎉`, "💖", 5000);
}

/* ==========================================================================
   8. CATEGORY CLICK REDIRECTION
   ========================================================================== */
function initCategoryClicks() {
  document.querySelectorAll("[data-category-target]").forEach(tile => {
    tile.addEventListener("click", () => {
      const cat = tile.getAttribute("data-category-target");
      window.location.href = `shop.html?category=${encodeURIComponent(cat)}`;
    });
  });
}

/* ==========================================================================
   9. NEWSLETTER VALIDATION
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  const input = document.getElementById("newsletter-email");
  const msg = document.getElementById("newsletter-msg");

  if (!form || !input || !msg) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      msg.textContent = "Please enter a valid email address, cutie!";
      msg.className = "newsletter-msg error";
      return;
    }

    msg.textContent = "Yay! You're on the BAGÉRA VIP list. Little surprises coming soon! 💕";
    msg.className = "newsletter-msg success";
    input.value = "";
    showToast("Welcome to the BAGÉRA VIP list! 💌", "✨");
  });
}

/* ==========================================================================
   10. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle-btn");
  const drawer = document.getElementById("mobile-nav-drawer");
  const overlay = document.getElementById("mobile-nav-overlay");
  const closeBtn = document.getElementById("mobile-nav-close");

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add("open");
    if (overlay) overlay.classList.add("visible");
    document.body.classList.add("modal-open");
  }

  function closeMenu() {
    drawer.classList.remove("open");
    if (overlay) overlay.classList.remove("visible");
    document.body.classList.remove("modal-open");
  }

  toggleBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);
}
