//Khoi tao danh sach san pham
function createProduct() {
    if (localStorage.getItem('products') == null) {
        let products = [
/* ===== 1–15: CHĂM SÓC DA MẶT ===== */
{id:1,title:"Kem chống nắng Anessa",category:"Chăm sóc da mặt",img:"./assets/img/sp1.png",price:350000,discount:15,rating:4.9,sold:3200,variants: [
        { label: "Tuýp 60ml", addPrice: 0 },      // Giá không đổi
        { label: "Tuýp 90ml", addPrice: 150000 }, // Cộng thêm 150k
        { label: "Dạng xịt", addPrice: 50000 }     // Cộng thêm 50k
    ],description:"Chống nắng mạnh, không nhờn."},
{id:2,title:"Serum The Ordinary",category:"Chăm sóc da mặt",img:"./assets/img/sp2.png",price:250000,discount:50,rating:4.8,sold:2800,description:"Giảm mụn, kiềm dầu."},
{id:3,title:"Mask ngủ Laneige",category:"Chăm sóc da mặt",img:"./assets/img/sp3.png",price:450000,discount:20,rating:4.9,sold:1500,description:"Cấp ẩm sâu qua đêm."},
{id:4,title:"Sữa rửa mặt Cetaphil",category:"Chăm sóc da mặt",img:"./assets/img/sp4.png",price:200000,discount:50,rating:4.8,sold:4100,description:"Dịu nhẹ cho da."},
{id:5,title:"Tẩy trang Bioderma",category:"Chăm sóc da mặt",img:"./assets/img/sp5.png",price:300000,discount:12,rating:4.9,sold:3600,description:"Làm sạch sâu."},
{id:6,title:"Kem dưỡng La Roche",category:"Chăm sóc da mặt",img:"./assets/img/sp6.png",price:400000,discount:18,rating:4.9,sold:2100,description:"Phục hồi da."},
{id:7,title:"BHA Paula Choice",category:"Chăm sóc da mặt",img:"./assets/img/sp7.png",price:800000,discount:25,rating:4.9,sold:1700,description:"Giảm mụn hiệu quả."},
{id:8,title:"Phấn Innisfree",category:"Chăm sóc da mặt",img:"./assets/img/sp8.png",price:150000,discount:10,rating:4.7,sold:5000,description:"Kiềm dầu tốt."},
{id:9,title:"Lotion Hada Labo",category:"Chăm sóc da mặt",img:"./assets/img/sp9.png",price:180000,discount:8,rating:4.8,sold:2900,description:"Cấp ẩm HA."},
{id:10,title:"Sữa rửa mặt Eucerin",category:"Chăm sóc da mặt",img:"./assets/img/sp10.png",price:250000,discount:10,rating:4.8,sold:2400,description:"Làm sạch dịu nhẹ."},
{id:11,title:"Serum HA",category:"Chăm sóc da mặt",img:"./assets/img/sp11.png",price:220000,discount:10,rating:4.7,sold:1900,description:"Dưỡng ẩm sâu."},
{id:12,title:"Kem dưỡng ẩm",category:"Chăm sóc da mặt",img:"./assets/img/sp12.png",price:300000,discount:12,rating:4.8,sold:2600,description:"Giữ ẩm lâu."},
{id:13,title:"Tinh chất dưỡng da",category:"Chăm sóc da mặt",img:"./assets/img/sp13.png",price:350000,discount:15,rating:4.8,sold:2100,description:"Sáng da."},
{id:14,title:"Kem trị mụn",category:"Chăm sóc da mặt",img:"./assets/img/sp14.png",price:200000,discount:10,rating:4.7,sold:3300,description:"Giảm mụn nhanh."},
{id:15,title:"Xịt khoáng",category:"Chăm sóc da mặt",img:"./assets/img/sp15.png",price:180000,discount:50,rating:4.7,sold:2700,hasGift: true,description:"Cấp nước tức thì."},

/* ===== 16–30: TRANG ĐIỂM ===== */
{id:16,title:"Kem nền Maybelline",category:"Trang điểm",img:"./assets/img/sp16.png",price:220000,discount:15,rating:4.8,sold:4200,hasGift: true,description:"Che phủ tốt."},
{id:17,title:"Son Black Rouge",category:"Trang điểm",img:"./assets/img/sp17.png",price:150000,discount:70,rating:4.8,sold:5100, hasGift: true,description:"Son lì đẹp."},
{id:18,title:"Son Romand",category:"Trang điểm",img:"./assets/img/sp18.png",price:170000,discount:12,rating:4.9,sold:4800,hasGift: true,description:"Tint bóng."},
{id:19,title:"Cushion Clio",category:"Trang điểm",img:"./assets/img/sp19.png",price:450000,discount:20,rating:4.9,sold:2200,description:"Nền mịn."},
{id:20,title:"Mascara JUDYDOLL",category:"Trang điểm",img:"./assets/img/sp20.png",price:200000,discount:67,rating:4.8,sold:3100,description:"Dày mi."},
{id:21,title:"Son Dưỡng Môi Cấp Ẩm Chuyên Sâu 24h",category:"Trang điểm",img:"./assets/img/sp21.png",price:160000,discount:10,rating:4.7,sold:4000,description:"Tint nhẹ."},
{id:22,title:"Son Etude",category:"Trang điểm",img:"./assets/img/sp22.png",price:140000,discount:80,rating:4.7,sold:3500,hasGift: true,description:"Mềm môi."},
{id:23,title:"Son 3CE",category:"Trang điểm",img:"./assets/img/sp23.png",price:300000,discount:15,rating:4.9,sold:2000,hasGift: true,description:"Cao cấp."},
{id:24,title:"Phấn phủ Lemonade",category:"Trang điểm",img:"./assets/img/sp24.png",price:250000,discount:10,rating:4.8,hasGift: true,sold:2700,description:"Kiềm dầu."},
{id:25,title:"Highlight JUDYDOLL",category:"Trang điểm",img:"./assets/img/sp25.png",price:280000,discount:12,rating:4.8,sold:1900,hasGift: true,description:"Bắt sáng."},
{id:26,title:"Phấn mắt Romand",category:"Trang điểm",img:"./assets/img/sp26.png",price:300000,discount:15,rating:4.8,sold:2100,description:"Lên màu chuẩn."},
{id:27,title:"Kem lót JUDYDOLL",category:"Trang điểm",img:"./assets/img/sp27.png",price:250000,discount:10,rating:4.7,sold:2300,description:"Mịn da."},
{id:28,title:"Xịt khóa makeup CARSLAN",category:"Trang điểm",img:"./assets/img/sp28.png",price:300000,discount:12,rating:4.8,sold:1800,description:"Giữ lớp nền."},
{id:29,title:"Kẻ mắt JUDYDOLL",category:"Trang điểm",img:"./assets/img/sp29.png",price:120000,discount:5,rating:4.7,sold:4200,description:"Dễ vẽ."},
{id:30,title:"Phấn má 3CE",category:"Trang điểm",img:"./assets/img/sp30.png",price:200000,discount:10,rating:4.8,sold:2600,hasGift: true,description:"Má hồng tự nhiên."},

{id:31,title:"Dầu gội TRESemmé",category:"Chăm sóc tóc",img:"./assets/img/sp31.png",price:180000,discount:10,rating:4.7,sold:3800,description:"Sạch tóc."},
{id:32,title:"Dove dưỡng tóc",category:"Chăm sóc tóc",img:"./assets/img/sp32.png",price:150000,discount:85,rating:4.7,sold:3600,description:"Mềm tóc."},
{id:33,title:"Dầu xả PANTENE",category:"Chăm sóc tóc",img:"./assets/img/sp33.png",price:180000,discount:80,rating:4.7,sold:2500,description:"Mềm tóc."},
{id:34,title:"Xịt tạo kiểu",category:"Chăm sóc tóc",img:"./assets/img/sp34.png",price:200000,discount:10,rating:4.7,sold:2000,description:"Giữ nếp lâu."},

{id:35,title:"Lotion Vaseline",category:"Chăm sóc cơ thể",img:"./assets/img/sp35.png",price:150000,discount:10,rating:4.8,sold:4200,description:"Dưỡng trắng."},
{id:36,title:"Sữa tắm Dove",category:"Chăm sóc cơ thể",img:"./assets/img/sp36.png",price:180000,discount:10,rating:4.8,sold:3900,description:"Dịu nhẹ."},
{id:37,title:"Lotion Nivea",category:"Chăm sóc cơ thể",img:"./assets/img/sp37.png",price:170000,discount:60,rating:4.7,sold:3100,description:"Dưỡng ẩm."},
{id:38,title:"Tẩy da chết St Ives",category:"Chăm sóc cơ thể",img:"./assets/img/sp38.png",price:200000,discount:12,rating:4.8,sold:2800,description:"Sáng da."},
{id:39,title:"Xịt thơm VS",category:"Chăm sóc cơ thể",img:"./assets/img/sp39.png",price:300000,discount:15,rating:4.8,sold:2600,description:"Thơm lâu."},
{id:40,title:"Body mist",category:"Chăm sóc cơ thể",img:"./assets/img/sp40.png",price:250000,discount:10,rating:4.7,sold:2300,description:"Mùi nhẹ."},

{id:41,title:"Dior Sauvage",category:"Nước hoa",img:"./assets/img/sp41.png",price:2500000,discount:20,rating:4.9,sold:1200,description:"Mùi nam tính."},
{id:42,title:"Chanel Coco",category:"Nước hoa",img:"./assets/img/sp42.png",price:2800000,discount:18,rating:4.9,sold:900,description:"Sang trọng."},
{id:43,title:"YSL Libre",category:"Nước hoa",img:"./assets/img/sp43.png",price:2600000,discount:20,rating:4.9,sold:1000,description:"Quyến rũ."},
{id:44,title:"Gucci Bloom",category:"Nước hoa",img:"./assets/img/sp44.png",price:2400000,discount:15,rating:4.8,sold:800,description:"Hoa cỏ."},
{id:45,title:"Versace Bright",category:"Nước hoa",img:"./assets/img/sp45.png",price:2300000,discount:15,rating:4.8,sold:850,description:"Tươi mát."},
{id:46,title:"Mút trang điểm",category:"Dụng cụ & phụ kiện làm đẹp",img:"./assets/img/sp46.png",price:80000,discount:5,rating:4.7,sold:5000,description:"Tán nền."},
{id:47,title:"Cọ trang điểm",category:"Dụng cụ & phụ kiện làm đẹp",img:"./assets/img/sp47.png",price:150000,discount:10,rating:4.8,sold:4200,description:"Trang điểm."}
];
localStorage.setItem('products', JSON.stringify(products));
    }
}
// Create admin account 
function createAdminAccount() {
    let accounts = localStorage.getItem("accounts");
    if (!accounts) {
        accounts = [];
        accounts.push({
            fullname: "abc",
            phone: "11223344",
            password: "123456",
            address: '',
            email: '',
            status: 1,
            join: new Date(),
            cart: [],
            userType: 1
        })
        accounts.push({
            fullname: "aaa",
            phone: "0123456789",
            password: "123456",
            address: '',
            email: '',
            status: 1,
            join: new Date(),
            cart: [],
            userType: 1
        })
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }
}

    createProduct();
    createAdminAccount();

