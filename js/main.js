// ============================================
// LOADING SCREEN - CON EFECTO DE ONDA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
        position: fixed;
        inset: 0;
        background: #0a0a0f;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.8s ease, visibility 0.8s ease;
        overflow: hidden;
    `;
    
    // Fondo de partículas en el loader
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    `;
    loader.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let loaderParticles = [];
    
    function resizeLoaderCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeLoaderCanvas();
    window.addEventListener('resize', resizeLoaderCanvas);
    
    for (let i = 0; i < 80; i++) {
        loaderParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5
        });
    }
    
    function animateLoaderParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        loaderParticles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(animateLoaderParticles);
    }
    animateLoaderParticles();
    
    loader.innerHTML += `
        <div style="position: relative; z-index: 2; text-align: center;">
            <div style="font-size: 4.5rem; font-weight: 800; margin-bottom: 2rem; letter-spacing: -2px; position: relative;">
                <span style="background: linear-gradient(135deg, #7c3aed, #a78bfa, #7c3aed); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradShift 3s ease infinite;">AureumDev</span>
                <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 60%; height: 2px; background: linear-gradient(90deg, transparent, #7c3aed, transparent);"></div>
            </div>
            <div style="width: 300px; height: 3px; background: rgba(124, 58, 237, 0.1); border-radius: 4px; overflow: hidden; position: relative; margin: 0 auto;">
                <div id="loaderBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed); background-size: 200% 200%; border-radius: 4px; transition: width 0.3s ease; animation: gradShift 1.5s ease infinite; box-shadow: 0 0 40px rgba(124, 58, 237, 0.3);"></div>
            </div>
            <div style="margin-top: 1.5rem; color: #6b6b8a; font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase; position: relative;">
                <span id="loaderText">Inicializando</span>
                <span style="display: inline-block; width: 12px; text-align: left;">
                    <span id="loaderDots">.</span>
                </span>
            </div>
        </div>
    `;
    
    document.body.prepend(loader);
    
    // Texto dinámico del loader
    const loaderTexts = ['Conectando neuronas', 'Cargando creatividad', 'Compilando código', 'Ajustando píxeles', 'Listo!'];
    let textIndex = 0;
    let progress = 0;
    const bar = document.getElementById('loaderBar');
    const textEl = document.getElementById('loaderText');
    const dotsEl = document.getElementById('loaderDots');
    let dotCount = 0;
    
    const textInterval = setInterval(() => {
        if (textIndex < loaderTexts.length - 1) {
            textIndex++;
            textEl.textContent = loaderTexts[textIndex];
        }
    }, 400);
    
    const dotInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        dotsEl.textContent = '.'.repeat(dotCount);
    }, 300);
    
    const interval = setInterval(() => {
        progress += Math.random() * 6 + 1;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            clearInterval(textInterval);
            clearInterval(dotInterval);
            textEl.textContent = '¡Listo!';
            dotsEl.textContent = '';
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
                document.body.style.overflow = 'auto';
            }, 600);
        }
        bar.style.width = progress + '%';
    }, 120);
    
    document.body.style.overflow = 'hidden';
});

