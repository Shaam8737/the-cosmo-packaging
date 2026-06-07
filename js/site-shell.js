/**
 * Shared site navigation: products dropdown, active states, Get Quote CTA.
 * Add data-page="tuck-end" (etc.) on <body>.
 */
(function () {
    const PRODUCTS = [
        { href: 'tuck-end-boxes.html', label: 'Tuck End Boxes', page: 'tuck-end', group: 'Core styles', desc: 'Retail cartons for cosmetics and small products.' },
        { href: 'mailer-boxes.html', label: 'Mailer Boxes', page: 'mailer', group: 'Core styles', desc: 'Ecommerce-ready corrugated mailer structures.' },
        { href: 'mylar-bags.html', label: 'Mylar Bags', page: 'mylar', group: 'Core styles', desc: 'Flexible barrier pouches for product protection.' },
        { href: 'corrugated-boxes.html', label: 'Corrugated Boxes', page: 'corrugated-boxes', group: 'Shipping & retail', desc: 'Durable corrugated packaging for transit and kits.' },
        { href: 'gift-box-packaging.html', label: 'Gift Box Packaging', page: 'gift-box-packaging', group: 'Premium rigid', desc: 'Presentation-led boxes for luxury gifting.' },
        { href: 'cosmetics-packaging.html', label: 'Cosmetics Packaging', page: 'cosmetics-packaging', group: 'Beauty packaging', desc: 'Beauty-ready cartons, inserts, and launch kits.' },
        { href: 'skincare-packaging.html', label: 'Skincare Packaging', page: 'skincare-packaging', group: 'Beauty packaging', desc: 'Skincare cartons, inserts, mailers, and kits.' },
        { href: 'custom-cosmetic-boxes.html', label: 'Custom Cosmetic Boxes', page: 'custom-cosmetic-boxes', group: 'Beauty packaging', desc: 'Custom boxes for cosmetic retail and ecommerce.' },
        { href: 'pr-packaging.html', label: 'PR Packaging', page: 'pr-packaging', group: 'Beauty packaging', desc: 'Influencer, press, and launch reveal packaging.' },
        { href: 'premium-shipping-boxes.html', label: 'Premium Shipping Boxes', page: 'premium-shipping-boxes', group: 'Shipping & retail', desc: 'High-end mailer boxes for branded delivery.' },
        { href: 'mailer-boxes-with-foam-inserts.html', label: 'Mailer Boxes with Foam Inserts', page: 'mailer-boxes-with-foam-inserts', group: 'Insert systems', desc: 'Mailer protection with fitted foam presentation.' },
        { href: 'rigid-boxes-with-foam-inserts.html', label: 'Rigid Boxes with Foam Inserts', page: 'rigid-boxes-with-foam-inserts', group: 'Insert systems', desc: 'Rigid boxes with protective foam fitment.' },
        { href: 'rigid-boxes-with-custom-inlays.html', label: 'Rigid Boxes with Custom Inlays', page: 'rigid-boxes-with-custom-inlays', group: 'Insert systems', desc: 'Premium inlay layouts for multi-piece sets.' },
        { href: 'rigid-boxes-with-custom-inserts.html', label: 'Rigid Boxes with Custom Inserts', page: 'rigid-boxes-with-custom-inserts', group: 'Insert systems', desc: 'Custom paperboard inserts for product control.' },
        { href: 'magnetic-rigid-boxes-with-foam-inserts.html', label: 'Magnetic Rigid Boxes with Foam Inserts', page: 'magnetic-rigid-boxes-with-foam-inserts', group: 'Magnetic rigid', desc: 'Magnetic closure boxes with foam protection.' },
        { href: 'magnetic-rigid-boxes-with-custom-inlays.html', label: 'Magnetic Rigid Boxes with Custom Inlays', page: 'magnetic-rigid-boxes-with-custom-inlays', group: 'Magnetic rigid', desc: 'Magnetic presentation boxes with custom inlays.' },
        { href: 'magnetic-rigid-boxes-with-custom-inserts.html', label: 'Magnetic Rigid Boxes with Custom Inserts', page: 'magnetic-rigid-boxes-with-custom-inserts', group: 'Magnetic rigid', desc: 'Magnetic boxes with tailored insert systems.' }
    ];

    const NAV_LINKS = [
        { href: 'by-product.html', label: 'By Product', page: 'by-product' },
        { href: 'services.html', label: 'Services', page: 'services' },
        { href: 'artwork-guide.html', label: 'Artwork Guide', page: 'artwork' },
        { href: 'sample-kit-checkout.html', label: 'Samples', page: 'sample-kit' },
        { href: 'help.html', label: 'Help', page: 'help' }
    ];

    const PRODUCT_PAGES = PRODUCTS.map(p => p.page).concat('by-style');

    function isProductPage(page) {
        return PRODUCT_PAGES.includes(page);
    }

    function buildNav(currentPage) {
        const productActive = isProductPage(currentPage);
        let html = `<a href="index.html"${currentPage === 'overview' ? ' class="active"' : ''}>Overview</a>`;

        const groupedProducts = PRODUCTS.reduce((acc, item) => {
            acc[item.group] = acc[item.group] || [];
            acc[item.group].push(item);
            return acc;
        }, {});

        html += `
            <div class="nav-dropdown nav-dropdown--style${productActive ? ' is-active' : ''}">
                <button type="button" class="nav-dropdown-toggle" aria-haspopup="true" aria-expanded="false">By Style</button>
                <div class="nav-dropdown-menu nav-style-menu" role="menu">
                    <div class="nav-style-head">
                        <strong>By Style</strong>
                        <a href="by-style.html">View all styles</a>
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
            </div>`;

        NAV_LINKS.forEach(item => {
            if (item.page === 'contact' && currentPage === 'legal') return;
            const cls = currentPage === item.page ? ' class="active"' : '';
            html += `<a href="${item.href}"${cls}>${item.label}</a>`;
        });

        if (currentPage === 'legal') {
            html += `<a href="contact.html">Contact</a>`;
        }

        html += `<a href="quote-request.html" class="btn-luxury nav-cta-get-quote">Get Quote</a>`;
        return html;
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
        const nav = document.querySelector('header nav');
        if (page && nav) {
            nav.innerHTML = buildNav(page);
            initDropdowns();
        }
    });

    window.SiteShell = { buildNav, PRODUCTS, NAV_LINKS };
})();
