// ============ STATE MANAGEMENT ============
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'Tất cả';
let currentSort = 'newest';
let currentPriceRange = { min: 0, max: Infinity };

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    addEventListeners();
    renderProducts(allProducts);
    setupBackToTop();
});

/**
 * Khởi tạo dữ liệu sản phẩm từ localStorage
 */
function initializeProducts() {
    const productsData = localStorage.getItem('products');
    if (productsData) {
        allProducts = JSON.parse(productsData);
        filteredProducts = [...allProducts];
    } else {
        console.warn('Không tìm thấy dữ liệu sản phẩm');
        allProducts = [];
        filteredProducts = [];
    }
}

/**
 * Thêm event listeners cho các yếu tố interaktive
 */
function addEventListeners() {
    // Xử lý nhấn Enter trong input giá
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    
    if (priceMinInput) {
        priceMinInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') filterByPrice();
        });
    }
    
    if (priceMaxInput) {
        priceMaxInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') filterByPrice();
        });
    }

    // Xử lý nhấn nút back-to-top
    window.addEventListener('scroll', toggleBackToTop);
}

// ============ FILTERING FUNCTIONS ============

/**
 * Lọc sản phẩm theo danh mục
 * @param {string} category - Tên danh mục
 */
function filterByCategory(category) {
    currentCategory = category;
    currentPriceRange = { min: 0, max: Infinity };
    
    // Cập nhật trạng thái nút category
    updateCategoryButtons(category);
    
    // Reset input giá
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    if (priceMinInput) priceMinInput.value = '';
    if (priceMaxInput) priceMaxInput.value = '';

    // Cập nhật URL không reload trang
    if (window.history && window.history.pushState) {
        const newUrl = category === 'Tất cả' 
            ? window.location.pathname 
            : `${window.location.pathname}?category=${encodeURIComponent(category)}`;
        window.history.pushState({ category: category }, '', newUrl);
    }

    if (category === 'Tất cả') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => product.category === category);
    }

    applySort();
    renderProducts(filteredProducts);
}

/**
 * Lọc sản phẩm theo khoảng giá custom
 */
function filterByPrice() {
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    
    const minInput = priceMinInput ? priceMinInput.value : '';
    const maxInput = priceMaxInput ? priceMaxInput.value : '';

    let min = minInput ? parseInt(minInput) : 0;
    let max = maxInput ? parseInt(maxInput) : Infinity;

    // Validate: min không được lớn hơn max
    if (min > max) {
        showToast('Giá từ không được lớn hơn giá đến!', 'error');
        return;
    }

    currentPriceRange = { min, max };
    applyFilters();
}

/**
 * Lọc theo giá nhanh (quick filter)
 */
function filterByQuickPrice(min, max) {
    currentPriceRange = { min, max };
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    
    if (priceMinInput) priceMinInput.value = min || '';
    if (priceMaxInput) priceMaxInput.value = max || '';
    
    applyFilters();
}

/**
 * Áp dụng tất cả các filter (category + price)
 */
function applyFilters() {
    let result = allProducts.filter(product => {
        // Lọc theo category
        let categoryMatch = true;
        if (currentCategory !== 'Tất cả') {
            categoryMatch = product.category === currentCategory;
        }

        // Lọc theo giá
        const finalPrice = calculateFinalPrice(product.price, product.discount);
        const priceMatch = finalPrice >= currentPriceRange.min && finalPrice <= currentPriceRange.max;

        return categoryMatch && priceMatch;
    });

    filteredProducts = result;
    applySort();
    renderProducts(filteredProducts);
}

/**
 * Cập nhật trạng thái nút category
 */
function updateCategoryButtons(activeCategory) {
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === activeCategory) {
            btn.classList.add('active');
        }
    });
}

// ============ SORTING FUNCTIONS ============

/**
 * Sắp xếp sản phẩm
 * @param {string} sortType - Loại sắp xếp: newest, bestseller, price-asc, price-desc
 */
function sortProducts(sortType) {
    currentSort = sortType;

    // Cập nhật trạng thái nút sort
    const sortBtns = document.querySelectorAll('.sort-btn');
    sortBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
    }

    applySort();
    renderProducts(filteredProducts);
}

