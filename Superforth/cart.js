document.addEventListener('DOMContentLoaded', function() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    let cart = [];
    
    // Initialize cart from localStorage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCart();
    }
    
    // Add to cart functionality
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            let price = 0;
            
            if (product === 'Premium Monthly') {
                price = 9.99;
            } else if (product === 'Annual Membership') {
                price = 79.99;
            }
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.product === product);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    product,
                    price,
                    quantity: 1
                });
            }
            
            updateCart();
            saveCartToLocalStorage();
            openCart();
        });
    });
    
    // Update cart UI
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '$0.00';
            checkoutBtn.disabled = true;
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-info">
                    <h4>${item.product}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
                <div class="item-actions">
                    <button class="quantity-btn minus" data-product="${item.product}">-</button>
                    <button class="quantity-btn plus" data-product="${item.product}">+</button>
                    <button class="remove-btn" data-product="${item.product}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
        checkoutBtn.disabled = false;
        
        // Add event listeners to new buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const product = this.getAttribute('data-product');
                const item = cart.find(item => item.product === product);
                
                if (this.classList.contains('minus')) {
                    if (item.quantity > 1) {
                        item.quantity -= 1;
                    } else {
                        cart = cart.filter(item => item.product !== product);
                    }
                } else if (this.classList.contains('plus')) {
                    item.quantity += 1;
                }
                
                updateCart();
                saveCartToLocalStorage();
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const product = this.getAttribute('data-product');
                cart = cart.filter(item => item.product !== product);
                
                updateCart();
                saveCartToLocalStorage();
            });
        });
    }
    
    // Cart sidebar controls
    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    
    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        alert('Thank you for your purchase! This is a demo site, so no actual transaction will occur.');
        cart = [];
        updateCart();
        saveCartToLocalStorage();
        closeCart();
    });
    
    // Save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
});