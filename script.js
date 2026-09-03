document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul a');
    const sections = document.querySelectorAll('section');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navUl = document.querySelector('nav ul');

    // Mobile Hamburger Menu Toggle
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

    const showSection = (targetId) => {
        sections.forEach(section => {
            if (`#${section.id}` === targetId) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });
        setActiveLink(targetId);
    };

    // Initialize home section as active
    showSection('#home');

    // Pop-up navigation handler
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');

            // Close mobile menu if open
            if (navUl.classList.contains('active')) {
                navUl.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }

            showSection(targetId);
        });
    });

    // Lightbox & Navigation State
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close-btn');

    let currentImageGroup = [];
    let currentImageIndex = 0;

    // Create Navigation Arrow Buttons dynamically inside Modal
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

        // Toggle arrow visibility if group has 1 image vs multiple
        if (currentImageGroup.length <= 1) {
            prevArrow.style.display = 'none';
            nextArrow.style.display = 'none';
        } else {
            prevArrow.style.display = 'flex';
            nextArrow.style.display = 'flex';
        }
    };

    const navigateImage = (direction) => {
        if (!currentImageGroup.length) return;
        if (direction === 'prev') {
            currentImageIndex = (currentImageIndex - 1 + currentImageGroup.length) % currentImageGroup.length;
        } else if (direction === 'next') {
            currentImageIndex = (currentImageIndex + 1) % currentImageGroup.length;
        }
        updateModalContent();
    };

    // Attach click triggers to certificate and document gallery images
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

    // Arrow event listeners
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

    // Keyboard support (Left / Right / Escape)
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
});