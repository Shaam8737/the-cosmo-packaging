/**
 * Simple quote guidance form on the artwork guide.
 * Routes to n8n when live and saves locally as a fail-safe backup.
 */
async function handleQuickQuote(event) {
    event.preventDefault();

    const name = document.getElementById('quickName').value.trim();
    const email = document.getElementById('quickEmail').value.trim();
    const phone = document.getElementById('quickPhone').value.trim();
    const message = document.getElementById('quickMessage').value.trim();
    const artworkStatus = document.getElementById('quickArtworkStatus') ? document.getElementById('quickArtworkStatus').value : '';
    const submit = event.target.querySelector('button[type="submit"]');

    if (!name || !email || !phone) {
        showQuickQuoteAlert('Please enter your name, email, and phone number.');
        return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
        showQuickQuoteAlert('Please enter a valid email address.');
        return;
    }

    if (submit) {
        submit.disabled = true;
        submit.textContent = 'Submitting...';
    }

    const payload = window.CosmoLeadSchema.normalizeLead({
        source: 'artwork-guide-quick-quote',
        page_url: window.location.href,
        lead_type: 'quick_quote',
        full_name: name,
        email,
        phone,
        artwork_status: artworkStatus,
        message: message || 'Client needs help choosing packaging - requested guidance via artwork guide.',
        notes: 'Quick quote from artwork guide'
    });

    try {
        if (window.CosmoWebhook) {
            await window.CosmoWebhook.dispatchLead('quickQuote', payload);
        } else {
            const key = (window.CosmoConfig && window.CosmoConfig.fallbackStorageKey) || 'cosmo_pending_quotes';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push({ route: 'quickQuote', ...payload, savedAt: new Date().toISOString() });
            localStorage.setItem(key, JSON.stringify(existing));
        }

        document.getElementById('quickQuoteForm').style.display = 'none';
        document.getElementById('quickQuoteSuccess').style.display = 'block';
        document.getElementById('quickQuoteSuccessEmail').textContent = email;
    } catch (error) {
        showQuickQuoteAlert('Submission could not reach automation. Please try again; local backup will be used if the endpoint is unavailable.');
    } finally {
        if (submit) {
            submit.disabled = false;
            submit.textContent = 'Get Quote';
        }
    }
}

function showQuickQuoteAlert(text) {
    const el = document.getElementById('quickQuoteAlert');
    if (!el) return;
    el.textContent = text;
    el.style.display = 'block';
}

