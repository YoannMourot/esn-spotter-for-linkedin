const textarea = document.getElementById('raw-json');
const statusDiv = document.getElementById('status');
const saveBtn = document.getElementById('save-btn');

async function initPopup() {
    const storage = await browser.storage.local.get('customEsnList');

    if (storage.customEsnList) {
        textarea.value = storage.customEsnList;
    } else {
        const url = browser.runtime.getURL('resources/esn-dictionary.json');
        const response = await fetch(url);
        const defaultText = await response.text();
        textarea.value = defaultText;
    }
}

saveBtn.addEventListener('click', () => {
    const rawText = textarea.value;

    try {
        JSON.parse(rawText);
        browser.storage.local.set({ customEsnList: rawText }).then(() => {
            statusDiv.textContent = '✔ Sauvegardé';
            statusDiv.style.color = '#50fa7b'; // Vert

            setTimeout(() => { statusDiv.textContent = ''; }, 3000);
        });
    } catch (e) {
        statusDiv.textContent = '✖ Erreur de syntaxe JSON';
        statusDiv.style.color = '#ff5555'; // Rouge
    }
});

initPopup();