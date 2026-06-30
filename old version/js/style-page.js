(function () {
    function listItems(items) {
        return items.map(item => `<li>${item}</li>`).join('');
    }

    const STYLE_PAGE_MAP = {
        'tuck-end-boxes': 'tuck-end-boxes.html',
        'mailer-boxes': 'mailer-boxes.html',
        'mylar-bags': 'mylar-bags.html',
        'corrugated-boxes': 'corrugated-boxes.html',
        'gift-box-packaging': 'gift-box-packaging.html',
        'cosmetics-packaging': 'cosmetics-packaging.html',
        'skincare-packaging': 'skincare-packaging.html',
        'custom-cosmetic-boxes': 'custom-cosmetic-boxes.html',
        'pr-packaging': 'pr-packaging.html',
        'premium-shipping-boxes': 'premium-shipping-boxes.html',
        'mailer-boxes-with-foam-inserts': 'mailer-boxes-with-foam-inserts.html',
        'rigid-boxes-with-foam-inserts': 'rigid-boxes-with-foam-inserts.html',
        'rigid-boxes-with-custom-inlays': 'rigid-boxes-with-custom-inlays.html',
        'rigid-boxes-with-custom-inserts': 'rigid-boxes-with-custom-inserts.html',
        'magnetic-rigid-boxes-with-foam-inserts': 'magnetic-rigid-boxes-with-foam-inserts.html',
        'magnetic-rigid-boxes-with-custom-inlays': 'magnetic-rigid-boxes-with-custom-inlays.html',
        'magnetic-rigid-boxes-with-custom-inserts': 'magnetic-rigid-boxes-with-custom-inserts.html'
    };

    function renderStyleCatalogue(currentSlug) {
        const grid = document.getElementById('relatedStyleGrid');
        if (!grid || !window.CosmoStyleProducts) return;

        grid.innerHTML = Object.entries(STYLE_PAGE_MAP).map(([slug, href]) => {
            const item = window.CosmoStyleProducts[slug];
            if (!item) return '';
            const chips = [...(item.bestFor || []).slice(0, 2), 'MOQ 100'].map(chip => `<span>${chip}</span>`).join('');
            const active = slug === currentSlug ? ' is-current' : '';
            return `
                <a class="related-style-card${active}" href="${href}" style="--style-img: ${item.image};">
                    <div class="related-style-media" role="img" aria-label="${item.title}"></div>
                    <div class="related-style-body">
                        <span>${item.tag}</span>
                        <h3>${item.title}</h3>
                        <p>${item.intro}</p>
                        <div class="style-chip-row">${chips}</div>
                    </div>
                </a>`;
        }).join('');
    }

    function formValue(form, name) {
        const field = form.elements[name];
        return field ? String(field.value || '').trim() : '';
    }

    function isEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function initEmbeddedQuoteForm(slug, data) {
        const form = document.querySelector('[data-product-quote-form]');
        if (!form) return;

        const productName = form.querySelector('[data-product-name]');
        if (productName) productName.value = data.title;

        const status = form.querySelector('[data-product-quote-status]');
        const submit = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fullName = formValue(form, 'fullName');
            const phone = formValue(form, 'phone');
            const email = formValue(form, 'email');

            if (!fullName || !phone || !email) {
                if (status) status.textContent = 'Please add name, phone, and email.';
                return;
            }

            if (!isEmail(email)) {
                if (status) status.textContent = 'Please enter a valid email address.';
                return;
            }

            if (submit) {
                submit.disabled = true;
                submit.textContent = 'Submitting...';
            }
            if (status) status.textContent = 'Saving your quote request...';

            const payload = window.CosmoLeadSchema.normalizeLead({
                source: 'product-page',
                page_url: window.location.href,
                lead_type: 'product_page_quote',
                full_name: fullName,
                phone,
                email,
                product: data.title,
                quantity: formValue(form, 'quantity'),
                dimensions: formValue(form, 'targetSize'),
                artwork_status: formValue(form, 'artworkStatus'),
                message: formValue(form, 'notes'),
                notes: `Product slug: ${slug}; Category: ${data.tag}`
            });

            try {
                const dispatcher = window.CosmoWebhook;
                if (dispatcher && dispatcher.dispatchQuote) {
                    await dispatcher.dispatchQuote(payload);
                } else {
                    const key = 'cosmo_pending_quotes';
                    const existing = JSON.parse(localStorage.getItem(key) || '[]');
                    existing.push({ route: 'quote', ...payload, savedAt: new Date().toISOString() });
                    localStorage.setItem(key, JSON.stringify(existing));
                }

                form.reset();
                if (status) status.textContent = 'Thank you. We saved your request and will follow up.';
            } catch (error) {
                if (status) status.textContent = 'Submission could not reach the automation endpoint, but your request was saved locally for follow-up.';
            } finally {
                if (submit) {
                    submit.disabled = false;
                    submit.textContent = 'Submit Quote';
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const slug = document.body.dataset.styleSlug;
        const data = window.CosmoStyleProducts && window.CosmoStyleProducts[slug];
        if (!slug || !data) return;

        document.title = `${data.title} | The Cosmo Packaging`;

        const hero = document.getElementById('styleHero');
        if (hero) hero.style.setProperty('--style-img', data.image);

        const photo = document.getElementById('stylePhoto');
        if (photo) photo.style.setProperty('--style-img', data.image);
        const quotePhoto = document.getElementById('styleQuotePhoto');
        if (quotePhoto) quotePhoto.style.setProperty('--style-img', data.image);

        const tag = document.getElementById('styleTag');
        const title = document.getElementById('styleTitle');
        const intro = document.getElementById('styleIntro');
        const crumb = document.getElementById('styleCrumb');
        const caption = document.getElementById('styleCaption');
        const overviewTitle = document.getElementById('styleOverviewTitle');
        if (tag) tag.textContent = data.tag;
        if (title) title.textContent = data.title;
        if (intro) intro.textContent = data.intro;
        if (crumb) crumb.textContent = data.title;
        if (caption) caption.textContent = `${data.title} dieline mockup`;
        if (overviewTitle) overviewTitle.textContent = `${data.title} structure overview.`;

        const quoteLinks = document.querySelectorAll('[data-style-quote]');
        quoteLinks.forEach(link => {
            link.href = `quote-request.html?product=${slug}`;
        });

        const bestFor = document.getElementById('styleBestFor');
        const specs = document.getElementById('styleSpecs');
        const finishes = document.getElementById('styleFinishes');
        if (bestFor) bestFor.innerHTML = listItems(data.bestFor);
        if (specs) specs.innerHTML = listItems(data.specs);
        if (finishes) finishes.innerHTML = listItems(data.finishes);

        const summary = document.getElementById('styleSummary');
        if (summary) {
            summary.textContent = `${data.title} projects start with size, product fit, artwork direction, material choice, sample approval, and final production quote.`;
        }

        renderStyleCatalogue(slug);
        initEmbeddedQuoteForm(slug, data);
    });
})();

