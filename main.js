// frontend/js/main.js

let menuItems = [];
let cart = [];

// Load menu from database (CORRECT PATH for your structure)
async function loadMenuFromDB() {
    try {
        const res = await fetch('../backend/api/get-menu.php');
        menuItems = await res.json();
        renderMenu(menuItems);
    } catch (e) {
        console.error("Cannot load menu", e);
        alert("Cannot connect to backend. Check XAMPP and paths.");
    }
}

// Render menu cards
function renderMenu(filteredItems) {
    const container = document.getElementById('menu-grid');
    container.innerHTML = '';

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="images/${item.image.split('/').pop()}" alt="${item.name}">
            <div class="card-body">
                <h5>${item.name}</h5>
                <p>${item.description}</p>
                <div class="card-footer">
                    <h5>$${parseFloat(item.price).toFixed(2)}</h5>
                    <button onclick="addToCart(${item.id})" class="add-btn">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Filter menu
function filterMenu() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';

    const filtered = menuItems.filter(item => {
        const matchesSearch = !searchTerm || 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    renderMenu(filtered);
}

function createCategoryButtons() {
    const categories = [
        { name: "All", value: "all" },
        { name: "Coffee", value: "coffee" },
        { name: "Tea", value: "tea" },
        { name: "Pastries", value: "pastries" },
        { name: "Food", value: "food" }
    ];

    const container = document.getElementById('category-buttons');
    container.innerHTML = '';

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `category-btn ${cat.value === 'all' ? 'active' : ''}`;
        btn.dataset.category = cat.value;
        btn.textContent = cat.name;
        btn.onclick = () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMenu();
        };
        container.appendChild(btn);
    });
}

// Add to Cart - Correct path
async function addToCart(id) {
    const res = await fetch('../backend/api/addToCart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: id })
    });

    const data = await res.json();

    if (data.status === "success") {
        updateCartUI();
        const toast = document.createElement('div');
        toast.style.cssText = `position:fixed; bottom:30px; right:30px; background:#8B4513; color:white; padding:16px 24px; border-radius:12px; box-shadow:0 5px 20px rgba(0,0,0,0.3); z-index:3000; font-weight:600;`;
        toast.textContent = "Added to cart!";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    } else {
        alert("Error adding to cart");
    }
}

// Get cart from PHP session
async function updateCartUI() {
    const res = await fetch('../backend/api/getCart.php');
    cart = await res.json();

    const countBadge = document.getElementById('cart-count-badge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countBadge.textContent = totalItems;

    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="images/${item.img.split('/').pop()}" alt="">
            <div style="flex:1">
                <h6>${item.name}</h6>
                <small>$${item.price} × ${item.quantity}</small>
            </div>
            <div style="text-align:right">
                <strong>$${itemTotal.toFixed(2)}</strong>
                <div style="margin-top:12px">
                    <button onclick="changeQuantity(${index}, -1)" style="width:28px;height:28px;border:none;background:#eee;border-radius:50%;cursor:pointer">-</button>
                    <span style="margin:0 12px;font-weight:600">${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)" style="width:28px;height:28px;border:none;background:#eee;border-radius:50%;cursor:pointer">+</button>
                    <button onclick="removeFromCart(${index})" style="margin-left:15px;color:#e74c3c;background:none;border:none;font-size:18px;cursor:pointer">🗑</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="text-align:center;color:#888;padding:60px 20px">Your cart is empty ☕</p>`;
    }

    document.getElementById('cart-total').textContent = `$${totalPrice.toFixed(2)}`;
    document.getElementById('order-total').textContent = `$${totalPrice.toFixed(2)}`;
}

function changeQuantity(index, change) { alert("Quantity change coming soon"); updateCartUI(); }
function removeFromCart(index) { alert("Remove coming soon"); updateCartUI(); }

function showCart() {
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('cart-overlay').classList.add('show');
    updateCartUI();
}

function hideCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('show');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

function placeOrder() {
    alert("🎉 Order placed successfully!");
    hideCart();
    updateCartUI();
}

function toggleRoastDetail(card) {
    card.classList.toggle('expanded');
}

// Initialize
window.onload = function() {
    loadMenuFromDB();
    createCategoryButtons();
    console.log('%c✅ Connected with your backend/frontend structure!', 'color:#8B4513;font-size:18px;font-weight:bold');
};