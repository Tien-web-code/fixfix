/* thanh tìm kiếm */
function searchProduct() {
    // 1. Lấy giá trị từ ô tìm kiếm và chuyển về chữ thường
    let input = document.getElementById('searchInput').value.toLowerCase();
    
    // 2. Chọn tất cả các thẻ bao quanh sản phẩm (ở đây ví dụ là các thẻ a có class card)
    let cards = document.querySelectorAll('.dtud-product-card, .fs-card, .card');

    cards.forEach(card => {
        // 3. Tìm tên sản phẩm bên trong mỗi thẻ (thường là thẻ h4 hoặc class p-name)
        let productName = card.querySelector('.dtud-p-name, h4, .p-name').innerText.toLowerCase();

        // 4. Nếu tên sản phẩm chứa từ khóa tìm kiếm thì hiện, ngược lại thì ẩn
        if (productName.includes(input)) {
            card.style.display = ""; // Hiện lại
        } else {
            card.style.display = "none"; // Ẩn đi
        }
    });
}