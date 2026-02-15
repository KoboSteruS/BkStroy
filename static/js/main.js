// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        menuIcon.textContent = '☰';
    } else {
        mobileMenu.classList.add('active');
        menuIcon.textContent = '✕';
    }
}

// Smooth scroll to section
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

// Каталог объектов — подставляется с сервера (window.__CATALOG__) или пустой массив
var projectCatalog = typeof window !== 'undefined' && window.__CATALOG__ ? window.__CATALOG__ : [];

var modalGalleryImages = [];
var modalGalleryIndex = 0;

function openProjectModal(index) {
    var data = projectCatalog.find(function(p) { return p.id === index; }) || projectCatalog[index];
    if (!data) return;
    var modal = document.getElementById('projectModal');
    var titleEl = modal.querySelector('.modal-title');
    var descEl = modal.querySelector('.modal-desc');
    var mainImg = document.getElementById('modalGalleryImg');
    var thumbsEl = document.getElementById('modalGalleryThumbs');
    titleEl.textContent = data.title;
    descEl.textContent = data.description;
    modalGalleryImages = data.images && data.images.length ? data.images.slice() : [];
    modalGalleryIndex = 0;

    if (mainImg) {
        mainImg.alt = data.title;
        mainImg.src = modalGalleryImages[0] || '';
    }
    if (thumbsEl) {
        thumbsEl.innerHTML = '';
        modalGalleryImages.forEach(function(src, i) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'modal-gallery-thumb' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', 'Фото ' + (i + 1));
            var img = document.createElement('img');
            img.src = src;
            img.alt = '';
            btn.appendChild(img);
            btn.addEventListener('click', function() { setModalGalleryIndex(i); });
            thumbsEl.appendChild(btn);
        });
    }
    var wrap = modal.querySelector('.modal-gallery-wrap');
    var hint = modal.querySelector('.modal-gallery-hint');
    if (wrap) wrap.style.display = modalGalleryImages.length ? 'flex' : 'none';
    if (hint) hint.style.display = modalGalleryImages.length ? 'block' : 'none';
    if (thumbsEl) thumbsEl.style.display = modalGalleryImages.length > 1 ? 'flex' : 'none';
    updateModalGalleryNav();
    modal.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function setModalGalleryIndex(i) {
    if (i < 0 || i >= modalGalleryImages.length) return;
    modalGalleryIndex = i;
    var mainImg = document.getElementById('modalGalleryImg');
    if (mainImg) mainImg.src = modalGalleryImages[i];
    var thumbs = document.querySelectorAll('.modal-gallery-thumb');
    thumbs.forEach(function(t, j) { t.classList.toggle('active', j === i); });
    updateModalGalleryNav();
}

function updateModalGalleryNav() {
    var prevBtn = document.getElementById('modalGalleryPrev');
    var nextBtn = document.getElementById('modalGalleryNext');
    if (prevBtn) prevBtn.style.visibility = modalGalleryImages.length <= 1 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.style.visibility = modalGalleryImages.length <= 1 ? 'hidden' : 'visible';
}

