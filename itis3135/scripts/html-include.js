document.addEventListener('DOMContentLoaded', async () => {
    const includeTargets = document.querySelectorAll('[data-include]');
    await Promise.all(
        Array.from(includeTargets).map(async (el) => {
            const file = el.getAttribute('data-include');
            if (!file) {
                return;
            }
            try {
                const response = await fetch(file);
                if (response.ok) {
                    el.innerHTML = await response.text();
                } else {
                    console.error(`Include failed: ${file}`);
                }
            } catch (err) {
                console.error(`Include error: ${file}`, err);
            }
        })
    );

    const currentUrl = encodeURIComponent(window.location.href);
    const htmlLink = document.getElementById('validation-link-html');
    const cssLink = document.getElementById('validation-link-css');
    if (htmlLink) {
        htmlLink.setAttribute('href', `https://validator.w3.org/nu/?doc=${currentUrl}`);
    }
    if (cssLink) {
        cssLink.setAttribute('href', `https://jigsaw.w3.org/css-validator/validator?uri=${currentUrl}`);
    }
});
