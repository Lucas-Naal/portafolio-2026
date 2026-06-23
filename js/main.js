// ============================================
// LOADING SCREEN ÉPICO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
        position: fixed;
        inset: 0;
        background: #07070a;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.8s ease, visibility 0.8s ease;
    `;
    
    loader.innerHTML = `
        <div style="font-size: 3rem; font-weight: 800; margin-bottom: 2rem;">
            <span style="background: linear-gradient(135deg, #f43f7e, #7c3aed, #06d6a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AureumDev</span>
        </div>
        <div style="width: 200px; height: 3px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; position: relative;">
            <div id="loaderBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #f43f7e, #7c3aed, #06d6a0); border-radius: 4px; transition: width 0.3s ease; box-shadow: 0 0 20px rgba(244, 63, 126, 0.5);"></div>
        </div>
        <div style="margin-top: 1rem; color: #6b6b7a; font-size: 0.8rem; letter-spacing: 2px;">CARGANDO PORTAFOLIO</div>
    `;
    
    document.body.prepend(loader);
    
    let progress = 0;
    const bar = document.getElementById('loaderBar');
    const interval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                document.body.style.overflow = 'auto';
            }, 300);
        }
        bar.style.width = progress + '%';
    }, 150);
    
    document.body.style.overflow = 'hidden';
});

// ============================================
// NAVBAR - SCROLL Y OCULTAMIENTO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    let isNavbarHidden = false;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.85)';
            navbar.style.boxShadow = 'none';
        }

        if (currentScroll > lastScroll && currentScroll > 100 && !isNavbarHidden) {
            navbar.style.transform = 'translateY(-100%)';
            isNavbarHidden = true;
        } else if (currentScroll < lastScroll && isNavbarHidden) {
            navbar.style.transform = 'translateY(0)';
            isNavbarHidden = false;
        }
        lastScroll = currentScroll;
    });
});

// ============================================
// MENU MÓVIL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
            this.setAttribute('aria-expanded', expanded);
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
});

// ============================================
// SCROLL SUAVE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ============================================
// EFECTO PARTÍCULAS ESTELARES EN HERO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    hero.style.position = 'relative';
    hero.insertBefore(canvas, hero.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 120;
    
    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.7 + 0.3;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(244, 63, 126, ${this.opacity * 0.5})`;
            ctx.fill();
            
            if (this.size > 1.5) {
                ctx.shadowColor = 'rgba(244, 63, 126, 0.3)';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }
    
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(244, 63, 126, ${0.08 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
});

