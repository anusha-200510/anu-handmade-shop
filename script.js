// ANU Handmade Shop
const WHATSAPP_NUMBER = "917483917115";

const categories = [
  { name: "All", icon: "✿", count: "Every little thing", image: "image/all.jpg.jpeg" },
  { name: "Single Flowers", icon: "🌷", count: "Little blooms", image: "image/singleFlower.jpg.jpeg.jpeg" },
  { name: "Bouquets", icon: "💐", count: "Bunches of joy", image: "image/baby-pink-bouqute.jpg.jpeg" },
  { name: "Customised Bouquets", icon: "🎀", count: "Made for you", image: "image/customise-bouqute.jpg.jpeg" },
  { name: "Curtain Holders", icon: "🪟", count: "Pretty details", image: "image/single-flower.jpg.jpeg.jpeg" },
  { name: "Lily Keychains", icon: "🔑", count: "Tiny keepsakes", image: "image/key-chains.jpg.jpeg.jpeg" },
  { name: "Hangings", icon: "🪻", count: "Hang a little joy", image: "image/hanging.jpg.jpeg" },
  { name: "Home Décor", icon: "🏡", count: "For your space", image: "image/home-decor.jpg.jpeg.jpeg" }
];

const products = [
  { id: 1, name: "Single Flower", category: "Single Flowers", price: 50, emoji: "🌷", image: "image/singleFlower.jpg.jpeg", color: "#dff3ff", badge: "HANDMADE", description: "One sweet handmade bloom." },
  { id: 2, name: "Blue Lily", category: "Single Flowers", price: 59, emoji: "🪷", image: "image/singleFlower.jpg.jpeg", color: "#dff3ff", badge: "POPULAR", description: "A little blue handmade lily." },
  { id: 3, name: "Lily Keychains", category: "Lily Keychains", price: 99, emoji: "🌸", image: "image/key-chains.jpg.jpeg", color: "#f1e9fb", badge: "GIFT IDEA", description: "Tiny flowers to take along." },
  { id: 4, name: "Small Bouquet", category: "Bouquets", price: 110, emoji: "💐", image: "image/baby-pink-bouqute.jpg.jpeg", color: "#f9e5ec", badge: "FAVOURITE", description: "A sweet little handmade bouquet." },
  { id: 5, name: "Luxury Rose Bouquet", category: "Bouquets", price: 1499, emoji: "💐", image: "image/cute-pink-bouquet.jpg.jpeg", color: "#f4e4ef", badge: "SPECIAL", description: "A luxury bouquet made with love." },
  { id: 6, name: "Home Decor", category: "Home Décor", price: 500, emoji: "🏡", image: "image/home-decor.jpg.jpeg", color: "#e2f4f7", badge: "HOME FAVOURITE", description: "A handmade touch for your space." },
  { id: 7, name: "Customised Bouquet", category: "Customised Bouquets", price: 0, emoji: "🎀", image: "image/baby-pink-bouqute.jpg.jpeg", color: "#f7edcf", badge: "CUSTOM", description: "Ask us for a price based on your design." },
  { id: 8, name: "Curtain Holders", category: "Curtain Holders", price: 0, emoji: "🌼", image: "image/single-flower.jpg.jpeg", color: "#e7f2e8", badge: "MADE TO ORDER", description: "Ask us for available designs and pricing." },
  { id: 9, name: "Flower Hanging", category: "Hangings", price: 0, emoji: "🌸", image: "image/home-decor.jpg.jpeg", color: "#e2f4f7", badge: "HANDMADE", description: "A little colour for your wall." },
  {
    id: 10,
    name: "Pink Luxury Bouquet",
    category: "Bouquets",
    price: 650,
    emoji: "💐",

    image: "image/pink-bouquet1.jpg.jpg",

    images: [
        "image/pink-bouquet1.jpg.jpg",
        "image/pink-bouquet2.jpg.jpeg",
        "image/pink-bouquet3.jpg.jpeg"
    ],

    color: "pink",
    badge: "SPECIAL",
    description: "A luxury bouquet made with love"
}
];

let activeCategory = "All";
let searchTerm = "";
let sortMode = "featured";

let cart = {};

try {
  cart = JSON.parse(localStorage.getItem("anuCart") || "{}");
} catch {
  cart = {};
}

const $ = id => document.getElementById(id);

const rupees = value =>
  value === 0
    ? "Ask for price"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }).format(value);


