// --- Cart Management Variables ---
console.log("Script loaded");
let cart = []; // Array untuk menyimpan item di keranjang

// --- Document Ready / Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Inisialisasi logika Scroll Reveal
    setupScrollReveal();

    // Event listeners untuk Cart Modal
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.getElementById('close-cart');
    const cartModal = document.querySelector('.cart-modal');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Buka Modal Keranjang
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('show');
        renderCartItems(); // Panggil fungsi untuk menampilkan item
    });

    // Tutup Modal Keranjang
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('show');
    });

    // Tutup modal saat klik di luar area modal
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('show');
        }
    });

    // Event listener untuk tombol Checkout
    checkoutBtn.addEventListener('click', () => {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if(!isLoggedIn){

        alert("Silakan login terlebih dahulu sebelum checkout!");

        const modal = new bootstrap.Modal(document.getElementById('authModal'));
        modal.show();

        return;

    }

    });
});


// --- Cart Helper Functions ---

/**
 * Fungsi untuk mencari harga berdasarkan nama produk.
 * Dalam aplikasi nyata, data ini biasanya diambil dari database.
 */
function getProductPrice(productName) {
    // Harga diambil dari data di HTML Anda
    switch (productName) {
        case 'Café Latte': return 30000;
        case 'Milk Coffee': return 38000;
        case 'Chocolate Frappé': return 45000;
        case 'Iced Matcha Latte': return 55000;
        case 'Caramel Macchiato': return 50000; // Harga pertama
        case 'Americano': return 25000;
        case 'Espresso': return 15000;
        case 'Ice Flat Latte': return 40000;
        // Catatan: Ada 2 Caramel Macchiato di HTML dengan harga berbeda. 
        // Untuk kesederhanaan, saya hanya menggunakan satu harga di JS.
        default: return 0;
    }
}

/**
 * Fungsi utama untuk menambahkan produk ke keranjang.
 * Dipanggil dari tombol 'Add to Cart' di HTML.
 * @param {string} produkNama 
 */
function tambahKeKeranjang(produkNama) {
    const price = getProductPrice(produkNama);
    
    // Cek apakah produk sudah ada di keranjang (untuk menambah kuantitas)
    const existingItem = cart.find(item => item.name === produkNama);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: produkNama,
            price: price,
            quantity: 1
        });
    }

    updateCartCount();
    showToast(`${produkNama} berhasil masuk ke keranjang!`);
}

/**
 * Menghitung total harga semua item di keranjang.
 */
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Fungsi untuk menghapus item dari keranjang berdasarkan index di array.
 * @param {number} index 
 */
function removeItemFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1); // Hapus 1 item pada index tertentu
    updateCartCount();
    renderCartItems(); // Render ulang daftar item setelah dihapus
    showToast(`${itemName} dihapus dari keranjang.`, false); // Gunakan warna default/error jika perlu
}

/**
 * Fungsi untuk memperbarui angka di ikon keranjang.
 */
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

/**
 * Fungsi untuk menampilkan daftar item dan total harga di modal keranjang.
 */
