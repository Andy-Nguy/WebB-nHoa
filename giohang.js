async function loadCombos() {
    const combosContainer = document.getElementById('combos');

    if (!combosContainer) {
        console.error('Phần tử #combos không được tìm thấy trong DOM');
        return;
    }

    combosContainer.innerHTML = '';

    // Dữ liệu combo tĩnh
    const staticCombos = [
        {
            items: ["Hoa Cưới Cầm Tay Dáng Tròn", "Hoa Khai Trương Hồng Phát"],
            original_price: 1250000,
            discounted_price: 1125000,
            discount_percentage: 10.0,
            support: 0.2,
            images: ["/image/hoa cuoi dang tron.jpg", "/image/hoa khai truong hong phat.jpg"]
        }
        // Có thể thêm các combo khác
    ];

    try {
        // Lấy dữ liệu từ API
        const response = await fetch('http://localhost:5000/combos');
        const apiCombos = await response.json();
        
        // Kết hợp combo tĩnh và combo từ API
        const combos = [...staticCombos, ...apiCombos];
        console.log('Combos:', combos);

        if (combos.length === 0) {
            combosContainer.innerHTML = '<p class="text-center text-gray-500">Không có combo nào.</p>';
            return;
        }

        combos.forEach(combo => {
            const comboCard = document.createElement('div');
            comboCard.className = 'col';
            comboCard.innerHTML = `
                <div class="card h-100">
                    <div class="combo-images">
                        <img src="${combo.images[0]}" class="card-img-top" alt="Combo: ${combo.items.join(', ')}">
                        ${combo.images[1] ? `<img src="${combo.images[1]}" class="card-img-top" alt="Combo: ${combo.items.join(', ')}">` : ''}
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">Combo: ${combo.items.join(', ')}</h5>
                        <p class="card-text text-muted">Giá gốc: ${combo.original_price.toLocaleString()} VNĐ</p>
                        <p class="card-text text-success fw-bold">Giá chiết khấu: ${combo.discounted_price.toLocaleString()} VNĐ</p>
                        <p class="card-text text-danger fw-bold">Giảm: ${combo.discount_percentage.toFixed(1)}%</p>
                        <p class="card-text text-muted">Hỗ trợ: ${(combo.support * 100).toFixed(2)}%</p>
                        <button class="btn btn-primary" onclick="addComboToCart(${JSON.stringify(combo.items)})">Thêm vào giỏ hàng</button>
                    </div>
                </div>
            `;
            combosContainer.appendChild(comboCard);
        });
    } catch (error) {
        console.error('Lỗi khi lấy combo:', error);
        combosContainer.innerHTML = '<p class="text-center text-red-500">Lỗi khi tải combo.</p>';
    }
}

function addComboToCart(comboItems) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let missingItems = [];

    comboItems.forEach(item => {
        const existingItem = cart.find(cartItem => cartItem.name === item);
        if (!existingItem) {
            missingItems.push(item);
        }
    });

    if (missingItems.length === 0) {
        alert('Combo này đã có trong giỏ hàng!');
        return;
    }

    missingItems.forEach(item => {
        const flower = getFlowerDetails(item);
        if (flower && flower.price) {
            cart.push({
                name: item,
                price: flower.price,
                quantity: 1,
                image: flower.image
            });
        } else {
            console.error(`Không tìm thấy thông tin sản phẩm: ${item}`);
        }
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    alert('Đã thêm combo vào giỏ hàng!');
}

// Gọi hàm khi trang tải
window.onload = loadCombos;