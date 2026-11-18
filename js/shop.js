/**
 * BAGÉRA - Shop Catalog & Filtering Controller
 * Supports Category filtering, Price range slider, New arrivals filter,
 * Sorting (price low/high, newest), and URL parameter sync.
 */

document.addEventListener("DOMContentLoaded", () => {
  initShopPage();
});

function initShopPage() {
  const shopGrid = document.getElementById("shop-products-grid");
  if (!shopGrid) return; // Exit if not on shop.html

  const categoryFilters = document.querySelectorAll(".filter-category-input");
  const priceRangeSlider = document.getElementById("filter-price-range");
  const priceDisplayVal = document.getElementById("filter-price-display");
  const newArrivalsCheckbox = document.getElementById("filter-new-arrivals");
  const sortSelect = document.getElementById("shop-sort-select");
  const resultCountEl = document.getElementById("shop-results-count");
  const resetFiltersBtn = document.getElementById("reset-filters-btn");
  const shopSearchInput = document.getElementById("shop-search-input");

  // Read URL query parameter for category or search
  const urlParams = new URLSearchParams(window.location.search);
  const paramCategory = urlParams.get("category");
  const paramSearch = urlParams.get("search");

  if (paramCategory) {
    categoryFilters.forEach(cb => {
      if (cb.value.toLowerCase() === paramCategory.toLowerCase()) {
        cb.checked = true;
      } else if (cb.value === "all") {
        cb.checked = false;
      }
    });
  }

  if (paramSearch && shopSearchInput) {
    shopSearchInput.value = paramSearch;
  }

  // Event Listeners
  if (categoryFilters) {
    categoryFilters.forEach(cb => {
      cb.addEventListener("change", (e) => {
        if (e.target.value === "all" && e.target.checked) {
          categoryFilters.forEach(c => { if (c.value !== "all") c.checked = false; });
        } else if (e.target.value !== "all" && e.target.checked) {
          const allCb = document.querySelector('.filter-category-input[value="all"]');
          if (allCb) allCb.checked = false;
        }
        applyFiltersAndSort();
      });
    });
  }

  if (priceRangeSlider) {
    priceRangeSlider.addEventListener("input", (e) => {
      if (priceDisplayVal) priceDisplayVal.textContent = `₹${e.target.value}`;
      applyFiltersAndSort();
    });
  }

  if (newArrivalsCheckbox) {
    newArrivalsCheckbox.addEventListener("change", applyFiltersAndSort);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", applyFiltersAndSort);
  }

  if (shopSearchInput) {
    shopSearchInput.addEventListener("input", applyFiltersAndSort);
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      categoryFilters.forEach(c => c.checked = (c.value === "all"));
      if (priceRangeSlider) {
        priceRangeSlider.value = 199;
        if (priceDisplayVal) priceDisplayVal.textContent = "₹199";
      }
      if (newArrivalsCheckbox) newArrivalsCheckbox.checked = false;
      if (sortSelect) sortSelect.value = "featured";
      if (shopSearchInput) shopSearchInput.value = "";
      applyFiltersAndSort();
    });
  }

  function applyFiltersAndSort() {
    let items = [...ALL_CATALOG_ITEMS];

    // 1. Category Filtering
    const selectedCategories = Array.from(categoryFilters)
      .filter(cb => cb.checked && cb.value !== "all")
      .map(cb => cb.value.toLowerCase());

    if (selectedCategories.length > 0) {
      items = items.filter(item => selectedCategories.includes(item.category.toLowerCase()));
    }

    // 2. Price Filtering
    if (priceRangeSlider) {
      const maxPrice = parseInt(priceRangeSlider.value, 10);
      items = items.filter(item => item.price <= maxPrice);
    }

    // 3. New Arrivals Only
    if (newArrivalsCheckbox && newArrivalsCheckbox.checked) {
      items = items.filter(item => item.isNew || item.badge === "NEW");
    }

    // 4. Shop Text Search
    if (shopSearchInput && shopSearchInput.value.trim().length > 0) {
      const query = shopSearchInput.value.trim().toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // 5. Sorting
    if (sortSelect) {
      const sortValue = sortSelect.value;
      if (sortValue === "price-low") {
        items.sort((a, b) => a.price - b.price);
      } else if (sortValue === "price-high") {
        items.sort((a, b) => b.price - a.price);
      } else if (sortValue === "newest") {
        items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      }
    }

    // Render Results
    if (resultCountEl) {
      resultCountEl.textContent = `Showing ${items.length} lovely pieces`;
    }

    if (items.length === 0) {
      shopGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 20px;">
          <div class="empty-state-icon">
            <img src="assets/images/sticker-cherries.svg" alt="No products" width="80">
          </div>
          <h3 class="empty-state-title">No matching pieces found</h3>
          <p class="empty-state-desc">Try loosening your filters or price slider to discover more cuties.</p>
          <button class="btn btn-secondary" onclick="document.getElementById('reset-filters-btn').click();">Reset Filters</button>
        </div>
      `;
      return;
    }

    shopGrid.innerHTML = items.map(prod => createProductCardHtml(prod)).join("");
    updateWishlistButtons();
  }

  // Initial Run
  applyFiltersAndSort();
}
