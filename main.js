document.addEventListener('DOMContentLoaded', () => {
    const exchanges = [
        {
            id: 'binance',
            name: 'Binance',
            offer: 'Up to 20% fee discount',
            feeTier: 'Low',
            kyc: 'Required',
            bestFor: 'High liquidity',
            audience: 'Futures traders',
            note: 'Terms vary by region.',
            link: 'https://example.com/ref/binance'
        },
        {
            id: 'bybit',
            name: 'Bybit',
            offer: 'Welcome bonus campaign',
            feeTier: 'Low',
            kyc: 'Required',
            bestFor: 'Derivatives users',
            audience: 'Active traders',
            note: 'Bonus events rotate monthly.',
            link: 'https://example.com/ref/bybit'
        },
        {
            id: 'okx',
            name: 'OKX',
            offer: 'Mystery box + fee benefit',
            feeTier: 'Mid',
            kyc: 'Required',
            bestFor: 'Multi-product traders',
            audience: 'Spot + earn users',
            note: 'Campaign availability differs by country.',
            link: 'https://example.com/ref/okx'
        },
        {
            id: 'bitget',
            name: 'Bitget',
            offer: 'Referral rebate + events',
            feeTier: 'Mid',
            kyc: 'Required',
            bestFor: 'Beginner-friendly UX',
            audience: 'New crypto users',
            note: 'Always verify current promo page.',
            link: 'https://example.com/ref/bitget'
        }
    ];

    const exchangeGrid = document.getElementById('exchangeGrid');
    const comparisonBody = document.getElementById('comparisonBody');
    const totalClicksEl = document.getElementById('totalClicks');
    const topExchangeEl = document.getElementById('topExchange');
    const exchangeCountEl = document.getElementById('exchangeCount');

    function readClickStats() {
        const raw = localStorage.getItem('refClickStats');
        if (!raw) {
            return {};
        }

        try {
            return JSON.parse(raw);
        } catch (err) {
            return {};
        }
    }

    function writeClickStats(stats) {
        localStorage.setItem('refClickStats', JSON.stringify(stats));
    }

    function renderCards() {
        const cardHTML = exchanges.map((exchange) => `
            <article class="exchange-card">
                <div class="exchange-top">
                    <h3>${exchange.name}</h3>
                    <span class="tag">${exchange.feeTier} fee</span>
                </div>
                <p>${exchange.offer}</p>
                <div class="exchange-meta">
                    <span>${exchange.kyc} KYC</span>
                    <span>${exchange.bestFor}</span>
                    <span>${exchange.audience}</span>
                </div>
                <div class="card-actions">
                    <a
                        class="btn btn-primary track-link"
                        href="${exchange.link}"
                        data-exchange="${exchange.id}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >Join With Referral</a>
                    <button class="copy-btn" data-link="${exchange.link}">Copy Link</button>
                </div>
                <p class="note">${exchange.note}</p>
            </article>
        `).join('');

        exchangeGrid.innerHTML = cardHTML;
    }

    function renderComparisonTable() {
        const rowHTML = exchanges.map((exchange) => `
            <tr>
                <td>${exchange.name}</td>
                <td>${exchange.offer}</td>
                <td>${exchange.feeTier}</td>
                <td>${exchange.kyc}</td>
                <td>${exchange.bestFor}</td>
            </tr>
        `).join('');

        comparisonBody.innerHTML = rowHTML;
    }

    function syncDashboard() {
        const stats = readClickStats();
        let total = 0;
        let topId = '';
        let topCount = 0;

        Object.entries(stats).forEach(([id, count]) => {
            total += count;
            if (count > topCount) {
                topCount = count;
                topId = id;
            }
        });

        const topExchange = exchanges.find((exchange) => exchange.id === topId);
        totalClicksEl.textContent = total;
        topExchangeEl.textContent = topExchange ? `${topExchange.name} (${topCount})` : 'No data yet';
        exchangeCountEl.textContent = String(exchanges.length);
    }

    function setupTracking() {
        exchangeGrid.addEventListener('click', (event) => {
            const trackLink = event.target.closest('.track-link');
            if (trackLink) {
                const exchangeId = trackLink.dataset.exchange;
                const stats = readClickStats();
                stats[exchangeId] = (stats[exchangeId] || 0) + 1;
                writeClickStats(stats);
                syncDashboard();
            }

            const copyButton = event.target.closest('.copy-btn');
            if (copyButton) {
                const link = copyButton.dataset.link;
                navigator.clipboard.writeText(link).then(() => {
                    copyButton.textContent = 'Copied';
                    window.setTimeout(() => {
                        copyButton.textContent = 'Copy Link';
                    }, 1200);
                }).catch(() => {
                    copyButton.textContent = 'Copy failed';
                    window.setTimeout(() => {
                        copyButton.textContent = 'Copy Link';
                    }, 1200);
                });
            }
        });
    }

    renderCards();
    renderComparisonTable();
    setupTracking();
    syncDashboard();
});
