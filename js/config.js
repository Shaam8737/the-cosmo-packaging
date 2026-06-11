/**
 * The Cosmo Packaging - B2B Configuration Engine
 * Centralizes endpoint settings, webhooks, and operation modes.
 */
const CosmoConfig = {
    // Current free automation backend: Google Apps Script Web App. Replace only with your deployed Web App URL.
    provider: 'google_apps_script',
    appsScriptWebhookUrl: 'https://script.google.com/macros/s/AKfycbwKXQPvq4sOApNcqp5m1iQ8HbgaYVzcUPCMmR4rMr6hoKb26oksJ3EkBnYvcT8mw6O1PQ/exec',

    // Future/manual payment configuration. Keep disabled until Stripe Payment Links are approved and tested.
    stripe: {
        publishableKey: 'STRIPE_PUBLISHABLE_KEY_HERE',
        priceId: 'STRIPE_PRICE_ID_HERE',
        amount: 35,
        enabled: false
    },

    // Optional/future n8n instance webhook target.
    // Replace placeholders only after domain, n8n, credentials, and test workflow are ready.
    n8nWebhookUrl: 'N8N_WEBHOOK_URL_HERE',
    n8nWebhookRoutes: {
        quote: 'N8N_QUOTE_WEBHOOK_URL_HERE',
        sampleKit: 'N8N_SAMPLE_KIT_WEBHOOK_URL_HERE',
        quickQuote: 'N8N_QUICK_QUOTE_WEBHOOK_URL_HERE',
        contact: 'N8N_CONTACT_WEBHOOK_URL_HERE'
    },

    // Enabled for testing with Google Apps Script. Keep URL as a placeholder until your tested Web App URL is pasted.
    webhookEnabled: true,

    // Sourcing SLA quotes duration in calendar hours
    slaHours: 24,

    // 'testing'     = POST to the selected provider when configured, else local backup
    // 'development' = simulate dispatch (no network call)
    // 'production'  = future live mode after domain/deployment approval
    mode: 'testing',

    webhookTimeoutMs: 10000,
    fallbackStorageKey: 'cosmo_pending_quotes',
    crmOwner: 'Ahtesham',
    defaultLeadStatus: 'New',
    defaultPaymentStatus: 'Pending',
    notifyEmail: 'quotes@thecosmopackaging.com',
    emailRouting: {
        info: 'info@thecosmopackaging.com',
        sales: 'sales@thecosmopackaging.com',
        quotes: 'quotes@thecosmopackaging.com',
        support: 'support@thecosmopackaging.com',
        samples: 'samples@thecosmopackaging.com',
        admin: 'admin@thecosmopackaging.com'
    },

    catalog: {
        tuckEnd: ['Straight Tuck End (STE)', 'Reverse Tuck End (RTE)', 'Auto-Lock Bottom', 'Snap-Lock Boxes'],
        mailer: ['Standard RETT Mailer', 'Mailers with Dust Flaps', 'Eco-Friendly Kraft Mailer', 'Premium Rigid Mailers'],
        mylar: ['Stand Up Pouches', 'Flat Pouches', 'Gusseted Pouches', 'Child-Resistant Pouches']
    },

    productSlugMap: {
        'tuck-end-ste': 'Straight Tuck End (STE)',
        'tuck-end-rte': 'Reverse Tuck End (RTE)',
        'tuck-end-autolock': 'Auto-Lock Bottom',
        'tuck-end-snaplock': 'Snap-Lock Boxes',
        'mailer-rett': 'Standard RETT Mailer',
        'mailer-dustflap': 'Mailers with Dust Flaps',
        'mailer-kraft': 'Eco-Friendly Kraft Mailer',
        'mailer-rigid': 'Premium Rigid Mailers',
        'mylar-standup': 'Stand Up Pouches',
        'mylar-flat': 'Flat Pouches',
        'mylar-gusseted': 'Gusseted Pouches',
        'mylar-cr': 'Child-Resistant Pouches',
        'corrugated-boxes': 'Corrugated Boxes',
        'gift-box-packaging': 'Gift Box Packaging',
        'cosmetics-packaging': 'Cosmetics Packaging',
        'skincare-packaging': 'Skincare Packaging',
        'custom-cosmetic-boxes': 'Custom Cosmetic Boxes',
        'pr-packaging': 'PR Packaging',
        'premium-shipping-boxes': 'Premium Shipping Boxes',
        'mailer-boxes-with-foam-inserts': 'Mailer Boxes with Foam Inserts',
        'rigid-boxes-with-foam-inserts': 'Rigid Boxes with Foam Inserts',
        'rigid-boxes-with-custom-inlays': 'Rigid Boxes with Custom Inlays',
        'rigid-boxes-with-custom-inserts': 'Rigid Boxes with Custom Inserts',
        'magnetic-rigid-boxes-with-foam-inserts': 'Magnetic Rigid Boxes with Foam Inserts',
        'magnetic-rigid-boxes-with-custom-inlays': 'Magnetic Rigid Boxes with Custom Inlays',
        'magnetic-rigid-boxes-with-custom-inserts': 'Magnetic Rigid Boxes with Custom Inserts'
    },

    moqByProduct: {
        'Straight Tuck End (STE)': 100,
        'Reverse Tuck End (RTE)': 100,
        'Auto-Lock Bottom': 100,
        'Snap-Lock Boxes': 100,
        'Standard RETT Mailer': 100,
        'Mailers with Dust Flaps': 100,
        'Eco-Friendly Kraft Mailer': 100,
        'Premium Rigid Mailers': 100,
        'Stand Up Pouches': 100,
        'Flat Pouches': 100,
        'Gusseted Pouches': 100,
        'Child-Resistant Pouches': 100,
        'Corrugated Boxes': 100,
        'Gift Box Packaging': 100,
        'Cosmetics Packaging': 100,
        'Skincare Packaging': 100,
        'Custom Cosmetic Boxes': 100,
        'PR Packaging': 100,
        'Premium Shipping Boxes': 100,
        'Mailer Boxes with Foam Inserts': 100,
        'Rigid Boxes with Foam Inserts': 100,
        'Rigid Boxes with Custom Inlays': 100,
        'Rigid Boxes with Custom Inserts': 100,
        'Magnetic Rigid Boxes with Foam Inserts': 100,
        'Magnetic Rigid Boxes with Custom Inlays': 100,
        'Magnetic Rigid Boxes with Custom Inserts': 100
    },

    defaultMoq: 100,

    materialByCategory: {
        box: [
            'Soft-Touch Matte Paper (18pt)',
            'Eco-Friendly Kraft (Natural Brown)',
            'Bleached Board (Premium White)',
            'Premium Rigid Board (Greyboard laminate)',
            'Metallized Foil Board (Silver/Gold)',
            'Heavyweight Art Paper (24pt)'
        ],
        mylar: [
            'Matte PET/PE Laminate (Standard barrier)',
            'Metallized PET (Silver/Gold high-barrier)',
            'Clear PET Window + Matte Back Panel',
            'Kraft-Look Paper Laminate (Eco aesthetic)',
            'Child-Resistant Certified Laminate (CR)',
            'Recyclable Mono-Material PE (where available)'
        ]
    },

    dielineTemplates: [
        { label: 'Straight Tuck End (STE)', slug: 'tuck-end-ste' },
        { label: 'Reverse Tuck End (RTE)', slug: 'tuck-end-rte' },
        { label: 'Auto-Lock Bottom', slug: 'tuck-end-autolock' },
        { label: 'Snap-Lock Boxes', slug: 'tuck-end-snaplock' },
        { label: 'Standard RETT Mailer', slug: 'mailer-rett' },
        { label: 'Mailers with Dust Flaps', slug: 'mailer-dustflap' },
        { label: 'Eco-Friendly Kraft Mailer', slug: 'mailer-kraft' },
        { label: 'Premium Rigid Mailers', slug: 'mailer-rigid' },
        { label: 'Stand Up Pouches', slug: 'mylar-standup' },
        { label: 'Flat Pouches', slug: 'mylar-flat' },
        { label: 'Gusseted Pouches', slug: 'mylar-gusseted' },
        { label: 'Child-Resistant Pouches', slug: 'mylar-cr' }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosmoConfig;
} else {
    window.CosmoConfig = CosmoConfig;
}



