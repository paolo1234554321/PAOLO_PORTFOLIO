document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul a');
    const sections = document.querySelectorAll('section');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navUl = document.querySelector('nav ul');

    // Mobile Hamburger Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navUl.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navUl.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    const setActiveLink = (targetId) => {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });
    };

    // Scroll spy updates active link based on current scroll position
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 120) {
                current = `#${section.getAttribute('id')}`;
            }
        });
        // At the very bottom of the page, highlight the last section (it may be too short to reach the scroll threshold)
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
            current = `#${sections[sections.length - 1].getAttribute('id')}`;
        }
        if (current) setActiveLink(current);
    });

    // Smooth scroll navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSec = document.querySelector(targetId);

            // Close mobile menu if open
            if (navUl.classList.contains('active')) {
                navUl.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }

            if (targetSec) {
                targetSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Lightbox & Modal Navigation
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close-btn');

    let currentImageGroup = [];
    let currentImageIndex = 0;

    const prevArrow = document.createElement('button');
    prevArrow.className = 'modal-arrow prev';
    prevArrow.innerHTML = '&#10094;';

    const nextArrow = document.createElement('button');
    nextArrow.className = 'modal-arrow next';
    nextArrow.innerHTML = '&#10095;';

    modal.appendChild(prevArrow);
    modal.appendChild(nextArrow);

    const updateModalContent = () => {
        if (!currentImageGroup.length) return;
        const currentImg = currentImageGroup[currentImageIndex];
        modalImg.src = currentImg.src;
        modalImg.alt = currentImg.alt;
        modalCaption.textContent = currentImg.alt || 'Visual Documentation';

        // Single image case: hide both arrows
        if (currentImageGroup.length <= 1) {
            prevArrow.style.display = 'none';
            nextArrow.style.display = 'none';
            return;
        }

        // Hide previous arrow if at the beginning of the gallery
        if (currentImageIndex === 0) {
            prevArrow.style.display = 'none';
        } else {
            prevArrow.style.display = 'flex';
        }

        // Hide next arrow if at the end of the gallery
        if (currentImageIndex === currentImageGroup.length - 1) {
            nextArrow.style.display = 'none';
        } else {
            nextArrow.style.display = 'flex';
        }
    };

    const navigateImage = (direction) => {
        if (!currentImageGroup.length) return;

        if (direction === 'prev' && currentImageIndex > 0) {
            currentImageIndex--;
        } else if (direction === 'next' && currentImageIndex < currentImageGroup.length - 1) {
            currentImageIndex++;
        }

        updateModalContent();
    };

    const containers = document.querySelectorAll('.cert-grid, .doc-card, .doc-gallery-section');

    containers.forEach(container => {
        const images = Array.from(container.querySelectorAll('img'));
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageGroup = images;
                currentImageIndex = index;
                updateModalContent();
                modal.style.display = 'flex';
            });
        });
    });

    prevArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage('prev');
    });

    nextArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateImage('next');
    });

    const closeModal = () => {
        modal.style.display = 'none';
        currentImageGroup = [];
        currentImageIndex = 0;
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                navigateImage('prev');
            } else if (e.key === 'ArrowRight') {
                navigateImage('next');
            } else if (e.key === 'Escape') {
                closeModal();
            }
        }
    });

    // Contact form: delivers messages to my Gmail through Web3Forms
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = document.getElementById('contact-submit');
        const btnLabel = submitBtn.querySelector('span');
        const statusEl = document.getElementById('form-status');

        const showStatus = (message, type) => {
            statusEl.textContent = message;
            statusEl.className = type ? `form-status ${type}` : 'form-status';
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(contactForm).entries());

            if (data.access_key === 'YOUR_ACCESS_KEY_HERE') {
                showStatus('The form is not set up yet: the access key is missing in index.html.', 'error');
                return;
            }

            submitBtn.disabled = true;
            btnLabel.textContent = 'Sending...';
            showStatus('', '');

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    showStatus('Message sent. I will reply to your email soon.', 'success');
                    contactForm.reset();
                } else {
                    showStatus('Message not sent. Try again, or email me directly.', 'error');
                }
            } catch (error) {
                showStatus('Message not sent. Check your connection and try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                btnLabel.textContent = 'Send message';
            }
        });
    }
});