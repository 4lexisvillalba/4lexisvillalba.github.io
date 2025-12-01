(function () {
    'use strict';

    // -----------------------------
    // CONSTANTS / ELEMENT HANDLES
    // -----------------------------
    const bulletFields = [
        { name: 'personalBackground', label: 'Personal Background' },
        { name: 'professionalBackground', label: 'Professional Background' },
        { name: 'academicBackground', label: 'Academic Background' },
        { name: 'careerInterests', label: 'Career Interests' },
        { name: 'technicalInterests', label: 'Technical Interests' },
        { name: 'hobbies', label: 'Hobbies & Community' },
        { name: 'personalHighlight', label: 'Personal Highlight' }
    ];

    const form = document.getElementById('introduction-form');
    const formWrapper = document.getElementById('form-wrapper');
    const previewSection = document.getElementById('preview-section');
    const previewContent = document.getElementById('preview-content');
    const resetViewButton = document.getElementById('reset-view');
    const clearButton = document.getElementById('clear-form');
    const addCourseButton = document.getElementById('add-course');
    const courseList = document.getElementById('course-list');
    const initialCourseMarkup = courseList ? courseList.innerHTML : '';

    // -----------------------------
    // UTILITY FUNCTIONS
    // -----------------------------
    function ensureValue(value, fallback) {
        return value === undefined || value === null ? fallback : value;
    }

    function escapeHTML(value) {
        const safeValue = value || '';
        return safeValue.replace(/[&<>"']/g, (match) => {
            switch (match) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#39;';
                default: return match;
            }
        });
    }

    function escapeAttribute(value) {
        return escapeHTML(value);
    }

    // -----------------------------
    // DATA / PREVIEW HELPERS
    // -----------------------------

    function collectFormData(formData) {
        const courses = [];
        const depts = formData.getAll('courseDept[]');
        const numbers = formData.getAll('courseNumber[]');
        const names = formData.getAll('courseName[]');
        const reasons = formData.getAll('courseReason[]');

        depts.forEach((dept, index) => {
            const name = ensureValue(names[index], '');
            const number = ensureValue(numbers[index], '');
            const reason = ensureValue(reasons[index], '');

            if (dept.trim() && number.trim() && name.trim() && reason.trim()) {
                courses.push({
                    dept: dept.trim(),
                    number: number.trim(),
                    name: name.trim(),
                    reason: reason.trim()
                });
            }
        });

        const linkLabels = formData.getAll('linkLabel[]');
        const linkUrls = formData.getAll('linkUrl[]');
        const links = [];

        linkUrls.forEach((url, index) => {
            if (!url.trim()) return;
            links.push({
                label: ensureValue(linkLabels[index], '').trim() || url.trim(),
                url: url.trim()
            });
        });

        const bullets = bulletFields.map((field) => ({
            label: field.label,
            value: ensureValue(formData.get(field.name), '').trim()
        }));

        return {
            firstName: ensureValue(formData.get('firstName'), '').trim(),
            middleName: ensureValue(formData.get('middleName'), '').trim(),
            nickname: ensureValue(formData.get('nickname'), '').trim(),
            lastName: ensureValue(formData.get('lastName'), '').trim(),
            ackStatement: ensureValue(formData.get('ackStatement'), '').trim(),
            ackDate: ensureValue(formData.get('ackDate'), ''),
            mascotAdj: ensureValue(formData.get('mascotAdj'), '').trim(),
            mascotAnimal: ensureValue(formData.get('mascotAnimal'), '').trim(),
            divider: ensureValue(formData.get('divider'), '').trim() || '~',
            photoUrl: ensureValue(formData.get('photoUrl'), '').trim(),
            photoAlt: ensureValue(formData.get('photoAlt'), '').trim(),
            photoCaption: ensureValue(formData.get('photoCaption'), '').trim(),
            personalStatement: ensureValue(formData.get('personalStatement'), '').trim(),
            quote: ensureValue(formData.get('quote'), '').trim(),
            quoteAuthor: ensureValue(formData.get('quoteAuthor'), '').trim(),
            funnyThing: ensureValue(formData.get('funnyThing'), '').trim(),
            shareThing: ensureValue(formData.get('shareThing'), '').trim(),
            bullets,
            courses,
            links
        };
    }

    function togglePreview(showPreview) {
        if (!formWrapper || !previewSection) return;
        formWrapper.hidden = !!showPreview;
        previewSection.hidden = !showPreview;
    }

    function renderPreview(data) {
        if (!previewContent) return;

        const divider = escapeHTML(data.divider || '~');

        const bulletItems = data.bullets
            .filter((item) => item.value)
            .map(
                (item) =>
                    `<li><b>${escapeHTML(item.label)}: </b>${escapeHTML(item.value)}</li>`
            )
            .join('');

        const courseItems = data.courses
            .map(
                (course) =>
                    `<li>${escapeHTML(course.dept)} ${escapeHTML(course.number)} ${escapeHTML(course.name)} — ${escapeHTML(course.reason)}</li>`
            )
            .join('');

        const linkItems = data.links
            .map(
                (link) =>
                    `<a href="${escapeAttribute(link.url)}" target="_blank" rel="noopener">${escapeHTML(link.label)}</a>`
            )
            .join(` <span class="separator">${divider}</span> `);

        const figureMarkup = data.photoUrl
            ? `
                <figure class="alexis-photo">
                    <img src="${escapeAttribute(data.photoUrl)}" alt="${escapeAttribute(data.photoAlt)}" width="300">
                    <figcaption>${escapeHTML(data.photoCaption)}</figcaption>
                </figure>
            `
            : '';

        const funnyMarkup = data.funnyThing
            ? `<p><strong>Funny thing:</strong> ${escapeHTML(data.funnyThing)}</p>`
            : '';

        const shareMarkup = data.shareThing
            ? `<p><strong>Something I'd like to share:</strong> ${escapeHTML(data.shareThing)}</p>`
            : '';

        const quoteMarkup = data.quote
            ? `
                <blockquote>
                    <p>${escapeHTML(data.quote)}</p>
                    <cite>— ${escapeHTML(data.quoteAuthor)}</cite>
                </blockquote>
            `
            : '';

        previewContent.innerHTML = `
            <h3 class="tagline">${escapeHTML(data.mascotAdj)} ${escapeHTML(data.mascotAnimal)}</h3>
            <p>${escapeHTML(data.personalStatement)}</p>
            ${figureMarkup}
            <h3>About Me</h3>
            <ul class="facts">
                ${bulletItems}
                ${
                    courseItems
                        ? `<li><b>Current Courses:</b><ul>${courseItems}</ul></li>`
                        : ''
                }
            </ul>
            ${quoteMarkup}
            ${funnyMarkup}
            ${shareMarkup}
            <p><strong>Acknowledgment:</strong> ${escapeHTML(data.ackStatement)} (${escapeHTML(data.ackDate)})</p>
            ${
                linkItems
                    ? `<nav aria-label="Submitted links" class="links-nav">${linkItems}</nav>`
                    : ''
            }
        `;
    }

    function restoreInitialCourses() {
        if (courseList) {
            courseList.innerHTML = initialCourseMarkup;
        }
    }

    function clearFormFields(formElement) {
        if (!formElement) return;

        const fields = formElement.querySelectorAll(
            'input:not([type="submit"]):not([type="reset"]):not([type="button"]), textarea, select'
        );

        fields.forEach((field) => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = false;
            } else {
                field.value = '';
            }
        });
    }

    function addCourseFields() {
        if (!courseList) return;

        const block = document.createElement('div');
        block.className = 'course-fields';
        block.setAttribute('data-course', '');

        block.innerHTML = `
            <label>Department
                <input type="text" name="courseDept[]" placeholder="Course dept" required>
            </label>
            <label>Number
                <input type="text" name="courseNumber[]" placeholder="Course number" required>
            </label>
            <label>Course Name
                <input type="text" name="courseName[]" placeholder="Course name" required>
            </label>
            <label>Reason
                <input type="text" name="courseReason[]" placeholder="Why taking it" required>
            </label>
            <button type="button" class="remove-course" aria-label="Remove course">Remove</button>
        `;

        courseList.append(block);
    }

    function removeCourseBlock(block) {
        if (!block || !courseList) return;

        const total = courseList.querySelectorAll('[data-course]').length;
        if (total <= 1) return; // don't remove last set

        block.remove();
    }

    // -----------------------------
    // FORM HANDLERS
    // -----------------------------

    function handleSubmit(event) {
        event.preventDefault();
        if (!form || !form.reportValidity()) {
            return;
        }
        const data = collectFormData(new FormData(form));
        renderPreview(data);
        togglePreview(true);
    }

    function handleFormReset() {
        window.setTimeout(() => {
            restoreInitialCourses();
            togglePreview(false);
        }, 0);
    }

    // -----------------------------
    // EVENT LISTENERS
    // -----------------------------
    if (form) {
        form.addEventListener('submit', handleSubmit);
        form.addEventListener('reset', handleFormReset);
    }

    if (clearButton) {
        clearButton.addEventListener('click', () => clearFormFields(form));
    }

    if (addCourseButton) {
        addCourseButton.addEventListener('click', addCourseFields);
    }

    if (courseList) {
        courseList.addEventListener('click', (event) => {
            if (event.target.matches('.remove-course')) {
                event.preventDefault();
                removeCourseBlock(event.target.closest('[data-course]'));
            }
        });
    }

    if (resetViewButton) {
        resetViewButton.addEventListener('click', () => {
            if (form) form.reset();
            restoreInitialCourses();
            togglePreview(false);
        });
    }
})();

