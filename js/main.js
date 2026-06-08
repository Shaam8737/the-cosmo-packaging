/**
 * The Cosmo Packaging - Core Javascript Framework
 * Manages hamburger menu, 3D box transformations, mouse vectors, layout triggers, and GA4.
 */
document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initHeaderScroll();
    init3DParallax();
    initHeroPassiveTilt();
    initDesignShowcase();
    initViewerSizeCards();
    initQuoteSummary();
});

/**
 * Mobile hamburger menu (slide from left)
 */
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const overlay = document.getElementById('mobileOverlay');
    const panel = document.getElementById('mobilePanel');

    if (!hamburger || !overlay || !panel) return;

    function toggleMenu(open) {
        const isOpen = open !== undefined ? open : !panel.classList.contains('active');
        hamburger.classList.toggle('active', isOpen);
        panel.classList.toggle('active', isOpen);
        overlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => toggleMenu());
    overlay.addEventListener('click', () => toggleMenu(false));

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Close on window resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && panel.classList.contains('active')) {
            toggleMenu(false);
        }
    });
}

/**
 * Adds thin shadow / padding compression to header on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/**
 * Handles mouse grab-rotate physics and scroll vectors for 3D boxes
 */
function init3DParallax() {
    const stageContainers = document.querySelectorAll('.perspective-container');
    
    stageContainers.forEach(container => {
        const box = container.querySelector('.box-3d');
        if (!box) return;
        
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let rotation = { x: -20, y: 35 };
        
        container.addEventListener('mousedown', (e) => {
            if (box.classList.contains('flat-layout')) return;
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
            box.style.animation = 'none';
        });
        
        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => {
                    if (!isDragging && !box.classList.contains('flat-layout')) {
                        box.style.animation = '';
                    }
                }, 2000);
            }
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDragging || box.classList.contains('flat-layout')) return;
            
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            
            rotation.y += deltaMove.x * 0.4;
            rotation.x -= deltaMove.y * 0.4;
            rotation.x = Math.max(-60, Math.min(60, rotation.x));
            
            box.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        container.addEventListener('touchstart', (e) => {
            if (box.classList.contains('flat-layout')) return;
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            box.style.animation = 'none';
        });
        
        window.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => {
                    if (!isDragging && !box.classList.contains('flat-layout')) {
                        box.style.animation = '';
                    }
                }, 2000);
            }
        });
        
        container.addEventListener('touchmove', (e) => {
            if (!isDragging || box.classList.contains('flat-layout')) return;
            
            const deltaMove = {
                x: e.touches[0].clientX - previousMousePosition.x,
                y: e.touches[0].clientY - previousMousePosition.y
            };
            
            rotation.y += deltaMove.x * 0.4;
            rotation.x -= deltaMove.y * 0.4;
            rotation.x = Math.max(-60, Math.min(60, rotation.x));
            
            box.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        });
    });
}

/**
 * API to unfold the 3D CSS container flat (for the Dual-Tab viewer dieline)
 */
function toggleBoxFolding(boxId, makeFlat) {
    const box = document.querySelector(boxId);
    if (!box) return;

    const isMailer = box.classList.contains('mailer-3d');
    const defaultTransform = isMailer
        ? 'rotateX(-25deg) rotateY(30deg)'
        : 'rotateX(-20deg) rotateY(35deg)';
    
    if (makeFlat) {
        box.classList.add('flat-layout');
        box.style.animation = 'none';
        box.style.transform = '';
    } else {
        box.classList.remove('flat-layout');
        box.style.animation = '';
        box.style.transform = defaultTransform;
    }
}
window.toggleBoxFolding = toggleBoxFolding;

/**
 * Subtle hero box tilt following cursor (homepage only)
 */
function initHeroPassiveTilt() {
    const container = document.querySelector('.hero-visual .perspective-container');
    const box = document.getElementById('heroBox');
    if (!container || !box) return;

    const base = { x: -20, y: 35 };
    let userDragging = false;

    container.addEventListener('mousedown', () => { userDragging = true; });
    window.addEventListener('mouseup', () => {
        userDragging = false;
        setTimeout(() => {
            if (!userDragging && !box.classList.contains('flat-layout')) {
                box.style.animation = '';
                box.style.transform = '';
            }
        }, 150);
    });

    container.addEventListener('mousemove', (e) => {
        if (userDragging || box.classList.contains('flat-layout')) return;
        const rect = container.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        box.style.animation = 'none';
        box.style.transform = `rotateX(${base.x - py * 10}deg) rotateY(${base.y + px * 14}deg)`;
    });

    container.addEventListener('mouseleave', () => {
        if (userDragging) return;
        box.style.animation = '';
        box.style.transform = '';
    });
}

function initDesignShowcase() {
    const lanes = document.querySelectorAll('.showcase-lane__cards');
    if (!lanes.length) return;

    lanes.forEach(lane => {
        const cards = Array.from(lane.querySelectorAll('.sample-card'));
        if (!cards.length) return;

        const setActive = (activeCard) => {
            cards.forEach(card => {
                card.classList.toggle('is-active', card === activeCard);
                card.classList.toggle('is-muted', card !== activeCard);
            });
        };

        const clearActive = () => {
            cards.forEach(card => card.classList.remove('is-active', 'is-muted'));
        };

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => setActive(card));
            card.addEventListener('focus', () => setActive(card));
        });

        lane.addEventListener('mouseleave', clearActive);
        lane.addEventListener('focusout', (event) => {
            if (!lane.contains(event.relatedTarget)) {
                clearActive();
            }
        });
    });
}