// ============================================
// EFECTO MATRIX EN BACKGROUND DEL HERO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.03;
    `;
    hero.style.position = 'relative';
    hero.insertBefore(matrixCanvas, hero.firstChild);
    
    const mctx = matrixCanvas.getContext('2d');
    let matrixWidth, matrixHeight, columns, drops;
    
    function resizeMatrix() {
        matrixWidth = matrixCanvas.width = hero.offsetWidth;
        matrixHeight = matrixCanvas.height = hero.offsetHeight;
        columns = Math.floor(matrixWidth / 14);
        drops = Array(columns).fill(1);
    }
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);
    
    const matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    function drawMatrix() {
        mctx.fillStyle = 'rgba(248, 247, 252, 0.05)';
        mctx.fillRect(0, 0, matrixWidth, matrixHeight);
        mctx.fillStyle = '#7c3aed';
        mctx.font = '14px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            mctx.fillText(char, i * 14, drops[i] * 14);
            if (drops[i] * 14 > matrixHeight && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
});

// ============================================
// SISTEMA DE PARTÍCULAS 3D CON EFECTO TSUNAMI
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCanvas = document.createElement('canvas');
    particleCanvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    hero.insertBefore(particleCanvas, hero.firstChild);
    
    const pctx = particleCanvas.getContext('2d');
    let particles3D = [];
    let mouseX = 0, mouseY = 0;
    
    function resizeParticleCanvas() {
        particleCanvas.width = hero.offsetWidth;
        particleCanvas.height = hero.offsetHeight;
    }
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);
    
    class Particle3D {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.z = Math.random() * 200;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.speedZ = (Math.random() - 0.5) * 1.5;
            this.angle = Math.random() * Math.PI * 2;
            this.radius = Math.random() * 150 + 50;
            this.phase = Math.random() * Math.PI * 2;
        }
        
        update(time) {
            // Movimiento ondulatorio tipo tsunami
            this.x += Math.sin(time * 0.001 + this.phase) * 0.3;
            this.y += Math.cos(time * 0.0012 + this.phase) * 0.3;
            this.z += Math.sin(time * 0.002 + this.phase) * 0.5;
            
            // Atracción al mouse
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const force = (200 - dist) / 200 * 0.02;
                this.x += dx * force;
                this.y += dy * force;
            }
            
            // Limites
            if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
            if (this.z < 0 || this.z > 200) this.speedZ *= -1;
        }
        
        draw(time) {
            const scale = 1 + this.z / 500;
            const size = this.size * scale;
            const opacity = 0.2 + (this.z / 200) * 0.5;
            
            pctx.beginPath();
            pctx.arc(this.x, this.y, size, 0, Math.PI * 2);
            
            // Gradiente según profundidad
            const gradient = pctx.createRadialGradient(
                this.x - size/2, this.y - size/2, 0,
                this.x, this.y, size
            );
            gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(124, 58, 237, ${opacity * 0.2})`);
            pctx.fillStyle = gradient;
            pctx.fill();
            
            // Conexiones entre partículas cercanas con efecto de onda
            for (let i = 0; i < particles3D.length; i++) {
                const other = particles3D[i];
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                const dz = this.z - other.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (dist < 150) {
                    const alpha = 0.06 * (1 - dist/150) * (0.5 + Math.sin(time * 0.002 + this.phase) * 0.5);
                    pctx.beginPath();
                    pctx.moveTo(this.x, this.y);
                    pctx.lineTo(other.x, other.y);
                    pctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
                    pctx.lineWidth = 0.5;
                    pctx.stroke();
                }
            }
        }
    }
    
    for (let i = 0; i < 150; i++) {
        particles3D.push(new Particle3D());
    }
    
    // Seguimiento del mouse
    document.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    let animTime = 0;
    function animateParticles3D() {
        pctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        animTime++;
        
        particles3D.forEach(p => {
            p.update(animTime);
            p.draw(animTime);
        });
        
        requestAnimationFrame(animateParticles3D);
    }
    animateParticles3D();
});