// ============================================
// EFECTO ONDA LUMINOSA SIGUE AL MOUSE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: absolute;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(244, 63, 126, 0.08) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
        filter: blur(20px);
    `;
    hero.style.position = 'relative';
    hero.appendChild(glow);
    
    hero.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
        glow.style.opacity = '1';
    });
    
    hero.addEventListener('mouseleave', function() {
        glow.style.opacity = '0';
    });
});

// ============================================
// EFECTO TEXTO MÁQUINA DE ESCRIBIR CON GLITCH
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const highlight = document.querySelector('.hero-text h1 .highlight');
    if (!highlight) return;
    
    const text = highlight.textContent;
    highlight.textContent = '';
    let i = 0;
    
    const cursor = document.createElement('span');
    cursor.style.cssText = `
        display: inline-block;
        width: 3px;
        height: 1.2em;
        background: linear-gradient(180deg, #f43f7e, #7c3aed);
        margin-left: 2px;
        animation: blinkCursor 0.8s infinite;
        vertical-align: text-bottom;
    `;
    highlight.appendChild(cursor);
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes blinkCursor {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);
    
    function typeWriter() {
        if (i < text.length) {
            const char = text.charAt(i);
            const span = document.createElement('span');
            span.textContent = char;
            span.style.background = 'linear-gradient(135deg, #f43f7e, #7c3aed, #06d6a0)';
            span.style.backgroundSize = '200% 200%';
            span.style.webkitBackgroundClip = 'text';
            span.style.webkitTextFillColor = 'transparent';
            span.style.animation = 'gradShift 2s ease infinite';
            highlight.insertBefore(span, cursor);
            i++;
            
            if (Math.random() > 0.7) {
                const glitch = document.createElement('span');
                glitch.textContent = char;
                glitch.style.cssText = `
                    position: absolute;
                    opacity: 0.3;
                    color: #f43f7e;
                    transform: translate(${Math.random()*4-2}px, ${Math.random()*4-2}px);
                    font-size: 1.02em;
                    pointer-events: none;
                `;
                highlight.appendChild(glitch);
                setTimeout(() => glitch.remove(), 100);
            }
            
            setTimeout(typeWriter, 50 + Math.random() * 30);
        } else {
            setTimeout(() => {
                cursor.style.animation = 'none';
                cursor.style.opacity = '0';
            }, 500);
        }
    }
    
    setTimeout(typeWriter, 400);
});

// ============================================
// EFECTO SPLIT TEXT EN TÍTULOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const titles = document.querySelectorAll('.section-title');
    
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target;
                const text = title.textContent;
                const chars = text.split('');
                title.innerHTML = '';
                
                chars.forEach((char, index) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.cssText = `
                        display: inline-block;
                        opacity: 0;
                        transform: translateY(30px) rotate(5deg);
                        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                        transition-delay: ${index * 0.03}s;
                    `;
                    if (char === ' ') {
                        span.style.width = '0.3em';
                    }
                    title.appendChild(span);
                    
                    setTimeout(() => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0) rotate(0deg)';
                    }, 50 + index * 30);
                });
                
                titleObserver.unobserve(title);
            }
        });
    }, { threshold: 0.3 });
    
    titles.forEach(title => titleObserver.observe(title));
});

// ============================================
// EFECTO 3D PARALLAX EN PROYECTOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const rotateX = (y - 0.5) * 15;
            const rotateY = (x - 0.5) * 15;
            const translateZ = 15 + (Math.sin(x * 10) * 5);
            
            this.style.transform = `
                perspective(1200px) 
                rotateX(${-rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.03) 
                translateZ(${translateZ}px)
            `;
            this.style.transition = 'transform 0.08s ease';
            
            const glowX = x * 100;
            const glowY = y * 100;
            this.style.setProperty('--glow-x', `${glowX}%`);
            this.style.setProperty('--glow-y', `${glowY}%`);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
            this.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
});

// ============================================
// ANIMACIONES DE CARDS CON INTERSECTION OBSERVER
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .project-card, .exp-item, .skill-item, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
});

// ============================================
// EFECTO DE MOUSE EN HERO - PARALLAX
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    const profile = document.querySelector('.profile-placeholder');

    document.addEventListener('mousemove', function(e) {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        
        if (hero) {
            hero.style.background = `
                radial-gradient(ellipse at ${50 + x * 0.5}% ${50 + y * 0.5}%, rgba(244, 63, 126, 0.12) 0%, transparent 55%),
                radial-gradient(ellipse at ${50 - x * 0.5}% ${50 - y * 0.5}%, rgba(124, 58, 237, 0.08) 0%, transparent 55%),
                radial-gradient(ellipse at ${50 + x * 0.3}% ${50 + y * 0.3}%, rgba(6, 214, 160, 0.04) 0%, transparent 40%),
                #07070a
            `;
        }

        if (profile) {
            const rotateY = x * 0.5;
            const rotateX = -y * 0.5;
            profile.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.02)`;
            profile.style.transition = 'transform 0.1s ease';
        }
    });

    document.addEventListener('mouseleave', function() {
        if (profile) {
            profile.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
        }
    });
});

// ============================================
// EFECTO 3D EN TODAS LAS CARDS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.project-card, .stat-card, .exp-item, .skill-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const rotateX = (y - 0.5) * 10;
            const rotateY = (x - 0.5) * 10;
            
            this.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            this.style.transition = 'transform 0.15s ease';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            this.style.transition = 'transform 0.4s ease';
        });
    });
});