/**
 * Áp dụng sắp xếp hiện tại lên filtered products
 */
function applySort() {
    const sorted = [...filteredProducts];

    switch (currentSort) {
        case 'bestseller':
            sorted.sort((a, b) => b.sold - a.sold);
            break;
        case 'price-asc':
            sorted.sort((a, b) => {
                const priceA = calculateFinalPrice(a.price, a.discount);
                const priceB = calculateFinalPrice(b.price, b.discount);
                return priceA - priceB;
            });
            break;
        case 'price-desc':
            sorted.sort((a, b) => {
                const priceA = calculateFinalPrice(a.price, a.discount);
                const priceB = calculateFinalPrice(b.price, b.discount);
                return priceB - priceA;
            });
            break;
        case 'newest':
        default:
            sorted.sort((a, b) => b.id - a.id);
            break;
    }

    filteredProducts = sorted;
}

// ============ RENDERING FUNCTIONS ============

/**
 * Render danh sách sản phẩm ra HTML
 * @param {Array} products - Mảng sản phẩm cần render
 */
function renderProducts(products) {
    const productGrid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');
    const productCount = document.getElementById('productCount');

    if (!productGrid) return;

    // Cập nhật số lượng sản phẩm
    if (productCount) {
        productCount.textContent = products.length;
    }

    // Nếu không có sản phẩm
    if (products.length === 0) {
        productGrid.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Render từng sản phẩm
    productGrid.innerHTML = products.map(product => createProductCard(product)).join('');

    // Thêm event listeners cho các sản phẩm
    attachProductCardListeners();
}

/**
 * Tạo HTML cho một thẻ sản phẩm
 * @param {Object} product - Đối tượng sản phẩm
 * @returns {string} HTML của thẻ sản phẩm
 */
function createProductCard(product) {
    const finalPrice = calculateFinalPrice(product.price, product.discount);
    const ratingStars = generateRatingStars(product.rating);

    return `
        <div class="product-card">
            <a href="product-detail.html?id=${product.id}" class="product-link" onclick="openProductDetail(event, ${product.id})">
                <div class="product-img-wrapper">
                    <img src="${product.img}" alt="${product.title}" class="product-img" onerror="this.src='./assets/img/placeholder.png'">
                    ${product.discount > 0 ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>
                <h3 class="product-title">${product.title}</h3>
            </a>
            
            <div class="product-info">
                <div class="product-rating">
                    <div class="stars">${ratingStars}</div>
                    <span class="rating-value">${product.rating}</span>
                    <span class="sold-count">${product.sold} lượt bán</span>
                </div>

                <div class="product-price">
                    <div class="price-row">
                        ${product.discount > 0 ? `<span class="price-original">${formatCurrency(product.price)}</span>` : ''}
                        <span class="price-final">${formatCurrency(finalPrice)}</span>
                        <span class="price-unit">đ</span>
                    </div>
                </div>

                <div class="product-actions">
                    <button class="action-btn add-cart-btn" onclick="addToCartHandler(event, ${product.id})" title="Thêm vào giỏ">
                        <i class="fas fa-basket-shopping"></i>
                    </button>
                    <button class="action-btn buy-now-btn" onclick="buyNowHandler(event, ${product.id})">
                        MUA NGAY
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Tạo chuỗi sao đánh giá
 * @param {number} rating - Điểm đánh giá (0-5)
 * @returns {string} HTML chuỗi sao
 */
function generateRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

/**
 * Attach event listeners cho product cards
 */
function attachProductCardListeners() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseover', function() {
            // Có thể thêm effect hover ở đây nếu cần
        });
    });
}

// ============ PRODUCT DETAIL ============

/**
 * Mở chi tiết sản phẩm
 */
function openProductDetail(event, productId) {
    event.preventDefault();
    window.location.href = `product-detail.html?id=${productId}`;
}

/**
 * Đóng modal chi tiết sản phẩm
 */
function closeProductDetail() {
    const modal = document.getElementById('productDetailModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// ============ CART FUNCTIONS ============

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {number} productId - ID của sản phẩm
 */
function addToCart(productId) {
    // Lấy giỏ hàng từ localStorage
    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];

    // Tìm sản phẩm trong mảng allProducts
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        showToast('Sản phẩm không tồn tại!', 'error');
        return;
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            discount: product.discount,
            img: product.img,
            quantity: 1,
            variants: product.variants || []
        });
    }

    // Lưu lại vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Hiển thị thông báo thành công
    showToast('✓ Đã thêm vào giỏ hàng!', 'success');

    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount();
}

/**
 * Handler cho nút Thêm vào giỏ
 */
function addToCartHandler(event, productId) {
    event.stopPropagation();
    event.preventDefault();
    addToCart(productId);
}

/**
 * Mua ngay (Thêm vào giỏ rồi chuyển sang trang checkout)
 * @param {number} productId - ID của sản phẩm
 */
function buyNow(productId) {
    addToCart(productId);
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 300);
}

/**
 * Handler cho nút Mua ngay
 */
function buyNowHandler(event, productId) {
    event.stopPropagation();
    event.preventDefault();
    buyNow(productId);
}

/**
 * Cập nhật số lượng hiển thị trên icon giỏ hàng
 */
function updateCartCount() {
    const cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];
    
    // Tính tổng số lượng sản phẩm
    const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Cập nhật trên UI
    const cartCountElement = document.querySelector('.count-product-cart');
    if (cartCountElement) {
        cartCountElement.textContent = totalCount;
    }
}

// ============ PROMO PAGE FUNCTIONS ============

/**
 * Render trang khuyến mãi với 3 section
 */
function renderPromoPage() {
    const productsData = localStorage.getItem('products');
    if (!productsData) {
        console.warn('Không tìm thấy dữ liệu sản phẩm');
        return;
    }

    const products = JSON.parse(productsData);

    // Section 1: Top bán chạy (sắp xếp theo sold, giảm dần)
    const topSold = products
        .filter(p => p.discount === 50)
        .slice(0, 5);
    renderPromoSection('topBanChayGrid', 'topBanChayEmpty', topSold);

    // Section 2: Mua là có quà (hasGift: true)
    const giftProducts = products.filter(p => p.hasGift === true).slice(0, 5);
    renderPromoSection('muaLaCoQuaGrid', 'muaLaCoQuaEmpty', giftProducts);

    // Section 3: Trang điểm khuyến mãi
    const makeupProducts = products
        .filter(p => p.category === 'Trang điểm')
        .slice(0, 5);
    renderPromoSection('trangDiemGrid', 'trangDiemEmpty', makeupProducts);

    // Cập nhật số lượng giỏ hàng
    updateCartCount();
}

/**
 * Render một section khuyến mãi
 * @param {string} gridId - ID của grid element
 * @param {string} emptyId - ID của empty state element
 * @param {Array} products - Mảng sản phẩm
 */
function renderPromoSection(gridId, emptyId, products) {
    const grid = document.getElementById(gridId);
    const empty = document.getElementById(emptyId);

    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }

    if (empty) empty.style.display = 'none';

    grid.innerHTML = products.map(product => createPromoProductCard(product)).join('');

    // Attach event listeners
    attachPromoCardListeners();
}

/**
 * Tạo thẻ sản phẩm cho trang khuyến mãi
 * @param {Object} product - Sản phẩm
 * @returns {string} HTML card
 */
function createPromoProductCard(product) {
    const finalPrice = calculateFinalPrice(product.price, product.discount);
    const ratingStars = generateRatingStars(product.rating);

    return `
        <div class="promo-product-card" onclick="goToDetail(${product.id})">
            <div class="promo-product-img-wrapper">
                <img src="${product.img}" alt="${product.title}" class="promo-product-img" onerror="this.src='./assets/img/placeholder.png'">
                
                ${product.discount > 0 ? `<span class="promo-discount-badge">-${product.discount}%</span>` : ''}
                
                ${product.hasGift ? `<span class="promo-gift-badge"><i class="fas fa-gift"></i> Có quà</span>` : ''}
            </div>

            <div class="promo-product-info">
                <h3 class="promo-product-title">${product.title}</h3>

                <div class="promo-product-rating">
                    <div class="stars">${ratingStars}</div>
                    <span class="rating-value">${product.rating}</span>
                    <span class="sold-count">${product.sold} bán</span>
                </div>

                <div class="promo-product-price">
                    <div class="promo-price-row">
                        ${product.discount > 0 ? `<span class="promo-price-original">${formatCurrency(product.price)}</span>` : ''}
                        <span class="promo-price-final">${formatCurrency(finalPrice)}</span>
                        <span class="promo-price-unit">đ</span>
                    </div>
                </div>

                <div class="promo-product-actions">
                    <button class="promo-action-btn promo-add-cart-btn" onclick="addToCartHandler(event, ${product.id})" title="Thêm vào giỏ">
                        <i class="fas fa-basket-shopping"></i>
                    </button>
                    <button class="promo-action-btn promo-buy-now-btn" onclick="buyNowHandler(event, ${product.id})">
                        MUA NGAY
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners cho promo cards
 */
function attachPromoCardListeners() {
    const cards = document.querySelectorAll('.promo-product-card');
    cards.forEach(card => {
        card.addEventListener('mouseover', function() {
            this.style.cursor = 'pointer';
        });
    });
}

/**
 * Điều hướng đến trang chi tiết sản phẩm
 * @param {number} productId - ID sản phẩm
 */
function goToDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

/**
 * Điều hướng đến danh mục (trên trang sản phẩm)
 * @param {string} category - Tên danh mục hoặc loại
 */
function goToCategory(category) {
    if (category === 'bestseller') {
        window.location.href = 'index.html';
    } else if (category === 'gifts') {
        window.location.href = 'index.html?category=Gifts';
    } else {
        window.location.href = `index.html?category=${encodeURIComponent(category)}`;
    }
}

/**
 * Cuộn mượt đến một section
 * @param {string} sectionId - ID của section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Xử lý anchor scroll từ URL hash
 */
function handleAnchorScroll() {
    const hash = window.location.hash;
    if (hash) {
        const sectionId = hash.replace('#', '');
        const section = document.getElementById(sectionId);
        if (section) {
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
}

// ============ UTILITY FUNCTIONS ============

/**
 * Tính giá sau khi giảm
 * @param {number} price - Giá gốc
 * @param {number} discount - Phần trăm giảm giá
 * @returns {number} Giá sau khi giảm
 */
function calculateFinalPrice(price, discount) {
    return Math.round(price * (1 - discount / 100));
}

/**
 * Format số thành tiền tệ VND
 * @param {number} number - Số cần format
 * @returns {string} Chuỗi tiền tệ
 */
function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}

/**
 * Cuộn lên đầu trang
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Toggle hiển thị nút back-to-top
 */
function toggleBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

/**
 * Thiết lập back-to-top button
 */
function setupBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
}

/**
 * Hiển thị toast message (notification)
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại: success, error, warning, info
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast');
    if (!toastContainer) return;
    
    const toastEl = document.createElement('div');
    toastEl.className = `toast toast--${type}`;
    
    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info'
    };

    toastEl.innerHTML = `
        <span class="toast-icon"><i class="fas ${icons[type]}"></i></span>
        <div class="toast-body">
            <p class="toast-msg">${message}</p>
        </div>
    `;

    toastContainer.appendChild(toastEl);

    // Tự động xóa sau 3 giây
    setTimeout(() => {
        toastEl.remove();
    }, 3000);
}

// ============ EXPORT FUNCTIONS ============
// Các hàm này được gọi từ HTML onclick handlers
window.filterByCategory = filterByCategory;
window.filterByPrice = filterByPrice;
window.filterByQuickPrice = filterByQuickPrice;
window.sortProducts = sortProducts;
window.openProductDetail = openProductDetail;
window.closeProductDetail = closeProductDetail;
window.scrollToTop = scrollToTop;
window.addToCart = addToCart;
window.addToCartHandler = addToCartHandler;
window.buyNow = buyNow;
window.buyNowHandler = buyNowHandler;
window.goToDetail = goToDetail;
window.goToCategory = goToCategory;
window.scrollToSection = scrollToSection;
window.handleAnchorScroll = handleAnchorScroll;
window.renderPromoPage = renderPromoPage;