function initViewerSizeCards() {
    const sizes = {
        'stage-ste': ['Width', '45 mm', 'Depth', '32 mm', 'Height', '125 mm'],
        'stage-rte': ['Width', '52 mm', 'Depth', '52 mm', 'Height', '62 mm'],
        'stage-autolock': ['Width', '58 mm', 'Depth', '42 mm', 'Height', '145 mm'],
        'stage-snaplock': ['Width', '70 mm', 'Depth', '45 mm', 'Height', '160 mm'],
        'stage-rett': ['Length', '229 mm', 'Width', '152 mm', 'Height', '64 mm'],
        'stage-dustflap': ['Length', '254 mm', 'Width', '203 mm', 'Height', '76 mm'],
        'stage-kraft': ['Length', '203 mm', 'Width', '152 mm', 'Height', '50 mm'],
        'stage-rigid': ['Length', '305 mm', 'Width', '229 mm', 'Height', '102 mm'],
        'stage-standup': ['Width', '140 mm', 'Height', '220 mm', 'Gusset', '70 mm'],
        'stage-flat': ['Width', '180 mm', 'Height', '120 mm', 'Seal', '3-side'],
        'stage-gusseted': ['Width', '160 mm', 'Height', '240 mm', 'Gusset', '80 mm'],
        'stage-cr': ['Width', '120 mm', 'Height', '190 mm', 'Gusset', '60 mm'],
    };

    Object.entries(sizes).forEach(([stageId, values]) => {
        const stage = document.getElementById(stageId);
        if (!stage || stage.nextElementSibling?.classList.contains('viewer-size-card')) return;

        const card = document.createElement('div');
        card.className = 'viewer-size-card';
        const note = document.createElement('span');
        note.className = 'viewer-size-note';
        note.innerHTML = 'Custom reference size<strong>Editable after quote</strong>';
        card.appendChild(note);
        for (let i = 0; i < values.length; i += 2) {
            const item = document.createElement('span');
            item.innerHTML = `${values[i]}<strong>${values[i + 1]}</strong>`;
            card.appendChild(item);
        }
        stage.insertAdjacentElement('afterend', card);
    });
}

function initQuoteSummary() {
    const form = document.getElementById('quoteRequestForm');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const hasLaunchOffer = params.get('offer') === 'launch-discount';
    const banner = document.getElementById('launchOfferBanner');
    if (banner && hasLaunchOffer) {
        banner.hidden = false;
    }

    const fields = {
        packaging: document.getElementById('packagingType'),
        length: document.getElementById('dimLength'),
        width: document.getElementById('dimWidth'),
        height: document.getElementById('dimHeight'),
        unit: document.getElementById('dimUnit'),
        quantity: document.getElementById('quantity'),
        material: document.getElementById('materialPreference'),
        timeline: document.getElementById('timelineTarget')
    };

    const summary = {
        packaging: document.getElementById('summaryPackaging'),
        size: document.getElementById('summarySize'),
        quantity: document.getElementById('summaryQuantity'),
        material: document.getElementById('summaryMaterial'),
        timeline: document.getElementById('summaryTimeline'),
        offer: document.getElementById('summaryOffer')
    };

    const offerInput = document.createElement('input');
    offerInput.type = 'hidden';
    offerInput.id = 'launchOfferCode';
    offerInput.value = hasLaunchOffer ? 'launch-discount' : '';
    form.appendChild(offerInput);

    function selectedText(select) {
        return select && select.selectedIndex > 0
            ? select.options[select.selectedIndex].text.replace(/\s*\([^)]*\)/g, '')
            : '';
    }

    function update() {
        const dims = [fields.length?.value, fields.width?.value, fields.height?.value].filter(Boolean);
        const unit = fields.unit?.value || 'mm';

        if (summary.packaging) summary.packaging.textContent = selectedText(fields.packaging) || 'Select style';
        if (summary.size) summary.size.textContent = dims.length === 3 ? `${dims.join(' x ')} ${unit}` : 'Add dimensions';
        if (summary.quantity) summary.quantity.textContent = fields.quantity?.value ? `${fields.quantity.value} units` : 'Add units';
        if (summary.material) summary.material.textContent = selectedText(fields.material) || 'Select stock';
        if (summary.timeline) summary.timeline.textContent = selectedText(fields.timeline) || 'Select target';
        if (summary.offer) summary.offer.textContent = hasLaunchOffer ? 'Launch discount review' : 'Standard review';
    }

    Object.values(fields).forEach(field => {
        if (!field) return;
        field.addEventListener('input', update);
        field.addEventListener('change', update);
    });

    update();
}

/**
 * Google Analytics 4 initialization
 * Replace G-XXXXXXXXXX with your actual GA4 measurement ID
 */
(function initGA4() {
    const gaId = 'G-XXXXXXXXXX'; // ← Replace with your GA4 ID
    if (!gaId || gaId.includes('XXXXX')) return; // Don't load if placeholder
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaId);
})();