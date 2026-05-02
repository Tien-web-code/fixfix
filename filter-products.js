// Filter Products Functionality
let selectedCategory = 'Chăm sóc da mặt'; // Default category
let priceRange = { min: 0, max: Infinity }; // Default price range

// Initialize filter functionality
function initializeFilters() {
    loadProductsByCategory(selectedCategory);
    setupCategoryFilters();
    setupPriceFilters();
}

// Display products by category
function showCategory(category) {
    selectedCategory = category;
    loadProductsByCategory(category);
}

// Load and display products based on selected category and price range
function loadProductsByCategory(category) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Filter by category and price range
    const filteredProducts = products.filter(product => {
        const matchesCategory = product.category === category;
        const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
        return matchesCategory && matchesPrice;
    });

    displayProducts(filteredProducts);
}

// Filter products by price range
function filterByPrice(minPrice, maxPrice) {
    priceRange.min = minPrice;
    priceRange.max = maxPrice;
    loadProductsByCategory(selectedCategory);
}

// Display products on the page
function displayProducts(products) {
    const productGrid = document.getElementById('productGrid') || document.getElementById('home-products');
    
    if (!productGrid) {
        console.warn('Product grid element not found');
        return;
    }

    if (products.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Không có sản phẩm nào phù hợp với bộ lọc</p>';
        return;
    }

    productGrid.innerHTML = products.map(product => {
        const discountedPrice = product.price * (1 - product.discount / 100);
        return `
            <div class="product-card" onclick="openProductDetail(${product.id})">
                <div class="product-image">
                    <img src="${product.img}" alt="${product.title}">
                    ${product.discount > 0 ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating">
                        <span class="stars">${'⭐'.repeat(Math.round(product.rating))}</span>
                        <span class="rating-text">${product.rating}</span>
                    </div>
                    <div class="product-price">
                        <span class="price-discount">${discountedPrice.toLocaleString('vi-VN')}đ</span>
                        ${product.discount > 0 ? `<span class="price-original">${product.price.toLocaleString('vi-VN')}đ</span>` : ''}
                    </div>
                    <div class="product-sold">Đã bán: ${product.sold}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Setup category filter event listeners
function setupCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.menu-list-item');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('.menu-link')?.textContent.trim();
            if (category) {
                showCategory(category);
            }
        });
    });
}

// Setup price filter event listeners
function setupPriceFilters() {
    const priceFilters = document.querySelectorAll('.bg-pink-100, .bg-blue-100, .bg-yellow-100');
    
    priceFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const text = this.textContent.trim();
            
            if (text.includes('0 - 500.000đ')) {
                filterByPrice(0, 500000);
            } else if (text.includes('500.000đ - 1.000.000đ')) {
                filterByPrice(500000, 1000000);
            } else if (text.includes('Trên 1.000.000đ')) {
                filterByPrice(1000000, Infinity);
            }
            
            // Highlight active filter
            priceFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Open product detail modal
function openProductDetail(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    const modal = document.querySelector('.modal.product-detail');
    const modalContent = document.getElementById('product-detail-content');
    
    if (!modal || !modalContent) return;

    const discountedPrice = product.price * (1 - product.discount / 100);
    
    let variantsHTML = '';
    if (product.variants && product.variants.length > 0) {
        variantsHTML = `
            <div class="variants-section">
                <label>Chọn loại sản phẩm:</label>
                <select id="variant-select" class="variant-select">
                    ${product.variants.map((variant, index) => `
                        <option value="${index}" data-add-price="${variant.addPrice}">
                            ${variant.label} ${variant.addPrice > 0 ? `(+${variant.addPrice.toLocaleString('vi-VN')}đ)` : ''}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    modalContent.innerHTML = `
        <div class="product-detail-wrapper">
            <div class="product-detail-image">
                <img src="${product.img}" alt="${product.title}">
            </div>
            <div class="product-detail-info">
                <h2 class="product-detail-title">${product.title}</h2>
                <div class="product-detail-rating">
                    <span class="stars">${'⭐'.repeat(Math.round(product.rating))}</span>
                    <span>(${product.rating}/5 - ${product.sold} lượt bán)</span>
                </div>
                <div class="product-detail-price">
                    <span class="discounted-price">${discountedPrice.toLocaleString('vi-VN')}đ</span>
                    ${product.discount > 0 ? `<span class="original-price">${product.price.toLocaleString('vi-VN')}đ</span>` : ''}
                </div>
                <p class="product-description">${product.description}</p>
                ${variantsHTML}
                <div class="quantity-section">
                    <label>Số lượng:</label>
                    <input type="number" id="quantity-input" min="1" value="1" class="quantity-input">
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Thêm vào giỏ hàng</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Add to cart
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    const quantity = parseInt(document.getElementById('quantity-input')?.value) || 1;
    let finalPrice = product.price;
    let variantLabel = '';

    // Calculate final price with variant
    const variantSelect = document.getElementById('variant-select');
    if (variantSelect) {
        const selectedIndex = variantSelect.value;
        const variant = product.variants[selectedIndex];
        finalPrice = product.price + variant.addPrice;
        variantLabel = ` - ${variant.label}`;
    }

    const cartItem = {
        id: productId,
        title: product.title + variantLabel,
        price: finalPrice,
        quantity: quantity,
        img: product.img
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId && item.title === cartItem.title);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Close modal
    const modal = document.querySelector('.modal.product-detail');
    if (modal) modal.style.display = 'none';
    
    // Show toast notification
    showToast('success', 'Thành công', 'Đã thêm sản phẩm vào giỏ hàng');
    
    // Update cart count
    updateCartCount();
}

// Update cart count display
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const countElement = document.querySelector('.count-product-cart');
    if (countElement) {
        countElement.textContent = totalItems;
    }
}

// Close modal
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.style.display !== 'none') {
            modal.style.display = 'none';
        }
    });
}

// Close product detail modal with button
document.addEventListener('DOMContentLoaded', function() {
    const closeButtons = document.querySelectorAll('.modal-close, .close-popup');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // Initialize filters on page load
    initializeFilters();
});