function renderCartItems() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Kosongkan daftar sebelumnya
    let totalHarga = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="empty-cart-msg">Keranjang Anda masih kosong.</li>';
    } else {
        cart.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('cart-item');
            
            const itemTotal = item.price * item.quantity;
            totalHarga += itemTotal;
            
            listItem.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>${formatRupiah(itemTotal)}</span>
                <button class="remove-item-btn" data-index="${index}">Hapus</button>
            `;
            cartList.appendChild(listItem);
        });

        // Tambahkan total harga di bagian bawah
        const totalItem = document.createElement('li');
        totalItem.classList.add('cart-total');
        totalItem.innerHTML = `
            <strong>Total:</strong>
            <strong>${formatRupiah(totalHarga)}</strong>
        `;
        cartList.appendChild(totalItem);

        // Tambahkan event listener untuk tombol hapus
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.dataset.index);
                removeItemFromCart(indexToRemove);
            });
        });
    }
}


// --- Utility Functions ---

/**
 * Helper function untuk memformat angka menjadi format Rupiah.
 * @param {number} angka
 */
function formatRupiah(angka) {
    // Menggunakan Intl.NumberFormat untuk format Rupiah yang benar
    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
    
    return formatted.replace('IDR', 'Rp');
}

/**
 * Fungsi untuk menampilkan notifikasi toast sederhana.
 * @param {string} message - Pesan yang akan ditampilkan.
 * @param {boolean} isSuccess - Menentukan apakah pesan berhasil (true) atau menambah item/lainnya (false).
 */
function showToast(message, isSuccess = false) {
    const toast = document.getElementById('toast-notif');
    const msgElement = document.getElementById('toast-msg');
    
    msgElement.textContent = message;

    // Mengubah warna toast berdasarkan status
    if (isSuccess) {
        toast.style.backgroundColor = '#5cb85c'; // Hijau untuk sukses/checkout
    } else {
        toast.style.backgroundColor = '#3e4637'; // Warna default untuk penambahan item
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        // Reset warna ke default setelah hilang
        toast.style.backgroundColor = '#3e4637'; 
    }, 2000); 
}


// --- Scroll Reveal Logic ---

function setupScrollReveal() {
    // Elemen untuk Story dan About Section
    const storyElements = document.querySelectorAll(
        '#our-story .story-image-wrapper, #our-story .col-md-6:last-child'
    );
    
    const aboutElements = document.querySelectorAll(
        '.about-image, .about-text'
    );
    
    // Elemen untuk Gallery Section
    const galleryElements = document.querySelectorAll('.masonry a'); 
    
    // Gabungkan semua elemen yang akan dianimasikan
    const allElements = [...storyElements, ...aboutElements, ...galleryElements].filter(el => el != null);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const element = entry.target;

            if (entry.isIntersecting) {
                element.classList.add('scroll-reveal');
                // Berhenti mengamati elemen setelah animasi pertama kali muncul
                // observer.unobserve(element); 
            } else {
                 element.classList.remove('scroll-reveal');
            }
        });
    }, {
        threshold: 0.1 // Animasi dipicu saat 10% elemen terlihat
    });

    allElements.forEach(element => {
        observer.observe(element);
    });
}

// =======================
// AUTH SYSTEM (SECURITY FEATURE)
// =======================

// buka modal login
document.addEventListener('DOMContentLoaded', function(){

    const loginBtn = document.getElementById('login-btn');

    if(loginBtn){

        loginBtn.addEventListener('click', function(){

            const modalElement = document.getElementById('authModal');

            const modal = new bootstrap.Modal(modalElement);

            modal.show();

        });

    }

});

// register user
function registerUser(){

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if(!name || !email || !password){

        alert("Semua field harus diisi!");
        return;

    }

    const user = {

        name: name,
        email: email,
        password: password

    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Register berhasil! Silakan login.");

    showLogin();

}

// login user
function loginUser(){

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if(!savedUser){

        alert("Akun tidak ditemukan!");
        return;

    }

    if(email === savedUser.email && password === savedUser.password){

        localStorage.setItem("isLoggedIn", "true");

        alert("Login berhasil!");

        bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();

    }
    else{

        alert("Email atau password salah!");

    }

}

// show register form
function showRegister(){

    document.getElementById('login-form').style.display = "none";
    document.getElementById('register-form').style.display = "block";

}

// show login form
function showLogin(){

    document.getElementById('login-form').style.display = "block";
    document.getElementById('register-form').style.display = "none";

}

// ===========================
// SHOW FORGOT PASSWORD
// ===========================

function showForgot(){

    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "none";
    document.getElementById("forgot-form").style.display = "block";

}


// ===========================
// GENERATE & SEND OTP
// ===========================

let generatedOTP = "";

function sendOTP(){

    const email = document.getElementById("forgot-email").value;

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if(!savedUser || email !== savedUser.email){
        alert("Email tidak terdaftar!");
        return;
    }

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    alert("OTP anda adalah: " + generatedOTP);
    alert("Simulasi: OTP dikirim ke email.");

}


// ===========================
// RESET PASSWORD
// ===========================

function resetPassword(){

    const otpInput = document.getElementById("otp-input").value;
    const newPassword = document.getElementById("new-password").value;

    if(otpInput !== generatedOTP){
        alert("OTP salah!");
        return;
    }

    let user = JSON.parse(localStorage.getItem("user"));

    user.password = newPassword;

    localStorage.setItem("user", JSON.stringify(user));

    alert("Password berhasil diubah!");

    generatedOTP = "";

    showLogin();

}