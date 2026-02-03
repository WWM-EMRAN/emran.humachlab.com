window.SiteCore = (function() {
    // Internal state: RAM cache and status flags
    const mem = { data: {}, loaded: false, promise: null };
    const CACHE_KEY = 'site_data_cache';
    const TIME_KEY = 'site_data_timestamp';

    /**
     * Loads all data, prioritizing Persistent Cache -> RAM Cache -> Server Fetch
     */
    async function preloadAllData(base, files) {
        if (mem.promise) return mem.promise;

        const now = Date.now();
        const cachedStr = localStorage.getItem(CACHE_KEY);
        const timestamp = localStorage.getItem(TIME_KEY);

        // 1. Check for valid Persistent Cache
        if (cachedStr && timestamp) {
            try {
                const tempData = JSON.parse(cachedStr);
                // Default to 3600s if expiration is missing in site.json
                const expiry = (tempData.site?.cache_settings?.expiration_seconds || 3600) * 1000;

                if (now - timestamp < expiry) {
                    console.log("Loading data from persistent cache...");
                    mem.data = tempData;
                    mem.loaded = true;
                    return mem.promise = Promise.resolve(true);
                }
            } catch (e) {
                console.warn("Cache corrupted, initiating fresh fetch.");
            }
        }

        // 2. Fetch fresh data if cache is missing or expired
        console.log("Cache expired or missing. Fetching fresh data...");
        mem.promise = Promise.all(files.map(async f => {
            const r = await fetch(base + f);
            if (!r.ok) throw new Error(`Fetch failed for: ${f}`);
            mem.data[f.replace(/\.json$/, '')] = await r.json();
        })).then(() => {
            // Update RAM status and Persistent storage
            localStorage.setItem(CACHE_KEY, JSON.stringify(mem.data));
            localStorage.setItem(TIME_KEY, now.toString());
            mem.loaded = true;
        });

        return mem.promise;
    }

    /**
     * Retrieval and DOM Helpers
     */
    const get = k => mem.data[k] || null;

    const el = (tag, opt = {}) => {
        const n = document.createElement(tag);
        if (opt.class) n.className = opt.class;
        if (opt.text) n.textContent = opt.text;
        if (opt.html) n.innerHTML = opt.html;
        if (opt.id) n.id = opt.id;
        return n;
    };

    const append = (p, ...children) => {
        children.filter(Boolean).forEach(c => p.appendChild(c));
        return p;
    };

    /**
     * Standardised Card Component
     */
    const card = ({ title, subtitle, body, icon }) => {
        const c = el('div', { class: 'card-basic card-media' });
        if (icon) append(c, el('i', { class: icon }));
        if (title) append(c, el('h4', { class: 'card-title', text: title }));
        if (subtitle) append(c, el('div', { class: 'card-subtitle', text: subtitle }));
        if (body) append(c, typeof body === 'string' ? el('p', { text: body }) : body);
        return c;
    };

    return { preloadAllData, get, el, append, card };
})();