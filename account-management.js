// ============ ACCOUNT MANAGEMENT SCRIPT ============

// Hàm hiển thị thông tin tài khoản
function showAccountInfo() {
    let currentUser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : null;
    
    if (!currentUser) {
        toast({ 
            title: 'Cảnh báo', 
            message: 'Vui lòng đăng nhập trước!', 
            type: 'warning', 
            duration: 3000 
        });
        return;
    }

    // Hiển thị container tài khoản
    const accountContainer = document.getElementById('account-user');
    if (accountContainer) {
        accountContainer.style.display = 'block';
        
        // Điền thông tin
        document.getElementById('infoname').value = currentUser.fullname || '';
        document.getElementById('infophone').value = currentUser.phone || '';
        document.getElementById('infoemail').value = currentUser.email || '';
        document.getElementById('infoaddress').value = currentUser.address || '';
        
        // Scroll to view
        accountContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Ẩn lịch sử đơn hàng
        const orderContainer = document.getElementById('order-history');
        if (orderContainer) orderContainer.style.display = 'none';
    }
}

// Hàm hiển thị lịch sử đơn hàng
function showOrderHistory() {
    let currentUser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : null;
    
    if (!currentUser) {
        toast({ 
            title: 'Cảnh báo', 
            message: 'Vui lòng đăng nhập trước!', 
            type: 'warning', 
            duration: 3000 
        });
        return;
    }

    // Hiển thị container lịch sử đơn hàng
    const orderContainer = document.getElementById('order-history');
    if (orderContainer) {
        orderContainer.style.display = 'block';
        const orderHistorySection = document.querySelector('.order-history-section');
        
        let orders = currentUser.orders || [];
        
        if (orders.length === 0) {
            orderHistorySection.innerHTML = `
                <div class="empty-order">
                    <i class="fa-solid fa-inbox"></i>
                    <p>Bạn chưa có đơn hàng nào</p>
                </div>
            `;
        } else {
            let ordersHTML = '';
            orders.forEach((order, index) => {
                const orderDate = new Date(order.date).toLocaleDateString('vi-VN');
                const totalPrice = order.items.reduce((sum, item) => {
                    const product = JSON.parse(localStorage.getItem('products')).find(p => p.id === item.id);
                    return sum + (product.price * item.soluong);
                }, 0);
                
                ordersHTML += `
                    <div class="order-item">
                        <div class="order-header">
                            <div class="order-info">
                                <p class="order-id">Đơn hàng #${order.id || index + 1}</p>
                                <p class="order-date">${orderDate}</p>
                            </div>
                            <div class="order-status">
                                <span class="status-badge ${order.status || 'pending'}">${getStatusText(order.status)}</span>
                            </div>
                        </div>
                        <div class="order-items">
                            ${order.items.map(item => {
                                const product = JSON.parse(localStorage.getItem('products')).find(p => p.id === item.id);
                                return `
                                    <div class="order-item-detail">
                                        <img src="${product.img}" alt="${product.title}">
                                        <div class="item-info">
                                            <p class="item-name">${product.title}</p>
                                            <p class="item-qty">x${item.soluong}</p>
                                        </div>
                                        <p class="item-price">${(product.price * item.soluong).toLocaleString()}đ</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="order-footer">
                            <div class="order-total">
                                <p class="total-label">Tổng cộng:</p>
                                <p class="total-price">${totalPrice.toLocaleString()}đ</p>
                            </div>
                            <div class="order-actions">
                                <button class="btn-detail" onclick="showOrderDetail(${index})">
                                    <i class="fa-regular fa-eye"></i> Xem chi tiết
                                </button>
                                <button class="btn-reorder" onclick="reorderItems(${index})">
                                    <i class="fa-regular fa-rotate-right"></i> Mua lại
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            orderHistorySection.innerHTML = ordersHTML;
        }
        
        // Scroll to view
        orderContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Ẩn thông tin tài khoản
        const accountContainer = document.getElementById('account-user');
        if (accountContainer) accountContainer.style.display = 'none';
    }
}

// Hàm lấy text trạng thái
function getStatusText(status) {
    const statusMap = {
        'pending': '⏳ Chờ xác nhận',
        'confirmed': '✅ Đã xác nhận',
        'shipping': '🚚 Đang giao',
        'delivered': '📦 Đã giao',
        'cancelled': '❌ Đã hủy'
    };
    return statusMap[status] || '⏳ Chờ xác nhận';
}

// Hàm lưu thay đổi thông tin
function changeInformation() {
    let currentUser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : null;
    
    if (!currentUser) {
        toast({ 
            title: 'Lỗi', 
            message: 'Vui lòng đăng nhập!', 
            type: 'error', 
            duration: 3000 
        });
        return;
    }

    const fullname = document.getElementById('infoname').value.trim();
    const email = document.getElementById('infoemail').value.trim();
    const address = document.getElementById('infoaddress').value.trim();

    // Validate
    if (!fullname) {
        toast({ 
            title: 'Lỗi', 
            message: 'Vui lòng nhập họ và tên!', 
            type: 'error', 
            duration: 3000 
        });
        return;
    }

    if (email && !isValidEmail(email)) {
        toast({ 
            title: 'Lỗi', 
            message: 'Email không hợp lệ!', 
            type: 'error', 
            duration: 3000 
        });
        return;
    }

    // Lưu thông tin
    currentUser.fullname = fullname;
    currentUser.email = email;
    currentUser.address = address;

    localStorage.setItem('currentuser', JSON.stringify(currentUser));

    toast({ 
        title: 'Thành công', 
        message: 'Cập nhật thông tin thành công!', 
        type: 'success', 
        duration: 3000 
    });
}

// Hàm đổi mật khẩu
function changePassword() {
    let currentUser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : null;
    
    if (!currentUser) {
        toast({ 
            title: 'Lỗi', 
            message: 'Vui lòng đăng nhập!', 
            type: 'error', 
            duration: 3000 
        });
        return;
    }

    const passwordCur = document.getElementById('password-cur-info').value;
    const passwordNew = document.getElementById('password-after-info').value;
    const passwordConfirm = document.getElementById('password-comfirm-info').value;

    // Validate
    if (!passwordCur || !passwordNew || !passwordConfirm) {
        toast({ 
            title: 'Lỗi', 
            message: 'Vui lòng nhập đầy đủ thông tin!', 
            type: 'error', 
            duration: 3000 
        });
        return;
    }

    if (passwordCur !== currentUser.password) {
        toast({ 
            title: 'Lỗi', 
            message: 'Mật khẩu hiện tại không đúng!', 
            type: 'error', 
            duration: 3000 
        });
        return;
    }

    if (passwordNew.length < 6) {
        toast({ 
            title: 'Lỗi', 
            message: 'Mật khẩu mới phải có ít nhất 6 ký tự!', 
            type: 'error', 
            duration: 3000 
        });
        return;
    }

    if (passwordNew !== passwordConfirm) {
        toast({ 
            title: 'Lỗi', 
            message: 'Mật khẩu mới không khớp!', 
            type: 'error', 
            duration: 3000 
        });
        return;
    }

    // Cập nhật mật khẩu
    currentUser.password = passwordNew;
    localStorage.setItem('currentuser', JSON.stringify(currentUser));

    // Clear input
    document.getElementById('password-cur-info').value = '';
    document.getElementById('password-after-info').value = '';
    document.getElementById('password-comfirm-info').value = '';

    toast({ 
        title: 'Thành công', 
        message: 'Đổi mật khẩu thành công!', 
        type: 'success', 
        duration: 3000 
    });
}

// Hàm xem chi tiết đơn hàng
function showOrderDetail(orderIndex) {
    let currentUser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : null;
    
    if (!currentUser || !currentUser.orders || !currentUser.orders[orderIndex]) {
        toast({ 
            title: 'Lỗi', 
            message: 'Không tìm thấy đơn hàng!', 
            type: 'error', 
            duration: 3000 
        });
        return;
    }

    const order = currentUser.orders[orderIndex];
    const orderDate = new Date(order.date).toLocaleDateString('vi-VN');
    const totalPrice = order.items.reduce((sum, item) => {
        const product = JSON.parse(localStorage.getItem('products')).find(p => p.id === item.id);
        return sum + (product.price * item.soluong);
    }, 0);

    let detailHTML = `
        <div class="order-detail-info">
            <div class="detail-group">
                <h4>Thông tin đơn hàng</h4>
                <p><strong>Mã đơn:</strong> #${order.id || orderIndex + 1}</p>
                <p><strong>Ngày đặt:</strong> ${orderDate}</p>
                <p><strong>Trạng thái:</strong> <span class="status-badge ${order.status || 'pending'}">${getStatusText(order.status)}</span></p>
            </div>
            
            <div class="detail-group">
                <h4>Thông tin người nhận</h4>
                <p><strong>Tên:</strong> ${order.receiverName || 'N/A'}</p>
                <p><strong>Điện thoại:</strong> ${order.receiverPhone || 'N/A'}</p>
                <p><strong>Địa chỉ:</strong> ${order.receiverAddress || 'N/A'}</p>
            </div>
            
            <div class="detail-group">
                <h4>Sản phẩm</h4>
                <table class="order-items-table">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => {
                            const product = JSON.parse(localStorage.getItem('products')).find(p => p.id === item.id);
                            const itemTotal = product.price * item.soluong;
                            return `
                                <tr>
                                    <td>${product.title}</td>
                                    <td>${product.price.toLocaleString()}đ</td>
                                    <td>${item.soluong}</td>
                                    <td><strong>${itemTotal.toLocaleString()}đ</strong></td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="detail-group">
                <h4>Chi tiết thanh toán</h4>
                <p><strong>Tổng tiền sản phẩm:</strong> ${totalPrice.toLocaleString()}đ</p>
                <p><strong>Phí vận chuyển:</strong> ${(order.shippingFee || 0).toLocaleString()}đ</p>
                <p><strong>Giảm giá:</strong> -${(order.discount || 0).toLocaleString()}đ</p>
                <p class="total"><strong>Tổng cộng:</strong> ${((totalPrice + (order.shippingFee || 0) - (order.discount || 0))).toLocaleString()}đ</p>
            </div>
            
            ${order.note ? `<div class="detail-group"><h4>Ghi chú:</h4><p>${order.note}</p></div>` : ''}
        </div>
    `;

    const detailOrderContent = document.querySelector('.detail-order-content');
    if (detailOrderContent) {
        detailOrderContent.innerHTML = detailHTML;
        const detailOrderModal = document.querySelector('.detail-order');
        if (detailOrderModal) {
            detailOrderModal.style.display = 'flex';
        }
    }
}

// Hàm mua lại sản phẩm trong đơn hàng
function reorderItems(orderIndex) {
    let currentUser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : null;
    
    if (!currentUser || !currentUser.orders || !currentUser.orders[orderIndex]) {
        toast({ 
            title: 'Lỗi', 
            message: 'Không tìm thấy đơn hàng!', 
            type: 'error', 
            duration: 3000 
        });
        return;
    }

    const order = currentUser.orders[orderIndex];
    let cart = currentUser.cart || [];

    order.items.forEach(item => {
        let existItem = cart.find(cartItem => cartItem.id === item.id);
        if (existItem) {
            existItem.soluong += item.soluong;
        } else {
            cart.push({ id: item.id, soluong: item.soluong, note: '' });
        }
    });

    currentUser.cart = cart;
    localStorage.setItem('currentuser', JSON.stringify(currentUser));
    document.querySelector('.count-product-cart').innerText = cart.length;

    toast({ 
        title: 'Thành công', 
        message: 'Đã thêm sản phẩm vào giỏ hàng!', 
        type: 'success', 
        duration: 3000 
    });
}

// Hàm tạo đơn hàng (gọi sau khi thanh toán)
function createOrder(orderData) {
    let currentUser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : null;
    
    if (!currentUser) return false;

    let orders = currentUser.orders || [];
    
    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'pending',
        items: orderData.items || [],
        receiverName: orderData.receiverName,
        receiverPhone: orderData.receiverPhone,
        receiverAddress: orderData.receiverAddress,
        shippingFee: orderData.shippingFee || 0,
        discount: orderData.discount || 0,
        note: orderData.note || '',
        paymentMethod: orderData.paymentMethod || 'cod'
    };

    orders.push(newOrder);
    currentUser.orders = orders;
    currentUser.cart = [];

    localStorage.setItem('currentuser', JSON.stringify(currentUser));
    return true;
}

// Hàm validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============ CLOSE MODAL FUNCTION ============
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Đóng modal khi click vào nút close
document.addEventListener('DOMContentLoaded', function() {
    const closeButtons = document.querySelectorAll('.form-close, .modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Đóng modal khi click ngoài
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
});
