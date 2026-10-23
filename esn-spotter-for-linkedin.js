let esnDirectory = [];

async function loadConfig() {
    const storage = await browser.storage.local.get('customEsnList');
    let esnText = storage.customEsnList;
    if (!esnText) {
        const response = await fetch(browser.runtime.getURL('resources/esn-dictionary.json'));
        esnText = await response.text();
    }
    esnDirectory = JSON.parse(esnText).map(name => name.toLowerCase());
}

function renderBadges() {
    const container = document.querySelector('[componentkey="SearchResultsMainContent"]');
    if (!container) return;

    const textElements = container.querySelectorAll('p, span, a');

    textElements.forEach(element => {
        if (element.dataset.esnSpotted) return;

        const text = element.textContent.trim().toLowerCase();
        if (esnDirectory.includes(text)) {
            const badge = document.createElement('span');
            badge.className = 'esn-spotted-badge';
            badge.textContent = ' ESN Spotted!';
            badge.style.color = 'red';
            badge.style.fontWeight = 'bold';
            badge.style.marginLeft = '5px';

            element.appendChild(badge);
            element.dataset.esnSpotted = 'true';
        }
    });
}

const observer = new MutationObserver(() => {
    renderBadges();
});

browser.storage.local.onChanged.addListener((changes) => {
    if (changes.customEsnList && changes.customEsnList.newValue) {
        esnDirectory = JSON.parse(changes.customEsnList.newValue).map(name => name.toLowerCase());

        document.querySelectorAll('.esn-spotted-badge').forEach(badge => badge.remove());
        document.querySelectorAll('[data-esn-spotted]').forEach(el => delete el.dataset.esnSpotted);

        renderBadges();
    }
});

loadConfig().then(() => {
    observer.observe(document.body, { childList: true, subtree: true });
    renderBadges();
});