// ============================================
// EFECTO TEXTO MÁQUINA DE ESCRIBIR - CORREGIDO COMPLETO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const highlight = document.querySelector('.hero-text h1 .highlight');
    if (!highlight) return;
    
    // El texto original completo con espacios
    const fullText = "Luis Naal Pacheco";
    
    // Asegurar que el texto esté completo en el HTML
    highlight.textContent = fullText;
    
    // Limpiar y comenzar efecto
    const text = highlight.textContent;
    highlight.textContent = '';
    let i = 0;
    
    // Añadir estilo para evitar cortes
    highlight.style.cssText = `
        display: inline-block;
        white-space: nowrap;
        min-width: 100%;
    `;
    
    const cursor = document.createElement('span');
    cursor.style.cssText = `
        display: inline-block;
        width: 3px;
        height: 1.2em;
        background: linear-gradient(180deg, #7c3aed, #a78bfa);
        margin-left: 2px;
        animation: blinkCursor 0.8s infinite;
        vertical-align: text-bottom;
        box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
    `;
    highlight.appendChild(cursor);
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes blinkCursor {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        @keyframes gradShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(styleSheet);
    
    function typeWriter() {
        if (i < text.length) {
            const char = text.charAt(i);
            const span = document.createElement('span');
            
            // Preservar espacios correctamente
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
                span.style.display = 'inline-block';
                span.style.width = '0.4em';
            } else {
                span.textContent = char;
                span.style.cssText = `
                    background: linear-gradient(135deg, #7c3aed, #a78bfa, #7c3aed);
                    background-size: 300% 300%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradShift 2s ease infinite;
                    display: inline-block;
                    text-shadow: 0 0 30px rgba(124, 58, 237, 0.1);
                `;
            }
            
            highlight.insertBefore(span, cursor);
            i++;
            
            // Efecto glitch solo en caracteres (no en espacios)
            if (char !== ' ' && Math.random() > 0.85) {
                const glitch = document.createElement('span');
                glitch.textContent = char;
                glitch.style.cssText = `
                    position: absolute;
                    opacity: 0.15;
                    color: #7c3aed;
                    transform: translate(${Math.random()*6-3}px, ${Math.random()*6-3}px);
                    font-size: 1.05em;
                    pointer-events: none;
                    filter: blur(1px);
                    z-index: -1;
                `;
                highlight.appendChild(glitch);
                setTimeout(() => glitch.remove(), 150);
            }
            
            const delay = 30 + Math.random() * 40;
            setTimeout(typeWriter, delay);
        } else {
            // Asegurar que el texto completo está visible
            setTimeout(() => {
                cursor.style.animation = 'none';
                cursor.style.opacity = '0';
                highlight.style.textShadow = '0 0 40px rgba(124, 58, 237, 0.2), 0 0 80px rgba(124, 58, 237, 0.1)';
                
                // Verificar que el texto esté completo
                console.log('Texto completo mostrado:', text);
            }, 500);
        }
    }
    
    // Pequeño delay antes de comenzar
    setTimeout(typeWriter, 400);
});

// ============================================
// EFECTO DE ONDA EN EL HERO (MUCHAS ONDAS)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const waveContainer = document.createElement('div');
    waveContainer.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 200px;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
    `;
    hero.appendChild(waveContainer);
    
    // Crear múltiples capas de ondas SVG
    const numWaves = 3;
    const colors = [
        'rgba(124, 58, 237, 0.03)',
        'rgba(139, 92, 246, 0.04)',
        'rgba(167, 139, 250, 0.02)'
    ];
    
    for (let w = 0; w < numWaves; w++) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 1440 320');
        svg.style.cssText = `
            position: absolute;
            bottom: ${w * -30}px;
            left: 0;
            width: 100%;
            height: ${200 + w * 50}px;
            opacity: ${1 - w * 0.15};
            animation: waveFloat ${15 + w * 5}s ease-in-out infinite alternate;
        `;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M0,${192 + w * 30} C${360 + w * 100},${132 + w * 30} ${720 + w * 80},${252 + w * 20} ${1080 + w * 60},${192 + w * 30} L${1440 + w * 40},${192 + w * 30} L1440,320 L0,320 Z`;
        path.setAttribute('d', d);
        path.setAttribute('fill', colors[w]);
        svg.appendChild(path);
        
        waveContainer.appendChild(svg);
    }
    
    // Estilos de animación
    const waveStyle = document.createElement('style');
    waveStyle.textContent = `
        @keyframes waveFloat {
            0% { transform: translateX(-50px) scaleY(0.95); }
            100% { transform: translateX(50px) scaleY(1.05); }
        }
    `;
    document.head.appendChild(waveStyle);
});

