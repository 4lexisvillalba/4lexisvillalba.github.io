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

    syncNavigationLinks();
    updateValidationLinks();
});

function resolveBasePaths() {
    const marker = '/itis3135/';
    const { pathname } = window.location;
    const markerIndex = pathname.indexOf(marker);

    if (markerIndex === -1) {
        return {
            root: '/',
            itis: marker,
        };
    }

    const prefix = pathname.slice(0, markerIndex);
    const rootBase = prefix ? `${prefix}/` : '/';
    return {
        root: rootBase,
        itis: `${rootBase}itis3135/`,
    };
}

function syncNavigationLinks() {
    const bases = resolveBasePaths();
    const navLinks = document.querySelectorAll('a[data-scope][data-path]');

    navLinks.forEach((link) => {
        const scope = link.getAttribute('data-scope');
        const relativePath = link.getAttribute('data-path');
        if (!scope || !relativePath) {
            return;
        }

        let resolvedHref = relativePath;
        if (scope === 'root') {
            resolvedHref = bases.root + relativePath;
        } else if (scope === 'itis') {
            resolvedHref = bases.itis + relativePath;
        }

        link.setAttribute('href', resolvedHref);
    });
}

function updateValidationLinks() {
    const currentUrl = encodeURIComponent(window.location.href);
    const htmlLink = document.getElementById('validation-link-html');
    const cssLink = document.getElementById('validation-link-css');
    if (htmlLink) {
        htmlLink.setAttribute('href', `https://validator.w3.org/nu/?doc=${currentUrl}`);
    }
    if (cssLink) {
        cssLink.setAttribute('href', `https://jigsaw.w3.org/css-validator/validator?uri=${currentUrl}`);
    }
}
