/**
 * Cosmo Packaging lead dispatch engine.
 * Current active provider: Google Apps Script Web App.
 * n8n remains available as an optional future provider.
 * Failed network submissions are saved locally as a fail-safe backup.
 */
const CosmoWebhook = {
    getConfig() {
        return window.CosmoConfig || {};
    },

    getProvider() {
        return this.getConfig().provider || 'google_apps_script';
    },

    isPlaceholderUrl(url = '') {
        return !url
            || url.includes('_HERE')
            || url.includes('PASTE_MY_')
            || url.includes('N8N_')
            || url.includes('WEBHOOK_URL_HERE');
    },

    shouldUseLiveWebhook() {
        const cfg = this.getConfig();
        if (cfg.webhookEnabled !== true) return false;
        if (!['testing', 'production'].includes(cfg.mode)) return false;
        return !this.isPlaceholderUrl(this.getRouteUrl('quote'));
    },

    getRouteUrl(route = 'quote') {
        const cfg = this.getConfig();
        if (this.getProvider() === 'google_apps_script') {
            return cfg.appsScriptWebhookUrl || '';
        }
        return (cfg.n8nWebhookRoutes && cfg.n8nWebhookRoutes[route]) || cfg.n8nWebhookUrl || '';
    },

    normalizePayload(payload, route = 'quote') {
        if (window.CosmoLeadSchema && window.CosmoLeadSchema.normalizeLead) {
            return window.CosmoLeadSchema.normalizeLead({
                source: route,
                ...payload
            });
        }
        return payload;
    },

    saveLocalBackup(payload, route = 'quote') {
        const cfg = this.getConfig();
        const key = cfg.fallbackStorageKey || 'cosmo_pending_quotes';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const normalized = this.normalizePayload(payload, route);
        existing.push({ route, ...normalized, savedAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(existing));
        return existing.length;
    },

    async postToWebhook(route, payload) {
        const cfg = this.getConfig();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), cfg.webhookTimeoutMs || 10000);

        try {
            const res = await fetch(this.getRouteUrl(route), {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            if (!res.ok) {
                throw new Error(`Gateway returned HTTP ${res.status}`);
            }
            return await res.json().catch(() => ({ status: 'success', clearance: 'completed' }));
        } finally {
            clearTimeout(timeout);
        }
    },

    simulateDispatch(route, payload, onLog) {
        return new Promise((resolve) => {
            onLog('[SYS] SIMULATING DISPATCH IN DEVELOPMENT MODE...');
            setTimeout(() => {
                const count = this.saveLocalBackup(payload, route);
                onLog('[SYS] SUCCESSFUL GATEWAY CLEARANCE (Simulated)');
                onLog(`[SYS] Lead archived locally (${count} pending)`);
                resolve({ status: 'simulated', localBackup: true });
            }, 700);
        });
    },

    async dispatchLead(route, payload, onLog = () => {}) {
        const normalizedPayload = this.normalizePayload(payload, route);
        const provider = this.getProvider();
        const target = this.getRouteUrl(route);

        if (this.getConfig().mode === 'development') {
            return this.simulateDispatch(route, normalizedPayload, onLog);
        }

        if (!this.shouldUseLiveWebhook()) {
            onLog(`[WARN] ${provider} webhook is not configured. Saving locally.`);
            const count = this.saveLocalBackup(normalizedPayload, route);
            onLog(`[SYS] Lead saved locally (${count} pending). Paste the Apps Script Web App URL to send live.`);
            return { status: 'local_backup', localBackup: true, provider };
        }

        onLog(`[SYS] TRANSMITTING ${route.toUpperCase()} POST TO ${provider.toUpperCase()}...`);
        try {
            const data = await this.postToWebhook(route, normalizedPayload);
            onLog('[SYS] WEBHOOK CLEARANCE SECURED: Status 200');
            onLog(`[SYS] RETURNED RESPONSE payload: ${JSON.stringify(data)}`);
            return { status: 'success', provider, response: data };
        } catch (err) {
            onLog(`[ERR] PIPELINE ROUTING EXCEPTION: ${err.message}`);
            onLog('[SYS] FAIL-SAFE: Saving lead locally for manual follow-up...');
            const count = this.saveLocalBackup(normalizedPayload, route);
            onLog(`[SYS] Lead archived locally (${count} pending)`);
            return { status: 'fallback', localBackup: true, provider, error: err.message };
        }
    },

    async dispatchQuote(payload, onLog) {
        return this.dispatchLead('quote', payload, onLog);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosmoWebhook;
} else {
    window.CosmoWebhook = CosmoWebhook;
}