// ============================================
// ANIMACIÓN DE BARRAS DE PROGRESO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const percentage = bar.getAttribute('data-percentage');
                    if (percentage) {
                        bar.style.width = `${percentage}%`;
                    }
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });
        progressBars.forEach(bar => observer.observe(bar));
    }
});

// ============================================
// CONTADORES ANIMADOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        if (isNaN(target)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let current = 0;
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, 30);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(counter);
    });
});

// ============================================
// EFECTO GLOW PULSANTE EN PERFIL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const profile = document.querySelector('.profile-placeholder');
    if (profile) {
        setInterval(() => {
            profile.style.transition = 'box-shadow 2s ease-in-out';
            profile.style.boxShadow = '0 0 80px rgba(244, 63, 126, 0.5), 0 0 160px rgba(124, 58, 237, 0.5), 0 0 200px rgba(6, 214, 160, 0.2)';
            setTimeout(() => {
                profile.style.boxShadow = '0 0 60px rgba(244, 63, 126, 0.3), 0 0 120px rgba(124, 58, 237, 0.3)';
            }, 2000);
        }, 3000);
    }
});

// ============================================
// ANIMACIÓN DE SKILLS AL CARGAR
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, 100 + (index * 50));
    });
});

// ============================================
// ANIMACIÓN DE ENTRADA DEL HERO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateX(-50px)';
        heroText.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateX(0)';
        }, 300);
    }
    
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px)';
        heroImage.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 500);
    }
});

// ============================================
// VALIDACIÓN DE FORMULARIO DE CONTACTO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const name = document.getElementById('contactName');
            const email = document.getElementById('contactEmail');
            const message = document.getElementById('contactMessage');

            if (!name || !email || !message) {
                console.error('Missing form fields');
                return;
            }

            const nameValue = name.value.trim();
            const emailValue = email.value.trim();
            const messageValue = message.value.trim();

            if (!nameValue || !emailValue || !messageValue) {
                e.preventDefault();
                showNotification('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            if (!emailValue.includes('@') || !emailValue.includes('.')) {
                e.preventDefault();
                showNotification('Por favor, ingresa un correo electrónico válido.', 'error');
                return;
            }

            if (messageValue.length < 10) {
                e.preventDefault();
                showNotification('Por favor, escribe un mensaje más detallado (mínimo 10 caracteres).', 'error');
                return;
            }

            const button = this.querySelector('button[type="submit"]');
            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                button.disabled = true;
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 3000);
            }
        });
    }
});

// ============================================
// NOTIFICACIONES
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showNotification('Mensaje enviado con éxito. Te responderé pronto.', 'success');
    }
});

function showNotification(message, type = 'info') {
    const colors = {
        success: '#06d6a0',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(7, 7, 10, 0.95);
        border: 1px solid ${colors[type]};
        color: ${colors[type]};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        animation: slideInRight 0.5s ease;
        backdrop-filter: blur(10px);
    `;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}" 
           style="margin-right: 0.5rem;"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// ============================================
// ESTILOS DINÁMICOS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes gradShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .navbar {
            transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .profile-placeholder {
            transition: transform 0.1s ease;
        }
        .skill-item, .project-card, .stat-card, .exp-item {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .section {
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .project-card {
            position: relative;
            --glow-x: 50%;
            --glow-y: 50%;
        }
        .project-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 20px;
            background: radial-gradient(
                circle at var(--glow-x) var(--glow-y),
                rgba(244, 63, 126, 0.08) 0%,
                transparent 60%
            );
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.4s ease;
        }
        .project-card:hover::after {
            opacity: 1;
        }
        .btn-primary {
            position: relative;
            overflow: hidden;
        }
        .btn-primary::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
            transform: translateX(-100%) rotate(45deg);
            transition: transform 0.8s ease;
        }
        .btn-primary:hover::after {
            transform: translateX(100%) rotate(45deg);
        }
    `;
    document.head.appendChild(style);
});

console.log('🚀 Portafolio cargado con efectos épicos');