// CATEGORY DISPLAY
function renderCategories() {
  const el = $("categoryList");
  if (!el) return;

  el.innerHTML = categories.map(c => `
    <button class="category-card ${activeCategory === c.name ? "selected" : ""}"
            data-category="${c.name}">
      <span class="category-image">
        ${c.image
          ? `<img src="${c.image}" alt="${c.name}" onerror="this.style.display='none'">`
          : c.icon}
      </span>
      <strong>${c.name === "All" ? "All Products" : c.name}</strong>
      <small>${c.count}</small>
    </button>
  `).join("");

  el.querySelectorAll("[data-category]").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderCategories();
      renderProducts();
      $("shop")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-category-link]").forEach(a => {
    a.onclick = () => {
      activeCategory = a.dataset.categoryLink;
      renderCategories();
      renderProducts();
      $("mainNav")?.classList.remove("open");
    };
  });
}


// PRODUCT DISPLAY
function renderProducts() {
  let list = products.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name + " " + p.category + " " + p.description)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (sortMode === "price-low") list.sort((a, b) => a.price - b.price);
  if (sortMode === "price-high") list.sort((a, b) => b.price - a.price);
  if (sortMode === "name") list.sort((a, b) => a.name.localeCompare(b.name));

  if ($("shopTitle")) {
    $("shopTitle").innerHTML =
      activeCategory === "All"
        ? 'Featured <em>Products</em>'
        : `${activeCategory.replace("Customised", "Custom")} <em>Products</em>`;
  }

  if ($("activeFilter")) {
    $("activeFilter").hidden = activeCategory === "All" && !searchTerm;
  }

  if ($("filterLabel")) {
    $("filterLabel").textContent = [
      activeCategory !== "All" ? activeCategory : "",
      searchTerm ? `Search: “${searchTerm}”` : ""
    ].filter(Boolean).join(" · ");
  }

  const grid = $("productGrid");
  if (!grid) return;

  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-visual" style="background:${p.color}">
        <span class="badge">${p.badge}</span>

        ${p.image
          ? `<img src="${p.image}" alt="${p.name}" class="product-photo"
              onerror="this.style.display='none';this.nextElementSibling.style.display='inline-block'">`
          : ""}

        <span class="product-emoji" aria-hidden="true"
              style="${p.image ? "display:none" : ""}">${p.emoji}</span>

        <button class="quick-add" data-add="${p.id}"
                aria-label="Add ${p.name} to bag">＋</button>
      </div>

      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <h3 class="product-title">${p.name}</h3>
        <p class="product-description">${p.description}</p>

        <div class="product-price">${rupees(p.price)}</div>

        <div class="product-buttons">
          <button class="product-order" data-add="${p.id}">
            Add to Cart +
          </button>

          <button class="buy-now" data-buy="${p.id}">
            Buy Now 💗
          </button>
        </div>
      </div>
    </article>
  `).join("");

  if ($("emptyState")) {
    $("emptyState").hidden = list.length !== 0;
  }

  // ADD TO CART BUTTONS
  document.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(Number(btn.dataset.add));
    });
  });

  // BUY NOW BUTTONS
  document.querySelectorAll("[data-buy]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.buy);
      const product = products.find(p => p.id === id);

      if (!product) return;

      if (!whatsappReady()) {
        showToast("Please check your WhatsApp number in script.js.");
        return;
      }

      let message;

      if (product.price === 0) {
        message =
          `Hello ANU! 💙 I'm interested in ordering ${product.name}.\n\n` +
          `Please share the available designs and price.`;
      } else {
        message =
          `Hello ANU! 💙 I'd like to order:\n\n` +
          `Product: ${product.name}\n` +
          `Price: ${rupees(product.price)}\n` +
          `Quantity: 1\n\n` +
          `Please confirm availability and delivery charges.`;
      }

      window.open(makeWhatsAppLink(message), "_blank");
    });
  });
}


// CART FUNCTIONS
function saveCart() {
  localStorage.setItem("anuCart", JSON.stringify(cart));
  updateCart();
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  if (p.price === 0) {
    showToast("Please contact us for this custom item's price.");
    return;
  }

  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  showToast("Added to your bag ♡");
}

function cartEntries() {
  return Object.entries(cart)
    .filter(([id, qty]) => qty > 0 && products.some(p => p.id === Number(id)))
    .map(([id, qty]) => ({
      product: products.find(p => p.id === Number(id)),
      qty: Number(qty)
    }));
}

