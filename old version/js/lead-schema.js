/**
 * The Cosmo Packaging - CRM Lead Schema
 * Keeps every website form aligned with the Google Apps Script CRM columns.
 */
(function () {
    const personalEmailDomains = new Set([
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'live.com',
        'icloud.com',
        'aol.com',
        'proton.me',
        'protonmail.com'
    ]);

    function clean(value) {
        return value == null ? '' : String(value).trim();
    }

    function makeLeadId() {
        const random = Math.random().toString(36).slice(2, 8).toUpperCase();
        return `TCP-${Date.now()}-${random}`;
    }

    function nextBusinessDay(date = new Date()) {
        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        while (next.getDay() === 0 || next.getDay() === 6) {
            next.setDate(next.getDate() + 1);
        }
        return next.toISOString().slice(0, 10);
    }

    function isBusinessEmail(email) {
        const domain = clean(email).toLowerCase().split('@')[1] || '';
        return domain.includes('.') && !personalEmailDomains.has(domain);
    }

    function calculateLeadScore(input = {}) {
        let score = 0;
        const quantity = parseInt(input.quantity, 10);
        const timeline = clean(input.timeline).toLowerCase();

        if (!Number.isNaN(quantity) && quantity >= 1000) score += 30;
        if (isBusinessEmail(input.email)) score += 20;
        if (clean(input.product)) score += 20;
        if (timeline.includes('urgent') || timeline.includes('standard') || timeline.includes('soon')) score += 15;
        if (clean(input.phone)) score += 15;

        return Math.min(score, 100);
    }

    function normalizeLead(input = {}) {
        const now = new Date();
        const dimensions = typeof input.dimensions === 'object' && input.dimensions !== null
            ? [input.dimensions.length, input.dimensions.width, input.dimensions.height].filter(Boolean).join(' x ') + (input.dimensions.unit ? ` ${input.dimensions.unit}` : '')
            : clean(input.dimensions);

        const lead = {
            lead_id: clean(input.lead_id) || makeLeadId(),
            timestamp: clean(input.timestamp) || now.toISOString(),
            source: clean(input.source) || 'website',
            page_url: clean(input.page_url) || (window.location ? window.location.href : ''),
            lead_type: clean(input.lead_type) || 'website_lead',
            status: clean(input.status) || 'New',
            full_name: clean(input.full_name),
            company: clean(input.company),
            email: clean(input.email),
            phone: clean(input.phone),
            product: clean(input.product),
            quantity: clean(input.quantity),
            material: clean(input.material),
            dimensions: clean(dimensions),
            city: clean(input.city),
            country: clean(input.country),
            timeline: clean(input.timeline),
            artwork_status: clean(input.artwork_status),
            message: clean(input.message),
            owner: clean(input.owner) || 'Ahtesham',
            payment_status: clean(input.payment_status) || 'Pending',
            notes: clean(input.notes)
        };

        return lead;
    }

    window.CosmoLeadSchema = {
        normalizeLead,
        calculateLeadScore,
        nextBusinessDay
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.CosmoLeadSchema;
    }
})();




