(function () {
    'use strict';

    const form = document.getElementById('introduction-form');
    const formWrapper = document.getElementById('form-wrapper');
    const previewSection = document.getElementById('preview-section');
    const jsonSection = document.getElementById('json-section');
    const jsonOutput = document.getElementById('json-output');
    const generateButton = document.getElementById('generate-json');
    const resetJsonButton = document.getElementById('reset-json-view');
    const titleHeading = document.querySelector('.intro-form-title');

    function getValue(formData, name) {
        return (formData.get(name) || '').trim();
    }

    function buildCourses(formData) {
        const depts = formData.getAll('courseDept[]');
        const numbers = formData.getAll('courseNumber[]');
        const names = formData.getAll('courseName[]');
        const reasons = formData.getAll('courseReason[]');

        const courses = [];
        depts.forEach((dept, index) => {
            const number = numbers[index] || '';
            const name = names[index] || '';
            const reason = reasons[index] || '';
            if (dept.trim() && number.trim() && name.trim() && reason.trim()) {
                courses.push({
                    department: dept.trim(),
                    number: number.trim(),
                    name: name.trim(),
                    reason: reason.trim()
                });
            }
        });
        return courses;
    }

    function buildLinks(formData) {
        const labels = formData.getAll('linkLabel[]');
        const urls = formData.getAll('linkUrl[]');
        const links = [];

        urls.forEach((url, index) => {
            if (!url.trim()) {
                return;
            }
            links.push({
                name: (labels[index] || '').trim() || url.trim(),
                href: url.trim()
            });
        });

        return links;
    }

    function buildJsonPayload(formData) {
        const middle = getValue(formData, 'middleName');
        const json = {
            firstName: getValue(formData, 'firstName'),
            preferredName: getValue(formData, 'nickname'),
            middleInitial: middle ? middle.charAt(0).toUpperCase() : '',
            lastName: getValue(formData, 'lastName'),
            divider: getValue(formData, 'divider') || '~',
            mascotAdjective: getValue(formData, 'mascotAdj'),
            mascotAnimal: getValue(formData, 'mascotAnimal'),
            image: getValue(formData, 'photoUrl'),
            imageCaption: getValue(formData, 'photoCaption'),
            personalStatement: getValue(formData, 'personalStatement'),
            personalBackground: getValue(formData, 'personalBackground'),
            professionalBackground: getValue(formData, 'professionalBackground'),
            academicBackground: getValue(formData, 'academicBackground'),
            subjectBackground: getValue(formData, 'careerInterests'),
            primaryComputer: getValue(formData, 'technicalInterests'),
            courses: buildCourses(formData),
            links: buildLinks(formData)
        };

        return json;
    }

    function showJsonView(jsonString) {
        if (formWrapper) formWrapper.hidden = true;
        if (previewSection) previewSection.hidden = true;
        if (jsonSection) jsonSection.hidden = false;
        if (titleHeading) titleHeading.textContent = 'Introduction JSON';

        if (jsonOutput) {
            jsonOutput.textContent = jsonString;
            if (window.hljs) {
                window.hljs.highlightElement(jsonOutput);
                const wrappers = jsonOutput.querySelectorAll('span');
                wrappers.forEach((span) => {
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
            const formData = new FormData(form);
            const jsonPayload = buildJsonPayload(formData);
            const jsonString = JSON.stringify(jsonPayload, null, 2);
            showJsonView(jsonString);
        });
    }

    if (resetJsonButton) {
        resetJsonButton.addEventListener('click', () => {
            if (typeof window.showIntroductionForm === 'function') {
                window.showIntroductionForm();
            } else {
                if (jsonSection) jsonSection.hidden = true;
                if (formWrapper) formWrapper.hidden = false;
                if (titleHeading) titleHeading.textContent = 'Introduction Form';
            }
        });
    }
})();