// ============================================
// CARDS CON EFECTO DE REFRACCIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.project-card, .skill-item, .exp-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // Rotación 3D
            const rotateX = (y - 0.5) * 20;
            const rotateY = (x - 0.5) * 20;
            
            // Distorsión de refracción
            const distortX = (x - 0.5) * 20;
            const distortY = (y - 0.5) * 20;
            
            // Efecto de brillo que sigue al mouse
            this.style.setProperty('--mouse-x', `${x * 100}%`);
            this.style.setProperty('--mouse-y', `${y * 100}%`);
            
            this.style.transform = `
                perspective(1200px)
                rotateX(${-rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.05)
                translateZ(20px)
            `;
            this.style.transition = 'transform 0.05s ease';
            
            // Efecto de refracción en el borde
            this.style.boxShadow = `
                ${distortX}px ${distortY}px 40px rgba(124, 58, 237, 0.1),
                0 0 60px rgba(124, 58, 237, 0.05)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
            this.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.style.boxShadow = 'none';
        });
    });
});

// ============================================
// ANIMACIÓN DE CÍRCULOS CONCÉNTRICOS EN SKILLS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        // Crear fondo de círculos concéntricos
        const container = document.createElement('div');
        container.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120%;
            height: 120%;
            pointer-events: none;
            z-index: -1;
        `;
        item.style.position = 'relative';
        item.insertBefore(container, item.firstChild);
        
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement('div');
            const size = 80 + i * 40;
            const delay = i * 0.5;
            circle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${size}px;
                height: ${size}px;
                border: 1px solid rgba(124, 58, 237, ${0.04 - i * 0.01});
                border-radius: 50%;
                animation: pulseCircle ${4 + i * 1}s ease-in-out infinite ${delay}s;
            `;
            container.appendChild(circle);
        }
    });
    
    const circleStyle = document.createElement('style');
    circleStyle.textContent = `
        @keyframes pulseCircle {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
    `;
    document.head.appendChild(circleStyle);
});

// ============================================
// EFECTO DE CONFIDENCIA EN TEXTO (HOVER 3D)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const titles = document.querySelectorAll('h1, h2, h3');
    titles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            this.style.transform = 'skewX(-2deg) scale(1.02)';
            this.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.style.textShadow = '0 0 40px rgba(124, 58, 237, 0.15)';
        });
        title.addEventListener('mouseleave', function() {
            this.style.transform = 'skewX(0deg) scale(1)';
            this.style.transition = 'transform 0.4s ease';
            this.style.textShadow = 'none';
        });
    });
});

// ============================================
// EFFECT DE SCROLL PROGRESS BAR (CUSTOM)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed);
        background-size: 200% 200%;
        z-index: 99999;
        width: 0%;
        transition: width 0.1s ease;
        box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
        animation: gradShift 2s ease infinite;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
});

// ============================================
// EFECTO DE PARALLAX EN TODAS LAS SECCIONES
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                sections.forEach((section, index) => {
                    const speed = 0.05 + (index % 3) * 0.02;
                    const yPos = (scrollY - section.offsetTop) * speed;
                    section.style.transform = `translateY(${yPos}px)`;
                    section.style.opacity = Math.min(1, Math.max(0, 1 - Math.abs(yPos) / 500));
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
});

// ============================================
// EFECTO DE TIPEO EN EL FOOTER
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    const footerText = footer.querySelector('p');
    if (!footerText) return;
    
    const originalText = footerText.textContent;
    footerText.textContent = '';
    
    let charIndex = 0;
    const typeFooter = () => {
        if (charIndex < originalText.length) {
            footerText.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeFooter, 30 + Math.random() * 20);
        }
    };
    
    // Esperar a que el usuario llegue al footer
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && charIndex === 0) {
                typeFooter();
                footerObserver.unobserve(footer);
            }
        });
    }, { threshold: 0.3 });
    footerObserver.observe(footer);
});

console.log('🔥 Portfolio cargado con efectos de nivel élite');
console.log('⭐ Código optimizado para impresionar reclutadores');