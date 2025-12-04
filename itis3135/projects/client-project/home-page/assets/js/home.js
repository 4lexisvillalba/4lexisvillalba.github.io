(function(){
    var statsContainer = document.querySelector('.stat-column');
    if (!statsContainer) {
        return;
    }

    var statValues = statsContainer.querySelectorAll('.stat-value[data-target]');
    if (!statValues.length) {
        return;
    }

    var hasAnimated = false;

    function animateStats() {
        if (hasAnimated) return;
        hasAnimated = true;

        statValues.forEach(function(stat){
            var target = parseFloat(stat.dataset.target);
            var suffix = stat.dataset.suffix || '';
            var duration = 1200;
            var startTime = null;

            function update(timestamp) {
                if (!startTime) {
                    startTime = timestamp;
                }
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var current = target * progress;
                var displayValue = target % 1 === 0 ? Math.round(current) : current.toFixed(1);
                stat.textContent = displayValue + suffix;
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            requestAnimationFrame(update);
        });
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if (entry.isIntersecting) {
                    animateStats();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.4 });
        observer.observe(statsContainer);
    } else {
        animateStats();
    }
})();