function openLightbox() {
    if (modalGalleryImages.length === 0) return;
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightboxImg');
    if (lb && lbImg) {
        lbImg.src = modalGalleryImages[modalGalleryIndex];
        lbImg.alt = document.getElementById('modalTitle').textContent;
        lb.classList.add('lightbox-open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    var lb = document.getElementById('lightbox');
    if (lb) {
        lb.classList.remove('lightbox-open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

function lightboxPrev() {
    if (modalGalleryImages.length <= 1) return;
    modalGalleryIndex = (modalGalleryIndex - 1 + modalGalleryImages.length) % modalGalleryImages.length;
    document.getElementById('lightboxImg').src = modalGalleryImages[modalGalleryIndex];
}

function lightboxNext() {
    if (modalGalleryImages.length <= 1) return;
    modalGalleryIndex = (modalGalleryIndex + 1) % modalGalleryImages.length;
    document.getElementById('lightboxImg').src = modalGalleryImages[modalGalleryIndex];
}

function closeProjectModal() {
    var modal = document.getElementById('projectModal');
    modal.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    closeLightbox();
}

// Живые счётчики в блоке «О нас»
function initCounters() {
    var statsSection = document.querySelector('.about-stats');
    var valueEls = document.querySelectorAll('.about-stat-value[data-value]');
    if (!statsSection || !valueEls.length) return;

    function parseStatValue(str) {
        if (!str || typeof str !== 'string') return null;
        var m = str.trim().match(/^(\d+)(.*)$/);
        return m ? { num: parseInt(m[1], 10), suffix: m[2] || '' } : null;
    }

    function easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    function animateCounter(el, targetNum, suffix, durationMs) {
        var start = 0;
        var startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / durationMs, 1);
            var eased = easeOutQuart(progress);
            var current = Math.round(eased * targetNum);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.setAttribute('data-animated', 'true');
        }
        requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            valueEls.forEach(function(el) {
                if (el.getAttribute('data-animated') === 'true') return;
                var parsed = parseStatValue(el.getAttribute('data-value'));
                if (!parsed) return;
                animateCounter(el, parsed.num, parsed.suffix, 1800);
            });
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    observer.observe(statsSection);
}

// Скролл каталога объектов (кнопки «Назад» / «Вперёд»)
function initProjectsScroll() {
    var cardsEl = document.getElementById('projectsCards');
    var prevBtn = document.getElementById('projectsPrev');
    var nextBtn = document.getElementById('projectsNext');
    var prevMobile = document.getElementById('projectsPrevMobile');
    var nextMobile = document.getElementById('projectsNextMobile');
    if (!cardsEl) return;

    var gap = 24;
    function scrollAmount() {
        var card = cardsEl.querySelector('.project-card');
        return card ? card.offsetWidth + gap : 280;
    }
    function updateNavState() {
        var scrollLeft = cardsEl.scrollLeft;
        var maxScroll = cardsEl.scrollWidth - cardsEl.clientWidth;
        var atStart = scrollLeft <= 1;
        var atEnd = maxScroll <= 1 || scrollLeft >= maxScroll - 1;
        [prevBtn, prevMobile].forEach(function(btn) {
            if (btn) btn.disabled = atStart;
        });
        [nextBtn, nextMobile].forEach(function(btn) {
            if (btn) btn.disabled = atEnd;
        });
    }
    function go(direction) {
        var left = direction === 'next' ? scrollAmount() : -scrollAmount();
        cardsEl.scrollBy({ left: left, behavior: 'smooth' });
    }

    [prevBtn, nextBtn, prevMobile, nextMobile].forEach(function(btn) {
        if (btn) btn.addEventListener('click', function() { go(btn === nextBtn || btn === nextMobile ? 'next' : 'prev'); });
    });
    cardsEl.addEventListener('scroll', updateNavState);
    window.addEventListener('resize', updateNavState);
    updateNavState();
}

// Contact form submission
document.addEventListener('DOMContentLoaded', function() {
    initCounters();
    initProjectsScroll();

    var projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(function(card) {
        card.addEventListener('click', function() {
            var id = card.getAttribute('data-project');
            if (id !== null) openProjectModal(parseInt(id, 10));
        });
    });
    var modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeProjectModal();
        });
    }
    var modalClose = document.getElementById('modalClose');
    if (modalClose) modalClose.addEventListener('click', closeProjectModal);
    var galleryPrev = document.getElementById('modalGalleryPrev');
    var galleryNext = document.getElementById('modalGalleryNext');
    if (galleryPrev) galleryPrev.addEventListener('click', function() {
        setModalGalleryIndex((modalGalleryIndex - 1 + modalGalleryImages.length) % modalGalleryImages.length);
    });
    if (galleryNext) galleryNext.addEventListener('click', function() {
        setModalGalleryIndex((modalGalleryIndex + 1) % modalGalleryImages.length);
    });
    var galleryImg = document.getElementById('modalGalleryImg');
    if (galleryImg) galleryImg.addEventListener('click', openLightbox);
    var lightbox = document.getElementById('lightbox');
    var lbClose = document.getElementById('lightboxClose');
    var lbPrev = document.getElementById('lightboxPrev');
    var lbNext = document.getElementById('lightboxNext');
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', lightboxPrev);
    if (lbNext) lbNext.addEventListener('click', lightboxNext);
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
        var touchStartX = 0;
        lightbox.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; });
        lightbox.addEventListener('touchend', function(e) {
            var dx = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(dx) > 50) { if (dx > 0) lightboxPrev(); else lightboxNext(); }
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (document.getElementById('lightbox').classList.contains('lightbox-open')) closeLightbox();
            else if (document.getElementById('projectModal').classList.contains('modal-open')) closeProjectModal();
        }
    });

    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            var els = contactForm.elements;
            const formData = {
                name: els.name && els.name.value,
                phone: els.phone && els.phone.value,
                email: els.email && els.email.value,
                message: els.message && els.message.value
            };
            
            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert(data.message);
                    contactForm.reset();
                } else {
                    alert('Произошла ошибка. Попробуйте еще раз.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
                contactForm.reset();
            }
        });
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                toggleMobileMenu();
            }
        }
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    if (!header) return;
    const currentScroll = window.scrollY || window.pageYOffset;
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
});
