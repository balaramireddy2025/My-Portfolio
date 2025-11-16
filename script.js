// Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section');
const navLinksList = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animate skill bars on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillProgress = entry.target;
            const width = skillProgress.getAttribute('data-width');
            skillProgress.style.width = width + '%';
            observer.unobserve(skillProgress);
        }
    });
}, observerOptions);

// Observe all skill progress bars
document.querySelectorAll('.skill-progress').forEach(progress => {
    observer.observe(progress);
});

// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Apply animation to cards
document.querySelectorAll('.skill-card, .project-card, .stat-item, .expertise-card, .competency-card, .impact-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(card);
});

// Form submission with EmailJS (with fallback to mailto)
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

// EmailJS configuration check (will use mailto fallback if not configured)

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const userName = contactForm.querySelector('[name="user_name"]').value.trim();
        const userEmail = contactForm.querySelector('[name="user_email"]').value.trim();
        const subject = contactForm.querySelector('[name="subject"]').value.trim();
        const message = contactForm.querySelector('[name="message"]').value.trim();
        
        // Validation
        if (!userName || !userEmail || !subject || !message) {
            formMessage.textContent = 'Please fill in all fields.';
            formMessage.className = 'form-message error';
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 3000);
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            formMessage.textContent = 'Please enter a valid email address.';
            formMessage.className = 'form-message error';
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 3000);
            return;
        }
        
        // Disable submit button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formMessage.textContent = '';
        formMessage.className = 'form-message';
        
        // Check if EmailJS is properly configured
        const serviceId = 'YOUR_SERVICE_ID';
        const templateId = 'YOUR_TEMPLATE_ID';
        const publicKey = 'YOUR_PUBLIC_KEY';
        
        if (typeof emailjs !== 'undefined' && 
            serviceId !== 'YOUR_SERVICE_ID' && 
            templateId !== 'YOUR_TEMPLATE_ID' && 
            publicKey !== 'YOUR_PUBLIC_KEY') {
            
            // Initialize EmailJS if not already initialized
            try {
                emailjs.init(publicKey);
            } catch (e) {
                console.log('EmailJS init error:', e);
            }
            
            // Get form data for EmailJS
            const templateParams = {
                user_name: userName,
                user_email: userEmail,
                subject: subject,
                message: message,
                to_email: 'ybalaramireddy@gmail.com'
            };
            
            // Send email using EmailJS
            emailjs.send(serviceId, templateId, templateParams)
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text);
                    formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                    formMessage.className = 'form-message success';
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        formMessage.textContent = '';
                        formMessage.className = 'form-message';
                    }, 5000);
                }, (error) => {
                    console.log('EmailJS FAILED, using mailto fallback...', error);
                    // Fallback to mailto
                    sendViaMailto(userName, userEmail, subject, message);
                });
        } else {
            // Use mailto as fallback
            sendViaMailto(userName, userEmail, subject, message);
        }
    });
}

// Fallback function to send via mailto link
function sendViaMailto(userName, userEmail, subject, message) {
    const emailBody = `Name: ${userName}%0D%0AEmail: ${userEmail}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
    const mailtoLink = `mailto:ybalaramireddy@gmail.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    // Show success message
    formMessage.textContent = 'Opening your email client... If it doesn\'t open, please send an email to ybalaramireddy@gmail.com';
    formMessage.className = 'form-message success';
    
    // Reset form
    setTimeout(() => {
        document.getElementById('contact-form').reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }, 1000);
    
    // Hide message after 8 seconds
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 8000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
    
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add active class to nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Typing effect for hero title (optional enhancement)
const heroName = document.querySelector('.hero-title .name');
if (heroName) {
    const originalText = heroName.textContent;
    heroName.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < originalText.length) {
            heroName.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typing animation after page load
    setTimeout(typeWriter, 1000);
}
