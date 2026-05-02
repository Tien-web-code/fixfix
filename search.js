document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchInput');
    const drop = document.getElementById('searchDropdown');
    const boxSP = document.getElementById('boxSP');
    const boxTH = document.getElementById('boxTH');

    // 1. LẤY DỮ LIỆU TỪ LOCALSTORAGE
    let dataSP = [];
    const localProducts = JSON.parse(localStorage.getItem('products')) || [];

    if (localProducts.length > 0) {
        dataSP = localProducts.map(p => {
            let giaMoi = p.price - (p.price * p.discount / 100);
            return {
                id: p.title.toLowerCase(),
                ten: p.title,
                link: "product-detail.html?id=" + p.id, // ĐÂY LÀ ĐƯỜNG DẪN KHI CLICK VÀO
                img: p.img,
                gia: giaMoi.toLocaleString('vi-VN') + "đ",
                cu: p.price.toLocaleString('vi-VN') + "đ",
                sale: "-" + p.discount + "%"
            };
        });
    }

    const dataTH = [
        { ten: "LANEIGE", link: "thuong-hieu.html?brand=laneige" },
        { ten: "CERAVE", link: "thuong-hieu.html?brand=cerave" },
        { ten: "MAYBELLINE", link: "thuong-hieu.html?brand=maybelline" }
    ];

    // 2. XỬ LÝ GÕ PHÍM
    input.addEventListener('input', (e) => {
        const val = e.target.value.trim().toLowerCase();
        if (!val) return drop.style.display = 'none';

        const locSP = dataSP.filter(sp => sp.ten.toLowerCase().includes(val));
        const locTH = dataTH.filter(th => th.ten.toLowerCase().includes(val));

        if (!locSP.length && !locTH.length) return drop.style.display = 'none';
        
        drop.style.display = 'block';

        boxSP.style.display = locSP.length ? 'block' : 'none';
        
        // VẼ HTML TỪ KHÓA GỢI Ý (Đã bọc trong thẻ <a> có href)
        document.getElementById('listTuKhoa').innerHTML = locSP.slice(0, 5).map(sp => 
            `<li>
                <a href="${sp.link}" style="display:block; width:100%; color:#333; text-decoration:none;">
                    ${sp.ten}
                </a>
            </li>`
        ).join('');
        
        // VẼ HTML SẢN PHẨM LIÊN QUAN (Đã bọc trong thẻ <a> có href)
        document.getElementById('listSanPham').innerHTML = locSP.slice(0, 5).map(sp => `
            <a href="${sp.link}" class="search-product-item">
                <img src="${sp.img}" alt="${sp.ten}">
                <div class="search-sp-info">
                    <div class="search-sp-name">${sp.ten}</div>
                    <div>
                        <span class="search-price-new">${sp.gia}</span>
                        <span class="search-price-old">${sp.cu}</span>
                        <span class="search-discount">${sp.sale}</span>
                    </div>
                </div>
            </a>`).join('');

        if (boxTH) {
            boxTH.style.display = locTH.length ? 'block' : 'none';
            if(document.getElementById('listThuongHieu')) {
                document.getElementById('listThuongHieu').innerHTML = locTH.map(th => 
                    `<a href="${th.link}" class="search-brand-tag">${th.ten}</a>`
                ).join('');
            }
        }
    });

    // 3. XỬ LÝ ENTER
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = input.value.trim().toLowerCase();
            if(!val) return alert('Vui lòng nhập từ khóa!');
            
            const firstMatch = dataSP.find(sp => sp.ten.toLowerCase().includes(val));
            if(firstMatch) {
                // Nếu nhấn Enter, tự động nhảy sang trang của sản phẩm đầu tiên tìm thấy
                window.location.href = firstMatch.link;
            } else {
                alert('Cửa hàng không có sản phẩm/thương hiệu này!');
            }
        }
    });

    // 4. CLICK RA NGOÀI TỰ ẨN
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) drop.style.display = 'none';
    });
});
