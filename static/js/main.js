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

function openProjectModal(index) {
    var data = projectCatalog.find(function(p) { return p.id === index; }) || projectCatalog[index];
    if (!data) return;
    var modal = document.getElementById('projectModal');
    var titleEl = modal.querySelector('.modal-title');
    var descEl = modal.querySelector('.modal-desc');
    var galleryEl = document.getElementById('modalGallery');
    titleEl.textContent = data.title;
    descEl.textContent = data.description;
    galleryEl.innerHTML = '';
    data.images.forEach(function(src) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = data.title;
        img.className = 'modal-gallery-img';
        galleryEl.appendChild(img);
    });
    modal.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    var modal = document.getElementById('projectModal');
    modal.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Contact form submission
document.addEventListener('DOMContentLoaded', function() {
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
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('projectModal').classList.contains('modal-open')) {
            closeProjectModal();
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
