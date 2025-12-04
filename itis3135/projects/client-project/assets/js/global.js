(function(){
    var backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    function toggleButton(){
        if (window.scrollY > 300) {
            backToTop.classList.add('back-to-top-visible');
        } else {
            backToTop.classList.remove('back-to-top-visible');
        }
    }

    window.addEventListener('scroll', toggleButton);
    toggleButton();

    backToTop.addEventListener('click', function(){
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
