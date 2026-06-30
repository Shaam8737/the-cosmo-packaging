/**
 * The Cosmo Packaging - Shared Site Shell
 * Generates the header (desktop nav + hamburger + mobile panel) dynamically.
 * Add data-page="tuck-end" (etc.) on <body>.
 */
(function () {
    const PRODUCTS = [
        { href: 'tuck-end-boxes.html', label: 'Tuck End Boxes', page: 'tuck-end', group: 'Cartons', desc: 'Retail cartons for cosmetics and small products.' },
        { href: 'mailer-boxes.html', label: 'Mailer Boxes', page: 'mailer', group: 'Ecommerce', desc: 'Ecommerce-ready corrugated mailer structures.' },
        { href: 'mylar-bags.html', label: 'Mylar Bags', page: 'mylar', group: 'Pouches & Kits', desc: 'Flexible barrier pouches for product protection.' },
        { href: 'corrugated-boxes.html', label: 'Corrugated Boxes', page: 'corrugated-boxes', group: 'Ecommerce', desc: 'Durable corrugated packaging for transit and kits.' },
        { href: 'gift-box-packaging.html', label: 'Gift Box Packaging', page: 'gift-box-packaging', group: 'Rigid & Luxury', desc: 'Presentation-led boxes for luxury gifting.' },
        { href: 'cosmetics-packaging.html', label: 'Cosmetics Packaging', page: 'cosmetics-packaging', group: 'Cartons', desc: 'Beauty-ready cartons, inserts, and launch kits.' },
        { href: 'skincare-packaging.html', label: 'Skincare Packaging', page: 'skincare-packaging', group: 'Cartons', desc: 'Skincare cartons, inserts, mailers, and kits.' },
        { href: 'custom-cosmetic-boxes.html', label: 'Custom Cosmetic Boxes', page: 'custom-cosmetic-boxes', group: 'Cartons', desc: 'Custom boxes for cosmetic retail and ecommerce.' },
        { href: 'pr-packaging.html', label: 'PR Packaging', page: 'pr-packaging', group: 'Pouches & Kits', desc: 'Influencer, press, and launch reveal packaging.' },
        { href: 'premium-shipping-boxes.html', label: 'Premium Shipping Boxes', page: 'premium-shipping-boxes', group: 'Ecommerce', desc: 'High-end mailer boxes for branded delivery.' },
        { href: 'mailer-boxes-with-foam-inserts.html', label: 'Mailer Boxes with Foam Inserts', page: 'mailer-boxes-with-foam-inserts', group: 'Rigid & Luxury', desc: 'Mailer protection with fitted foam presentation.' },
        { href: 'rigid-boxes-with-foam-inserts.html', label: 'Rigid Boxes with Foam Inserts', page: 'rigid-boxes-with-foam-inserts', group: 'Rigid & Luxury', desc: 'Rigid boxes with protective foam fitment.' },
        { href: 'rigid-boxes-with-custom-inlays.html', label: 'Rigid Boxes with Custom Inlays', page: 'rigid-boxes-with-custom-inlays', group: 'Rigid & Luxury', desc: 'Premium inlay layouts for multi-piece sets.' },
        { href: 'rigid-boxes-with-custom-inserts.html', label: 'Rigid Boxes with Custom Inserts', page: 'rigid-boxes-with-custom-inserts', group: 'Rigid & Luxury', desc: 'Custom paperboard inserts for product control.' },
        { href: 'magnetic-rigid-boxes-with-foam-inserts.html', label: 'Magnetic Rigid Boxes with Foam Inserts', page: 'magnetic-rigid-boxes-with-foam-inserts', group: 'Rigid & Luxury', desc: 'Magnetic closure boxes with foam protection.' },
        { href: 'magnetic-rigid-boxes-with-custom-inlays.html', label: 'Magnetic Rigid Boxes with Custom Inlays', page: 'magnetic-rigid-boxes-with-custom-inlays', group: 'Rigid & Luxury', desc: 'Magnetic presentation boxes with custom inlays.' },
        { href: 'magnetic-rigid-boxes-with-custom-inserts.html', label: 'Magnetic Rigid Boxes with Custom Inserts', page: 'magnetic-rigid-boxes-with-custom-inserts', group: 'Rigid & Luxury', desc: 'Magnetic boxes with tailored insert systems.' }
    ];

    const PRODUCT_PAGES = PRODUCTS.map(p => p.page).concat('by-style', 'by-product');

    function isProductPage(page) {
        return PRODUCT_PAGES.includes(page);
    }

    function buildDesktopNav(currentPage) {
        const productActive = isProductPage(currentPage);
        let html = `<a href="index.html"${currentPage === 'overview' ? ' class="active"' : ''}>Overview</a>`;

        // Group products by their group name
        const groupedProducts = PRODUCTS.reduce((acc, item) => {
            acc[item.group] = acc[item.group] || [];
            acc[item.group].push(item);
            return acc;
        }, {});

        html += `
            <div class="nav-dropdown nav-dropdown--style${productActive ? ' is-active' : ''}">
                <button type="button" class="nav-dropdown-toggle" aria-haspopup="true" aria-expanded="false">Products</button>
                <div class="nav-dropdown-menu" role="menu">
                    <div class="nav-style-menu">
                        <div class="nav-style-head">
                            <strong>Browse our range</strong>
                            <a href="by-product.html">By Product →</a>
                        </div>
                        <div class="nav-style-list">
                            ${Object.keys(groupedProducts).map(group => `
                                <div>
                                    <span>${group}</span>
                                    ${groupedProducts[group].map(p => {
                                        const cls = currentPage === p.page ? ' class="active"' : '';
                                        return `<a href="${p.href}" role="menuitem"${cls}>${p.label}</a>`;
                                    }).join('')}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>`;

        html += `<a href="by-style.html"${currentPage === 'by-style' ? ' class="active"' : ''}>By Style</a>`;
        html += `<a href="artwork-guide.html"${currentPage === 'artwork' ? ' class="active"' : ''}>Artwork Guide</a>`;
        html += `<a href="quote-request.html" class="btn-luxury nav-cta-get-quote">Get Quote</a>`;

        return html;
    }

    function buildMobilePanel(currentPage) {
        const links = [
            { href: 'index.html', label: 'Overview', page: 'overview' },
            { href: 'by-style.html', label: 'By Style', page: 'by-style' },
            { href: 'by-product.html', label: 'By Product', page: 'by-product' },
            { href: 'tuck-end-boxes.html', label: 'Tuck End Boxes', page: 'tuck-end' },
            { href: 'mailer-boxes.html', label: 'Mailer Boxes', page: 'mailer' },
            { href: 'mylar-bags.html', label: 'Mylar Bags', page: 'mylar' },
            { href: 'rigid-boxes-with-foam-inserts.html', label: 'Rigid Boxes', page: 'rigid-boxes-with-foam-inserts' },
            { href: 'gift-box-packaging.html', label: 'Gift Boxes', page: 'gift-box-packaging' },
            { href: 'pr-packaging.html', label: 'PR Packaging', page: 'pr-packaging' },
            { href: 'sample-kit-checkout.html', label: 'Sample Kit', page: 'sample-kit' },
            { href: 'artwork-guide.html', label: 'Artwork Guide', page: 'artwork' }
        ];

        let html = '';
        links.forEach(item => {
            const cls = currentPage === item.page ? ' class="active"' : '';
            html += `<a href="${item.href}"${cls}>${item.label}</a>`;
        });
        html += `<div class="mobile-nav-cta"><a href="quote-request.html" class="btn-luxury">Get Quote</a></div>`;
        return html;
    }

    function buildHeader(currentPage) {
        return `
            <a href="index.html" class="brand-logo-container">
                <div class="logo-box">TCP</div>
                <span class="brand-name">The Cosmo Packaging</span>
            </a>

            <!-- Hamburger Button (Mobile) -->
            <button class="hamburger-btn" id="hamburgerBtn" aria-label="Toggle navigation menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <!-- Desktop Navigation -->
            <nav class="desktop-nav">
                ${buildDesktopNav(currentPage)}
            </nav>
        `;
    }

    function buildMobileShell(currentPage) {
        return `
            <div class="mobile-nav-overlay" id="mobileOverlay"></div>
            <div class="mobile-nav-panel" id="mobilePanel">
                ${buildMobilePanel(currentPage)}
            </div>
        `;
    }

    function initDropdowns() {
        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav-dropdown-toggle');
            if (!toggle) return;
            let closeTimer;

            const openDropdown = () => {
                clearTimeout(closeTimer);
                dropdown.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            };

            const closeDropdown = () => {
                closeTimer = setTimeout(() => {
                    dropdown.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }, 180);
            };

            dropdown.addEventListener('mouseenter', openDropdown);
            dropdown.addEventListener('mouseleave', closeDropdown);
            dropdown.addEventListener('focusin', openDropdown);
            dropdown.addEventListener('focusout', (event) => {
                if (!dropdown.contains(event.relatedTarget)) {
                    closeDropdown();
                }
            });
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.nav-dropdown.is-open').forEach(dropdown => {
                dropdown.classList.remove('is-open');
                const t = dropdown.querySelector('.nav-dropdown-toggle');
                if (t) t.setAttribute('aria-expanded', 'false');
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const page = document.body.dataset.page;
        const header = document.querySelector('header');
        if (!page || !header) return;

        // Skip if header already has desktop-nav (homepage is hardcoded)
        if (header.querySelector('.desktop-nav')) return;

        header.innerHTML = buildHeader(page);
        initDropdowns();

        // Inject mobile overlay and panel after header
        const shellHTML = buildMobileShell(page);
        const wrapper = document.createElement('div');
        wrapper.innerHTML = shellHTML;

        // Insert both overlay and panel
        const children = wrapper.children;
        for (let i = 0; i < children.length; i++) {
            header.insertAdjacentElement('afterend', children[i]);
        }
    });

    window.SiteShell = { buildNav: buildDesktopNav, PRODUCTS };
})();