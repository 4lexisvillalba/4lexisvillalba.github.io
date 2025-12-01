(function () {
    'use strict';

    const form = document.getElementById('introduction-form');
    const formWrapper = document.getElementById('form-wrapper');
    const previewSection = document.getElementById('preview-section');
    const jsonSection = document.getElementById('json-section');
    const htmlSection = document.getElementById('html-section');
    const htmlOutput = document.getElementById('html-output');
    const generateButton = document.getElementById('generate-html');
    const resetButton = document.getElementById('reset-html-view');
    const titleHeading = document.querySelector('.intro-form-title');

    function escapeHTML(value) {
        return (value || '').replace(/[&<>"']/g, (match) => {
            switch (match) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case '\'': return '&#39;';
                default: return match;
            }
        });
    }

    function buildHeading(data) {
        const preferred = data.nickname ? `"${data.nickname}" ` : '';
        const middle = data.middleName ? `${data.middleName.charAt(0).toUpperCase()}. ` : '';
        return `${escapeHTML(data.firstName)} ${middle}${preferred}${escapeHTML(data.lastName)} ${data.divider || '★'} ${escapeHTML(data.mascotAdj)} ${escapeHTML(data.mascotAnimal)}`;
    }

    function buildBullets(data) {
        if (!data.bullets) {
            return '';
        }
        return data.bullets
            .filter((item) => item.value)
            .map(
                (item) => `        <li><strong>${escapeHTML(item.label)}:</strong> ${escapeHTML(item.value)}</li>`
            )
            .join('\n');
    }

    function buildCourses(data) {
        if (!data.courses || data.courses.length === 0) {
            return '';
        }
        const list = data.courses
            .map(
                (course) =>
                    `            <li><strong>${escapeHTML(course.dept)} ${escapeHTML(course.number)}</strong> — ${escapeHTML(course.name)} (${escapeHTML(course.reason)})</li>`
            )
            .join('\n');
        return `    <section>\n        <h4>Current Courses</h4>\n        <ul>\n${list}\n        </ul>\n    </section>`;
    }

    function buildLinks(data) {
        if (!data.links || data.links.length === 0) {
            return '';
        }
        const linksList = data.links
            .map(
                (link) =>
                    `            <li><a href="${escapeHTML(link.url || link.href)}" target="_blank" rel="noopener">${escapeHTML(link.label || link.name)}</a></li>`
            )
            .join('\n');
        return `    <section>\n        <h4>Links</h4>\n        <ul>\n${linksList}\n        </ul>\n    </section>`;
    }

    function buildHtmlMarkup(data) {
        const headingLine = buildHeading(data);
        const bullets = buildBullets(data);
        const courses = buildCourses(data);
        const links = buildLinks(data);

        return [
            '<section class="introduction-output">',
            '    <h2>Introduction HTML</h2>',
            `    <h3>${headingLine}</h3>`,
            '    <figure>',
            `        <img src="${escapeHTML(data.photoUrl)}" alt="${escapeHTML(data.photoAlt)}" />`,
            `        <figcaption>${escapeHTML(data.photoCaption)}</figcaption>`,
            '    </figure>',
            `    <p>${escapeHTML(data.personalStatement)}</p>`,
            '    <ul>',
            bullets,
            '    </ul>',
            courses,
            links,
            '</section>'
        ]
            .filter(Boolean)
            .join('\n');
    }

    function showHtmlView(markup) {
        if (formWrapper) formWrapper.hidden = true;
        if (previewSection) previewSection.hidden = true;
        if (jsonSection) jsonSection.hidden = true;
        if (htmlSection) htmlSection.hidden = false;
        if (titleHeading) titleHeading.textContent = 'Introduction HTML';

        if (htmlOutput) {
            htmlOutput.textContent = markup;
            if (window.hljs) {
                window.hljs.highlightElement(htmlOutput);
                const spans = htmlOutput.querySelectorAll('span');
                spans.forEach((span) => {
                    span.style.whiteSpace = 'pre-wrap';
                    span.style.wordBreak = 'break-word';
                    span.style.overflowWrap = 'anywhere';
                });
            }
        }
    }

    if (generateButton) {
        generateButton.addEventListener('click', () => {
            if (!form || !form.reportValidity()) {
                return;
            }
            const data =
                typeof window.collectIntroductionFormData === 'function'
                    ? window.collectIntroductionFormData()
                    : null;
            if (!data) {
                return;
            }
            const markup = buildHtmlMarkup(data);
            showHtmlView(markup);
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (typeof window.showIntroductionForm === 'function') {
                window.showIntroductionForm();
            } else {
                if (htmlSection) htmlSection.hidden = true;
                if (formWrapper) formWrapper.hidden = false;
            }
        });
    }
})();
