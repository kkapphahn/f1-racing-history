// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to navigation on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function setActiveNav() {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// Intersection Observer for timeline animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, observerOptions);

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// Observe legend cards for staggered animation
const legendCards = document.querySelectorAll('.legend-card');
const legendObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

legendCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    legendObserver.observe(card);
});

// Observe team cards
const teamCards = document.querySelectorAll('.team-card');
const teamObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

teamCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    card.style.transition = 'all 0.5s ease-out';
    teamObserver.observe(card);
});

// Observe circuit cards
const circuitCards = document.querySelectorAll('.circuit-card');
const circuitObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

circuitCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(-30px)';
    card.style.transition = 'all 0.6s ease-out';
    circuitObserver.observe(card);
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Counter animation for legend numbers
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
            numberObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.legend-number').forEach(number => {
    numberObserver.observe(number);
});

// Mobile menu toggle (if needed in future)
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const menuButton = document.createElement('button');
    menuButton.classList.add('mobile-menu-toggle');
    menuButton.innerHTML = '☰';
    menuButton.style.display = 'none';
    
    nav.insertBefore(menuButton, nav.firstChild);
    
    menuButton.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    });
    
    // Show menu button on mobile
    const checkWidth = () => {
        if (window.innerWidth <= 768) {
            menuButton.style.display = 'block';
        } else {
            menuButton.style.display = 'none';
            document.querySelector('.nav-links').classList.remove('active');
        }
    };
    
    window.addEventListener('resize', checkWidth);
    checkWidth();
};

// Initialize mobile menu
createMobileMenu();

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg: Console message
console.log('%c🏎️ F1 History - Built for Speed! 🏁', 'color: #e10600; font-size: 20px; font-weight: bold;');
console.log('%cInterested in F1 history? Check out the FIA archives at fia.com', 'color: #ffd700; font-size: 14px;');
