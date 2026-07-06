/* ==========================================
   APP LOGIC & SIMULATION: SUMITECHPOINT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================
       GLOBAL THEME SWITCHER (CLARO / OSCURO)
       ========================================== */
    const themeToggle = document.getElementById('btn-theme-toggle');
    
    // Default to Light theme (light mode)
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'light') {
        document.body.classList.add('theme-light');
        if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.body.classList.remove('theme-light');
        if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('theme-light');
            const isLight = document.body.classList.contains('theme-light');
            themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }
    // Current Active Registered User
    let currentUser = null;
    let claimedBenefits = [];
    let simulatedReferralsCount = 0;
    let cart = [];
    let purchaseHistory = [];

    // Database Metrics (Image 6 defaults)
    const metrics = {
        downloads: 2500,
        registered: 2100,
        claimed: 1500,
        chats: 900,
        purchases: 650,
        referrals: 180
    };

    // Prepopulated Friends names for simulation
    const simulatedFriendsNames = [
        "Sofía Ruiz Valdivia", "Marcos Silva Rojas", "Alejandra Luna Ortiz", 
        "Roberto Paz Cárdenas", "Patricia Vega Ríos", "Esteban Castro Solís", 
        "Valeria Ramos Díaz", "Ricardo Soto Vargas", "Gabriela Cruz Peña"
    ];

    // Catalog Products Database (3 products per category)
    const catalogProducts = {
        laptops: [
            { name: "Laptop Gamer Sumi Pro", price: "S/ 3,499.00", img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=200&auto=format&fit=crop&q=60" },
            { name: "Notebook Slim Estudiante", price: "S/ 1,599.00", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&auto=format&fit=crop&q=60" },
            { name: "Laptop HP 15-FD0331LA Intel Core i9", price: "S/ 4,299.00", img: "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=200&auto=format&fit=crop&q=60" }
        ],
        pcs: [
            { name: "PC Master Gamer RTX 4060", price: "S/ 3,199.00", img: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=200&auto=format&fit=crop&q=60" },
            { name: "Computadora de Oficina Slim", price: "S/ 1,299.00", img: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=200&auto=format&fit=crop&q=60" },
            { name: "Workstation Pro Ryzen 9", price: "S/ 5,899.00", img: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=200&auto=format&fit=crop&q=60" }
        ],
        printers: [
            { name: "Impresora Multifuncional Tinta Continua", price: "S/ 649.00", img: "https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=200&auto=format&fit=crop&q=60" },
            { name: "Impresora Hp Laser M111w WiFi USB", price: "S/ 499.00", img: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200&auto=format&fit=crop&q=60" },
            { name: "Impresora Térmica de Recibos USB", price: "S/ 249.00", img: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=200&auto=format&fit=crop&q=60" }
        ],
        accessories: [
            { name: "Teclado Mecánico RGB", price: "S/ 189.00", img: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=200&auto=format&fit=crop&q=60" },
            { name: "Kit de Limpieza de Pantallas", price: "S/ 29.00", img: "screen_cleaning_kit.png" },
            { name: "Soporte Ergonómico para Laptop", price: "S/ 79.00", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&auto=format&fit=crop&q=60" }
        ],
        components: [
            { name: "Memoria RAM DDR5 16GB", price: "S/ 249.00", img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=200&auto=format&fit=crop&q=60" },
            { name: "Disco Sólido SSD NVMe 1TB", price: "S/ 299.00", img: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=200&auto=format&fit=crop&q=60" },
            { name: "Tarjeta de Video RTX 3050", price: "S/ 1,199.00", img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&auto=format&fit=crop&q=60" }
        ],
        mouse: [
            { name: "Mouse Gamer Ergonómico", price: "S/ 89.00", img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&auto=format&fit=crop&q=60" },
            { name: "Mouse Gamer Aula SC380 PRO Inalambrico Bluetooth 12000 DPI Negro", price: "S/ 199.00", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&auto=format&fit=crop&q=60" },
            { name: "Mouse Óptico Básico USB", price: "S/ 39.00", img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=200&auto=format&fit=crop&q=60" }
        ],
        headphones: [
            { name: "Audífonos Gamer con Micrófono", price: "S/ 149.00", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60" },
            { name: "Auriculares Bluetooth Cancelación Ruido", price: "S/ 299.00", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop&q=60" },
            { name: "Diadema con Micrófono USB", price: "S/ 99.00", img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&auto=format&fit=crop&q=60" }
        ],
        monitors: [
            { name: "Monitor Gamer 24\" 144Hz", price: "S/ 599.00", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&auto=format&fit=crop&q=60" },
            { name: "Monitor de Oficina FHD 27\"", price: "S/ 749.00", img: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=200&auto=format&fit=crop&q=60" },
            { name: "Monitor UltraWide Curvo 34\"", price: "S/ 1,499.00", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&auto=format&fit=crop&q=60" }
        ]
    };

    /* ==========================================
       ADMIN PANEL SIDEBAR NAVIGATION
       ========================================== */
    const navButtons = document.querySelectorAll('.sidebar-btn');
    const adminSections = document.querySelectorAll('.admin-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            adminSections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            const targetSectionId = btn.getAttribute('data-section');
            document.getElementById(targetSectionId).classList.add('active');
        });
    });

    /* ==========================================
       SMARTPHONE SIMULATOR ROUTER
       ========================================== */
    const phoneViews = document.querySelectorAll('.phone-screen-view');
    const bottomNavItems = document.querySelectorAll('.nav-item-phone');

    function navigatePhoneTo(screenId) {
        phoneViews.forEach(view => {
            view.classList.remove('active');
        });
        const targetView = document.getElementById(screenId);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Auto-update bottom navigation active state if applicable
        bottomNavItems.forEach(item => {
            if (item.getAttribute('data-app-screen') === screenId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Dynamic checks for specific screens
        if (screenId === 'screen-app-home') {
            document.getElementById('app-user-name').textContent = currentUser ? currentUser.name.split(' ')[0] : 'Usuario';
        }
    }

    // Phone Bottom Nav Click
    bottomNavItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!currentUser) {
                showToast("⚠️ Primero debes registrarte en la aplicación para acceder a esta sección.", "purple");
                navigatePhoneTo('screen-splash');
                return;
            }
            const targetScreen = item.getAttribute('data-app-screen');
            navigatePhoneTo(targetScreen);
        });
    });

    // Hardware Home button click (Restarts/Goes to Play Store or Home depending on install)
    document.getElementById('phone-hardware-home').addEventListener('click', () => {
        if (!currentUser) {
            navigatePhoneTo('screen-playstore');
        } else {
            navigatePhoneTo('screen-app-home');
        }
    });

    // Back to main menu triggers inside app screens
    document.querySelectorAll('.back-to-home').forEach(btn => {
        btn.addEventListener('click', () => {
            navigatePhoneTo('screen-app-home');
        });
    });

    /* ==========================================
       SHOPPING CART INTEGRATION
       ========================================== */
    function updateCartBadge() {
        const badgeCount = cart.reduce((sum, item) => sum + item.qty, 0);
        document.querySelectorAll('.header-cart-badge').forEach(badge => {
            badge.textContent = badgeCount;
            badge.style.display = badgeCount > 0 ? 'flex' : 'none';
        });
    }

    function addToCart(name, price, img) {
        if (!currentUser) {
            showToast("⚠️ Primero debes registrarte en la aplicación.", "purple");
            navigatePhoneTo('screen-splash');
            return;
        }
        const cleanPrice = parseFloat(price.replace('S/ ', '').replace(/,/g, ''));
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ name, price: cleanPrice, img, qty: 1 });
        }
        
        updateCartBadge();
        showToast(`🛒 ${name} añadido al carrito`, "green");
    }

    function renderCart() {
        const container = document.getElementById('cart-items-container');
        const summaryWrapper = document.getElementById('cart-summary-wrapper');
        const emptyState = document.getElementById('cart-empty-state');
        
        container.innerHTML = '';
        
        if (cart.length === 0) {
            summaryWrapper.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }
        
        summaryWrapper.classList.remove('hidden');
        emptyState.classList.add('hidden');
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            
            const itemRow = document.createElement('div');
            itemRow.className = 'cart-item-row';
            itemRow.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null; this.src='placeholder_product.png';">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span>S/ ${formatNum(item.price.toFixed(2))} x ${item.qty}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-remove-item" data-name="${item.name}">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            `;
            container.appendChild(itemRow);
        });
        
        const igv = subtotal * 0.18;
        const total = subtotal + igv;
        
        document.getElementById('cart-subtotal').textContent = `S/ ${formatNum(subtotal.toFixed(2))}`;
        document.getElementById('cart-igv').textContent = `S/ ${formatNum(igv.toFixed(2))}`;
        document.getElementById('cart-total').textContent = `S/ ${formatNum(total.toFixed(2))}`;
        
        // Remove item click listeners
        container.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.getAttribute('data-name');
                cart = cart.filter(item => item.name !== name);
                updateCartBadge();
                renderCart();
            });
        });
    }

    // Go to Cart click handlers
    document.querySelectorAll('.btn-go-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!currentUser) {
                showToast("⚠️ Primero debes registrarte en la aplicación para acceder a esta sección.", "purple");
                navigatePhoneTo('screen-splash');
                return;
            }
            navigatePhoneTo('screen-app-cart');
            renderCart();
        });
    });

    /* ==========================================
       CHECKOUT FLOW SIMULATOR
       ========================================== */
    const paymentMethodCards = document.querySelectorAll('.payment-method-card');
    const formPaymentCard = document.getElementById('form-payment-card');
    const yapePaymentBox = document.getElementById('yape-payment-box');
    const cardNumInput = document.getElementById('pay-card-number');
    const cardExpiryInput = document.getElementById('pay-card-expiry');
    let selectedPaymentMethod = 'card';

    // Cart screen to Checkout screen transition
    document.getElementById('btn-cart-checkout').addEventListener('click', () => {
        navigatePhoneTo('screen-app-checkout');
        let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        let total = subtotal * 1.18;
        document.getElementById('checkout-total-val').textContent = `S/ ${formatNum(total.toFixed(2))}`;
    });

    document.getElementById('btn-back-from-checkout').addEventListener('click', () => {
        navigatePhoneTo('screen-app-cart');
    });

    // Payment Method selector
    paymentMethodCards.forEach(card => {
        card.addEventListener('click', () => {
            paymentMethodCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            selectedPaymentMethod = card.getAttribute('data-method');
            if (selectedPaymentMethod === 'card') {
                formPaymentCard.classList.remove('hidden');
                yapePaymentBox.classList.add('hidden');
            } else {
                formPaymentCard.classList.add('hidden');
                yapePaymentBox.classList.remove('hidden');
            }
        });
    });

    // Credit Card number auto-spacing
    cardNumInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let matches = val.match(/\d{4,16}/g);
        let match = matches && matches[0] || '';
        let parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        e.target.value = (parts.length > 0) ? parts.join(' ') : val;
    });

    // Expiry date auto-slash
    cardExpiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (val.length >= 2) {
            e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
        } else {
            e.target.value = val;
        }
    });

    // Payment Submissions
    formPaymentCard.addEventListener('submit', (e) => {
        e.preventDefault();
        processCheckoutPayment('Tarjeta');
    });

    document.getElementById('btn-yape-pay-confirm').addEventListener('click', () => {
        processCheckoutPayment('Yape / Plin');
    });

    function processCheckoutPayment(method) {
        const loadingOverlay = document.getElementById('checkout-loading-screen');
        loadingOverlay.classList.remove('hidden');
        
        let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        let total = subtotal * 1.18;
        const purchaseNames = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            
            // Random Transaction ID
            const txId = `STP-${Math.floor(100000 + Math.random() * 900000)}`;
            
            // Populate Receipt screen
            document.getElementById('receipt-tx-id').textContent = txId;
            document.getElementById('receipt-date').textContent = getFormattedDate();
            document.getElementById('receipt-method').textContent = method;
            document.getElementById('receipt-amount').textContent = `S/ ${formatNum(total.toFixed(2))}`;
            
            // Add purchase to history array
            purchaseHistory.unshift({
                txId: txId,
                date: getFormattedDate(),
                method: method,
                amount: total.toFixed(2),
                items: purchaseNames
            });

            // Add purchase to Client Database table
            const pRow = document.createElement('tr');
            pRow.innerHTML = `
                <td><strong>#${txId.substring(4)}</strong></td>
                <td>${currentUser.name}</td>
                <td>${currentUser.email}</td>
                <td>${currentUser.phone}</td>
                <td><span class="badge badge-cyan">Pago: ${method}</span></td>
                <td><span class="badge badge-green">Compra: ${cart[0].name}${cart.length > 1 ? ' + ' + (cart.length - 1) + ' p.' : ''}</span></td>
                <td>${getFormattedDate()}</td>
            `;
            if (tableBody) {
                tableBody.insertBefore(pRow, tableBody.firstChild);
            }
            
            // Highlight table row
            pRow.style.background = 'rgba(0, 230, 118, 0.1)';
            setTimeout(() => {
                pRow.style.background = 'transparent';
            }, 3000);
            
            // Clear cart
            cart = [];
            updateCartBadge();
            
            // Update admin metrics
            metrics.purchases += 1;
            updateAdminMetrics();
            
            showToast("💳 ¡Pago aprobado con éxito!", "green");
            navigatePhoneTo('screen-app-payment-success');
        }, 2000);
    }

    document.getElementById('btn-receipt-finish').addEventListener('click', () => {
        navigatePhoneTo('screen-app-home');
    });

    /* ==========================================
       PURCHASE HISTORY VIEW
       ========================================== */
    function renderPurchaseHistory() {
        const container = document.getElementById('history-items-container');
        const emptyState = document.getElementById('history-empty-state');
        
        container.innerHTML = '';
        
        if (purchaseHistory.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        purchaseHistory.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'history-card card bg-white mb-1';
            orderCard.innerHTML = `
                <div class="history-card-header">
                    <span class="text-xs text-muted">Transacción: <strong>${order.txId}</strong></span>
                    <span class="text-xs text-blue font-700">S/ ${formatNum(order.amount)}</span>
                </div>
                <div class="history-card-body mt-1">
                    <p class="text-xs text-dark font-600">${order.items}</p>
                    <div class="history-card-footer mt-1">
                        <span class="text-xxs text-muted"><i class="fa-regular fa-calendar"></i> ${order.date}</span>
                        <span class="text-xxs text-muted"><i class="fa-regular fa-credit-card"></i> ${order.method}</span>
                    </div>
                </div>
            `;
            container.appendChild(orderCard);
        });
    }

    document.getElementById('menu-btn-history').addEventListener('click', () => {
        navigatePhoneTo('screen-app-history');
        renderPurchaseHistory();
    });

    /* ==========================================
       PLAY STORE DOWNLOAD & INSTALLATION
       ========================================== */
    const btnOpenStoreDetails = document.getElementById('btn-open-store-details');
    const btnBackToStoreSearch = document.getElementById('btn-back-to-store-search');
    const btnStartInstallation = document.getElementById('btn-start-installation');
    const installProgressWrapper = document.getElementById('install-progress-wrapper');
    const installProgressFill = document.getElementById('install-progress-fill');
    const installPercentage = document.getElementById('install-percentage');
    const btnOpenAppFirst = document.getElementById('btn-open-app-first');

    btnOpenStoreDetails.addEventListener('click', () => {
        navigatePhoneTo('screen-store-details');
    });

    btnBackToStoreSearch.addEventListener('click', () => {
        navigatePhoneTo('screen-playstore');
    });

    btnStartInstallation.addEventListener('click', () => {
        btnStartInstallation.classList.add('hidden');
        installProgressWrapper.classList.remove('hidden');

        let percent = 0;
        const interval = setInterval(() => {
            percent += Math.floor(Math.random() * 15) + 5;
            if (percent >= 100) {
                percent = 100;
                clearInterval(interval);
                installProgressWrapper.classList.add('hidden');
                btnOpenAppFirst.classList.remove('hidden');
                
                metrics.downloads += 1;
                updateAdminMetrics();
                
                showToast("📥 Aplicación 'SumiTechPoint' descargada con éxito.", "cyan");
            }
            installProgressFill.style.width = percent + '%';
            installPercentage.textContent = percent + '%';
        }, 150);
    });

    btnOpenAppFirst.addEventListener('click', () => {
        navigatePhoneTo('screen-splash');
    });

    // Splash Welcome continue
    document.getElementById('btn-splash-continue').addEventListener('click', () => {
        navigatePhoneTo('screen-register');
    });

    document.getElementById('btn-register-back-to-splash').addEventListener('click', () => {
        navigatePhoneTo('screen-splash');
    });

    /* ==========================================
       USER REGISTRATION & DATABASE
       ========================================== */
    const formRegister = document.getElementById('form-user-register');
    const tableBody = document.getElementById('db-table-body') || document.getElementById('db-table-body-global');
    const maturityProgress = document.getElementById('maturity-progress');

    // Toggle Passwords visibility
    document.querySelectorAll('.toggle-pass').forEach(icon => {
        icon.addEventListener('click', () => {
            const input = icon.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-regular', 'fa-solid');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-solid', 'fa-regular');
            }
        });
    });

    formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-pass').value;
        const confirmPass = document.getElementById('reg-confirm-pass').value;
        const phone = document.getElementById('reg-phone').value.trim();

        if (pass !== confirmPass) {
            showToast("❌ Las contraseñas no coinciden.", "red");
            return;
        }

        currentUser = {
            id: `#STP-${Math.floor(Math.random() * 9000) + 1000}`,
            name: name,
            email: email,
            phone: phone,
            channel: "Aplicativo Móvil",
            date: getFormattedDate()
        };

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><strong>${currentUser.id}</strong></td>
            <td>${currentUser.name}</td>
            <td>${currentUser.email}</td>
            <td>${currentUser.phone}</td>
            <td><span class="badge badge-cyan">${currentUser.channel}</span></td>
            <td><span class="badge-none" id="table-user-benefits">Ninguno</span></td>
            <td>${currentUser.date}</td>
        `;
        if (tableBody) {
            tableBody.insertBefore(newRow, tableBody.firstChild);
        }

        newRow.style.background = 'rgba(0, 229, 255, 0.1)';
        setTimeout(() => {
            newRow.style.background = 'transparent';
        }, 3000);

        metrics.registered += 1;
        updateAdminMetrics();

        if (maturityProgress) {
            maturityProgress.style.width = '75%';
            maturityProgress.textContent = '75% (Fidelizado)';
            maturityProgress.className = 'progress-bar-fill';
            maturityProgress.style.boxShadow = '0 0 20px var(--purple-glow)';
        }

        showToast("🎉 Cuenta registrada correctamente en base de datos.", "green");
        navigatePhoneTo('screen-success');
    });

    document.getElementById('btn-success-go-home').addEventListener('click', () => {
        navigatePhoneTo('screen-app-home');
    });

    /* ==========================================
       BENEFITS CLAIM SIMULATION
       ========================================== */
    const claimButtons = document.querySelectorAll('.btn-claim');

    claimButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const benefitType = btn.getAttribute('data-benefit');
            
            if (claimedBenefits.includes(benefitType)) {
                showToast("ℹ️ Este beneficio ya está activo en tu cuenta.", "purple");
                return;
            }

            claimedBenefits.push(benefitType);
            btn.textContent = "Activo (30 días)";
            btn.classList.add('claimed');
            btn.style.backgroundColor = "var(--green)";
            btn.style.color = "var(--bg-dark)";

            metrics.claimed += 1;
            updateAdminMetrics();

            const tableUserBenefitsSpan = document.getElementById('table-user-benefits');
            if (tableUserBenefitsSpan) {
                const mapped = claimedBenefits.map(b => b.charAt(0).toUpperCase() + b.slice(1));
                tableUserBenefitsSpan.textContent = mapped.join(' + ');
                tableUserBenefitsSpan.className = 'badge badge-green';
            }

            // OPEN DIALOG MODAL FOR EMAIL ACTIVATION CONFIRMATION
            const modal = document.getElementById('phone-global-modal');
            const modalTitle = document.getElementById('phone-modal-title');
            const modalMsg = document.getElementById('phone-modal-message');
            
            modalTitle.textContent = "¡Beneficio Canjeado! 🎁";
            
            let benefitNameStr = "Antivirus Premium";
            if (benefitType === "office") benefitNameStr = "Microsoft Office Suite";
            if (benefitType === "cloud") benefitNameStr = "Almacenamiento en la Nube";
            
            modalMsg.innerHTML = `Hemos enviado los códigos de licencia e instrucciones de instalación de tu <strong>${benefitNameStr}</strong> al correo registrado:<br><br><span class="text-blue font-600">${currentUser.email}</span>.<br><br>Revisa tu bandeja de entrada o la carpeta de correo no deseado (spam) para completar la activación.`;
            modal.classList.remove('hidden');
        });
    });

    // Close Phone Dialog Modal
    document.getElementById('btn-phone-modal-close').addEventListener('click', () => {
        document.getElementById('phone-global-modal').classList.add('hidden');
    });

    /* ==========================================
       DIGITAL CATALOG CATEGORIES
       ========================================== */
    const categoryCards = document.querySelectorAll('.category-card');
    const catalogCategoriesGrid = document.querySelector('.catalog-categories-grid');
    const catalogProductsList = document.getElementById('catalog-products-list');
    const catalogSelectedCategoryName = document.getElementById('catalog-selected-category-name');
    const catalogProductsContainer = document.getElementById('catalog-products-container');
    const btnBackToCategories = document.getElementById('btn-back-to-categories');

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            const categoryName = card.querySelector('span').textContent;
            
            catalogSelectedCategoryName.textContent = categoryName;
            catalogCategoriesGrid.classList.add('hidden');
            catalogProductsList.classList.remove('hidden');

            catalogProductsContainer.innerHTML = '';
            const products = catalogProducts[category] || [];
            products.forEach(prod => {
                const prodDiv = document.createElement('div');
                prodDiv.className = 'product-card-sim';
                prodDiv.innerHTML = `
                    <div class="prod-image"><img src="${prod.img}" alt="${prod.name}" onerror="this.onerror=null; this.src='placeholder_product.png';" loading="lazy"></div>
                    <div class="prod-title">${prod.name}</div>
                    <div class="prod-price">${prod.price}</div>
                    <button class="btn btn-blue-sm btn-buy-product w-full" data-name="${prod.name}" data-price="${prod.price}" data-img="${prod.img}">Comprar</button>
                `;
                catalogProductsContainer.appendChild(prodDiv);
            });

            // Buy button click listeners (Adds to cart and redirects to cart view)
            catalogProductsContainer.querySelectorAll('.btn-buy-product').forEach(buyBtn => {
                buyBtn.addEventListener('click', () => {
                    const prodName = buyBtn.getAttribute('data-name');
                    const prodPrice = buyBtn.getAttribute('data-price');
                    const prodImg = buyBtn.getAttribute('data-img');
                    
                    addToCart(prodName, prodPrice, prodImg);
                    navigatePhoneTo('screen-app-cart');
                    renderCart();
                });
            });
        });
    });

    btnBackToCategories.addEventListener('click', () => {
        catalogCategoriesGrid.classList.remove('hidden');
        catalogProductsList.classList.add('hidden');
    });

    /* ==========================================
       PROMOTIONS ACQUISITION (Redirects to cart)
       ========================================== */
    document.querySelectorAll('.btn-purchase-promo').forEach(btn => {
        btn.addEventListener('click', () => {
            const promoName = btn.getAttribute('data-promo');
            const promoPrice = btn.getAttribute('data-price');
            const promoImg = btn.closest('.promo-card').querySelector('.promo-image-img img').getAttribute('src');
            
            addToCart(promoName, "S/ " + parseFloat(promoPrice).toFixed(2), promoImg);
            navigatePhoneTo('screen-app-cart');
            renderCart();
        });
    });

    /* ==========================================
       TECHNICAL SUPPORT & LIVE CHAT SIMULATOR
       ========================================== */
    const btnWhatsappClick = document.getElementById('btn-whatsapp-click');
    const btnOpenInappChat = document.getElementById('btn-open-inapp-chat');
    const btnBackFromChat = document.getElementById('btn-back-from-chat');
    const btnSendChatMsg = document.getElementById('btn-send-chat-msg');
    const chatUserMessageInput = document.getElementById('chat-user-message-input');
    const chatMessagesContainer = document.getElementById('chat-messages-container');

    btnWhatsappClick.addEventListener('click', () => {
        showToast("🟢 Redirigiendo a WhatsApp (+51 987 654 321)", "green");
    });

    btnOpenInappChat.addEventListener('click', () => {
        navigatePhoneTo('screen-inapp-chat');
    });

    btnBackFromChat.addEventListener('click', () => {
        navigatePhoneTo('screen-app-support');
    });

    const chatBotReplies = [
        "Entiendo tu consulta. Como cliente de SumiTechPoint, tienes soporte técnico priority. ¿Presentas inconvenientes al canjear tus beneficios de Antivirus o MS Office?",
        "Perfecto, un asesor técnico de SumiTechPoint validará tu número registrado para asistirte en la instalación remota. ¿Deseas coordinar una llamada?",
        "Muchas gracias por confirmarlo. Hemos registrado tu ticket en la base de datos de soporte. En breve recibirás un WhatsApp de asistencia. ¡Gracias por usar la app de SumiTechPoint!"
    ];
    let chatStep = 0;

    function sendUserMessage() {
        const text = chatUserMessageInput.value.trim();
        if (!text) return;

        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble sent';
        userBubble.innerHTML = `<p>${text}</p><span class="chat-time">${getCurrentTimeStr()}</span>`;
        chatMessagesContainer.appendChild(userBubble);

        chatUserMessageInput.value = '';
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        metrics.chats += 1;
        updateAdminMetrics();

        setTimeout(() => {
            const botBubble = document.createElement('div');
            botBubble.className = 'chat-bubble received';
            const botReply = chatBotReplies[chatStep] || "Disculpa, ¿podrías brindarnos más detalles sobre el producto SumiTechPoint que adquiriste?";
            chatStep++;

            botBubble.innerHTML = `<p>${botReply}</p><span class="chat-time">${getCurrentTimeStr()}</span>`;
            chatMessagesContainer.appendChild(botBubble);
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }, 1000);
    }

    btnSendChatMsg.addEventListener('click', sendUserMessage);
    chatUserMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendUserMessage();
    });

    /* ==========================================
       REFERRAL PROGRAM & SIMULATION
       ========================================== */
    const btnShareReferral = document.getElementById('btn-share-referral');
    const btnTriggerSimReferral = document.getElementById('btn-trigger-sim-referral');
    const refFriendsUl = document.getElementById('ref-friends-ul');
    const txtRefCount = document.getElementById('txt-ref-count');

    btnShareReferral.addEventListener('click', () => {
        const refCode = document.getElementById('txt-referral-code').textContent;
        navigator.clipboard.writeText(`https://sumitechpoint.com/app?ref=${refCode}`)
            .then(() => {
                showToast("🔗 Enlace de referido copiado al portapapeles.", "cyan");
            })
            .catch(() => {
                showToast("🔗 Enlace generado: sumitechpoint.com/app?ref=" + refCode, "cyan");
            });
    });

    btnTriggerSimReferral.addEventListener('click', () => {
        if (!currentUser) {
            showToast("⚠️ Debes registrarte tú primero para poder simular referidos.", "purple");
            return;
        }

        if (simulatedReferralsCount >= simulatedFriendsNames.length) {
            showToast("✅ Ya has simulado el registro de todos tus amigos disponibles.", "cyan");
            return;
        }

        const friendName = simulatedFriendsNames[simulatedReferralsCount];
        simulatedReferralsCount++;

        if (simulatedReferralsCount === 1) {
            refFriendsUl.innerHTML = '';
        }

        const friendLi = document.createElement('li');
        friendLi.innerHTML = `
            <span>${friendName}</span>
            <span class="badge badge-green">Registrado</span>
        `;
        refFriendsUl.appendChild(friendLi);
        txtRefCount.textContent = simulatedReferralsCount;

        const friendId = `#STP-${Math.floor(Math.random() * 9000) + 1000}`;
        const friendEmail = friendName.toLowerCase().replace(/ /g, '.') + "@email.com";
        const friendPhone = "9" + Math.floor(10000000 + Math.random() * 90000000);

        const friendRow = document.createElement('tr');
        friendRow.innerHTML = `
            <td><strong>${friendId}</strong></td>
            <td>${friendName}</td>
            <td>${friendEmail}</td>
            <td>${friendPhone}</td>
            <td><span class="badge badge-purple">Ref. por ${currentUser.name.split(' ')[0]}</span></td>
            <td><span class="badge badge-green">Antivirus</span></td>
            <td>${getFormattedDate()}</td>
        `;
        if (tableBody) {
            tableBody.insertBefore(friendRow, tableBody.firstChild);
        }

        friendRow.style.background = 'rgba(138, 43, 226, 0.1)';
        setTimeout(() => {
            friendRow.style.background = 'transparent';
        }, 3000);

        metrics.referrals += 1;
        metrics.registered += 1;
        metrics.downloads += 1;
        updateAdminMetrics();

        showToast(`👥 Tu amigo ${friendName.split(' ')[0]} se registró usando tu código.`, "purple");
    });

    // App Navigation router trigger buttons inside Dashboard Screen
    document.getElementById('menu-btn-benefits').addEventListener('click', () => navigatePhoneTo('screen-app-benefits'));
    document.getElementById('menu-btn-catalog').addEventListener('click', () => navigatePhoneTo('screen-app-catalog'));
    document.getElementById('menu-btn-support').addEventListener('click', () => navigatePhoneTo('screen-app-support'));
    document.getElementById('menu-btn-promos').addEventListener('click', () => navigatePhoneTo('screen-app-promos'));
    document.getElementById('menu-btn-referral').addEventListener('click', () => navigatePhoneTo('screen-app-referrals'));

    /* ==========================================
       UTILITIES & HELPERS
       ========================================== */
    function updateAdminMetrics() {
        // Safe updates for top-level admin KPIs if they exist
        const kpiDownloads = document.getElementById('kpi-downloads');
        const kpiRegistered = document.getElementById('kpi-registered');
        const kpiClaimed = document.getElementById('kpi-claimed');
        const kpiChats = document.getElementById('kpi-chats');
        const kpiPurchases = document.getElementById('kpi-purchases');
        const kpiReferrals = document.getElementById('kpi-referrals');

        if (kpiDownloads) kpiDownloads.textContent = formatNum(metrics.downloads);
        if (kpiRegistered) kpiRegistered.textContent = formatNum(metrics.registered);
        if (kpiClaimed) kpiClaimed.textContent = formatNum(metrics.claimed);
        if (kpiChats) kpiChats.textContent = formatNum(metrics.chats);
        if (kpiPurchases) kpiPurchases.textContent = formatNum(metrics.purchases);
        if (kpiReferrals) kpiReferrals.textContent = formatNum(metrics.referrals);

        // Safe updates for projected simulation metrics if they exist in the dashboard
        const simMetricRegistered = document.getElementById('sim-metric-registered');
        const simMetricPurchases = document.getElementById('sim-metric-purchases');
        const simMetricReferrals = document.getElementById('sim-metric-referrals');
        const simMetricRevenue = document.getElementById('sim-metric-revenue');

        if (simMetricRegistered) simMetricRegistered.textContent = formatNum(metrics.registered);
        if (simMetricPurchases) simMetricPurchases.textContent = formatNum(metrics.purchases);
        if (simMetricReferrals) simMetricReferrals.textContent = formatNum(metrics.referrals);
        
        if (simMetricRevenue) {
            const simTicket = document.getElementById('sim-ticket');
            const ticketVal = simTicket ? parseFloat(simTicket.value) : 120;
            const revenue = metrics.purchases * ticketVal;
            simMetricRevenue.textContent = `S/ ${formatNum(revenue.toFixed(2))}`;
        }
    }

    function formatNum(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function getFormattedDate() {
        const date = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function getCurrentTimeStr() {
        const date = new Date();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
    }

    function updateClock() {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const clockEl = document.getElementById('phone-clock');
        if (clockEl) clockEl.textContent = `${hours}:${minutes}`;
    }
    updateClock();
    setInterval(updateClock, 30000);

    // Floating Toasts
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, color = "cyan") {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.borderLeftColor = `var(--${color})`;
        
        let icon = '<i class="fa-solid fa-bell"></i>';
        if (color === "green") icon = '<i class="fa-solid fa-circle-check text-green"></i>';
        if (color === "red") icon = '<i class="fa-solid fa-triangle-exclamation text-red"></i>';
        if (color === "purple") icon = '<i class="fa-solid fa-users text-purple"></i>';
        
        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    if (!document.getElementById('style-toast-keyframes')) {
        const style = document.createElement('style');
        style.id = 'style-toast-keyframes';
        style.innerHTML = `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(120%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    /* ==========================================
       SUMINISTROS SLIDESHOW LOGIC
       ========================================== */
    const suministrosSlides = document.querySelectorAll('#suministros-track .slideshow-slide');
    const suministrosDots = document.querySelectorAll('#suministros-dots .slideshow-dot');
    const suministrosThumbs = document.querySelectorAll('#suministros-thumbs .slideshow-thumb');
    const suministrosPrev = document.getElementById('suministros-prev');
    const suministrosNext = document.getElementById('suministros-next');
    const suministrosCurrent = document.getElementById('suministros-current');
    let currentSlide = 0;
    const totalSlides = suministrosSlides.length;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        suministrosSlides.forEach(s => s.classList.remove('active'));
        suministrosDots.forEach(d => d.classList.remove('active'));
        suministrosThumbs.forEach(t => t.classList.remove('active'));

        suministrosSlides[index].classList.add('active');
        suministrosDots[index].classList.add('active');
        suministrosThumbs[index].classList.add('active');

        if (suministrosCurrent) {
            suministrosCurrent.textContent = index + 1;
        }

        // Scroll active thumbnail into view
        suministrosThumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        currentSlide = index;
    }

    if (suministrosPrev) {
        suministrosPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    }
    if (suministrosNext) {
        suministrosNext.addEventListener('click', () => goToSlide(currentSlide + 1));
    }

    suministrosDots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.getAttribute('data-dot')));
        });
    });

    suministrosThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            goToSlide(parseInt(thumb.getAttribute('data-thumb')));
        });
    });

    // Fullscreen Overlay Elements
    const fsOverlay = document.getElementById('fullscreen-overlay');
    const fsImage = document.getElementById('fs-image');
    const fsClose = document.getElementById('fs-close');
    const fsPrev = document.getElementById('fs-prev');
    const fsNext = document.getElementById('fs-next');
    const fsCurrent = document.getElementById('fs-current');
    const fsTotal = document.getElementById('fs-total');
    const fsBtn = document.getElementById('suministros-fullscreen');

    if (fsTotal && totalSlides) {
        fsTotal.textContent = totalSlides;
    }

    function openFullscreen() {
        if (!fsOverlay || !fsImage) return;
        updateFullscreenImage();
        fsOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Lock scroll while presenting
    }

    function closeFullscreen() {
        if (!fsOverlay) return;
        fsOverlay.classList.add('hidden');
        document.body.style.overflow = ''; // Restore page scroll
    }

    function updateFullscreenImage() {
        if (!fsImage) return;
        const currentActiveSlideImg = suministrosSlides[currentSlide].querySelector('img');
        if (currentActiveSlideImg) {
            fsImage.src = currentActiveSlideImg.src;
            fsImage.alt = currentActiveSlideImg.alt;
        }
        if (fsCurrent) {
            fsCurrent.textContent = currentSlide + 1;
        }
    }

    function navigateFullscreen(direction) {
        goToSlide(currentSlide + direction);
        updateFullscreenImage();
    }

    if (fsBtn) {
        fsBtn.addEventListener('click', openFullscreen);
    }
    if (fsClose) {
        fsClose.addEventListener('click', closeFullscreen);
    }
    if (fsPrev) {
        fsPrev.addEventListener('click', () => navigateFullscreen(-1));
    }
    if (fsNext) {
        fsNext.addEventListener('click', () => navigateFullscreen(1));
    }

    // Keyboard navigation for slideshow (main and fullscreen views)
    document.addEventListener('keydown', (e) => {
        const isFsOpen = fsOverlay && !fsOverlay.classList.contains('hidden');
        
        if (isFsOpen) {
            if (e.key === 'Escape') {
                closeFullscreen();
            } else if (e.key === 'ArrowLeft') {
                navigateFullscreen(-1);
            } else if (e.key === 'ArrowRight') {
                navigateFullscreen(1);
            }
        } else {
            const suministrosSec = document.getElementById('suministros-sec');
            if (suministrosSec && suministrosSec.classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    goToSlide(currentSlide - 1);
                } else if (e.key === 'ArrowRight') {
                    goToSlide(currentSlide + 1);
                }
            }
        }
    });

    // Suministros View Toggle Logic (Canva vs Local Gallery)
    const suppliesToggleBtns = document.querySelectorAll('.suministros-toggle-btn');
    const suppliesViewPanes = document.querySelectorAll('.suministros-view-pane');

    suppliesToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            suppliesToggleBtns.forEach(b => b.classList.remove('active'));
            suppliesViewPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetViewId = 'view-' + btn.getAttribute('data-view');
            const targetPane = document.getElementById(targetViewId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

});