function updateCart() {
  const entries = cartEntries();
  const count = entries.reduce((s, e) => s + e.qty, 0);
  const total = entries.reduce((s, e) => s + e.product.price * e.qty, 0);

  if ($("cartCount")) $("cartCount").textContent = count;
  if ($("drawerCount")) $("drawerCount").textContent = `(${count})`;
  if ($("cartSubtotal")) $("cartSubtotal").textContent = rupees(total);

  if ($("cartEmpty")) $("cartEmpty").hidden = entries.length > 0;
  if ($("cartBottom")) $("cartBottom").hidden = entries.length === 0;

  if ($("cartItems")) {
    $("cartItems").innerHTML = entries.map(({ product: p, qty }) => `
      <div class="cart-line">
        <div class="cart-thumb" style="background:${p.color}">${p.emoji}</div>

        <div>
          <h4>${p.name}</h4>
          <p>${rupees(p.price)} each</p>

          <div class="qty-controls">
            <button data-qty="${p.id}" data-change="-1">−</button>
            <span>${qty}</span>
            <button data-qty="${p.id}" data-change="1">+</button>
          </div>
        </div>

        <div class="cart-line-price">
          ${rupees(p.price * qty)}
          <button class="remove-line" data-remove="${p.id}">Remove</button>
        </div>
      </div>
    `).join("");
  }

  document.querySelectorAll("[data-qty]").forEach(b => {
    b.onclick = () => {
      const id = b.dataset.qty;
      cart[id] = (cart[id] || 0) + Number(b.dataset.change);

      if (cart[id] <= 0) delete cart[id];

      saveCart();
    };
  });

  document.querySelectorAll("[data-remove]").forEach(b => {
    b.onclick = () => {
      delete cart[b.dataset.remove];
      saveCart();
    };
  });
}


// CART DRAWER
function openCart() {
  $("cartDrawer")?.classList.add("open");
  $("drawerBackdrop")?.classList.add("open");
  $("cartDrawer")?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  $("cartDrawer")?.classList.remove("open");
  $("drawerBackdrop")?.classList.remove("open");
  $("cartDrawer")?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}


// WHATSAPP
function makeWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

function whatsappReady() {
  return /^\d{10,15}$/.test(WHATSAPP_NUMBER.replace(/\D/g, "")) &&
         !WHATSAPP_NUMBER.includes("X");
}

function checkout() {
  const entries = cartEntries();
  if (!entries.length) return;

  const lines = entries.map(e =>
    `• ${e.product.name} x ${e.qty} — ${rupees(e.product.price * e.qty)}`
  ).join("\n");

  const total = entries.reduce(
    (s, e) => s + e.product.price * e.qty, 0
  );

  const message =
    `Hello ANU! 💙 I'd like to order:\n\n${lines}\n\n` +
    `Estimated subtotal: ${rupees(total)}\n\n` +
    `My name:\nDelivery location:\nAny colour/customisation requests:\n\n` +
    `Please confirm availability, delivery charges and final total.`;

  if (!whatsappReady()) {
    showToast("Add your WhatsApp number in script.js first.");
    return;
  }

  window.open(makeWhatsAppLink(message), "_blank");
}


// TOAST MESSAGE
function showToast(message) {
  const t = $("toast");
  if (!t) return;

  t.textContent = message;
  t.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    t.classList.remove("show");
  }, 2500);
}


// SEARCH, SORTING AND NAVIGATION
$("searchToggle")?.addEventListener("click", () => {
  $("searchRow")?.classList.toggle("open");

  if ($("searchRow")?.classList.contains("open")) {
    $("searchInput")?.focus();
  }
});

$("searchInput")?.addEventListener("input", e => {
  searchTerm = e.target.value;
  renderProducts();
});

$("clearSearch")?.addEventListener("click", () => {
  if ($("searchInput")) $("searchInput").value = "";
  searchTerm = "";
  renderProducts();
});

$("sortSelect")?.addEventListener("change", e => {
  sortMode = e.target.value;
  renderProducts();
});

$("clearFilter")?.addEventListener("click", () => {
  activeCategory = "All";
  searchTerm = "";

  if ($("searchInput")) $("searchInput").value = "";

  renderCategories();
  renderProducts();
});

$("cartOpen")?.addEventListener("click", openCart);
$("cartClose")?.addEventListener("click", closeCart);
$("drawerBackdrop")?.addEventListener("click", closeCart);

$("continueShopping")?.addEventListener("click", () => {
  closeCart();
  $("shop")?.scrollIntoView({ behavior: "smooth" });
});

$("keepShopping")?.addEventListener("click", closeCart);
$("checkoutWhatsApp")?.addEventListener("click", checkout);

$("menuToggle")?.addEventListener("click", () => {
  $("mainNav")?.classList.toggle("open");
});


// CUSTOM ORDER FORM
$("customForm")?.addEventListener("submit", e => {
  e.preventDefault();

  const d = new FormData(e.currentTarget);

  const message =
    `Hello ANU! 💙 I'd like to ask about a custom order.\n\n` +
    `Name: ${d.get("name")}\n` +
    `Product: ${d.get("product")}\n` +
    `Details: ${d.get("details")}\n\n` +
    `Please let me know the price and availability.`;

  if (!whatsappReady()) {
    showToast("Add your WhatsApp number in script.js first.");
    return;
  }

  window.open(makeWhatsAppLink(message), "_blank");
});


// START WEBSITE
if ($("year")) {
  $("year").textContent = new Date().getFullYear();
}

renderCategories();
renderProducts();
updateCart();