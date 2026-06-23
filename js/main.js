(() => {
  'use strict';
  
  const COLORS = {
    primary: '#7c3aed',
    secondary: '#a78bfa',
    dark: '#0a0a0f'
  };

  const createStyles = (styles) => {
    const style = document.createElement('style');
    style.textContent = styles;
    document.head.appendChild(style);
    return style;
  };

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  createStyles(`
    @keyframes gradShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.2); }
    }
    @keyframes floatParticle {
      0% { transform: translateY(0px) rotate(0deg); }
      100% { transform: translateY(-100px) rotate(360deg); }
    }
    @keyframes rippleEffect {
      0% { transform: scale(0); opacity: 0.8; }
      100% { transform: scale(4); opacity: 0; }
    }
    @keyframes morphShape {
      0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
      25% { border-radius: 58% 42% 75% 25% / 43% 58% 42% 57%; }
      50% { border-radius: 20% 80% 55% 45% / 55% 35% 65% 45%; }
      75% { border-radius: 45% 55% 30% 70% / 40% 50% 50% 60%; }
      100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
    }
    @keyframes textGlitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(2px, -2px); }
      60% { transform: translate(-1px, -1px); }
      80% { transform: translate(1px, 1px); }
      100% { transform: translate(0); }
    }
  `);

  class LoaderManager {
    constructor() {
      this.loader = null;
      this.particles = [];
      this.init();
    }

    init() {
      this.loader = document.createElement('div');
      this.loader.id = 'loader';
      this.loader.style.cssText = `
        position: fixed; inset: 0; background: ${COLORS.dark};
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; z-index: 99999;
        transition: opacity 0.8s ease, visibility 0.8s ease;
        overflow: hidden;
      `;

      const canvas = this.createParticleCanvas();
      this.loader.appendChild(canvas);
      this.setupParticles(canvas);
      this.createLoaderContent();
      
      document.body.prepend(this.loader);
      document.body.style.overflow = 'hidden';
      this.startProgress();
    }

    createParticleCanvas() {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = `
        position: absolute; top: 0; left: 0;
        width: 100%; height: 100%; pointer-events: none;
      `;
      this.resizeCanvas(canvas);
      window.addEventListener('resize', () => this.resizeCanvas(canvas));
      return canvas;
    }

    resizeCanvas(canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    setupParticles(canvas) {
      const ctx = canvas.getContext('2d');
      const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
      
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.particles.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124, 58, 237, ${p.opacity})`;
          ctx.fill();
        });
        requestAnimationFrame(animate);
      };
      animate();
    }

    createLoaderContent() {
      this.loader.innerHTML += `
        <div style="position: relative; z-index: 2; text-align: center;">
          <div style="font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 800; margin-bottom: 2rem; letter-spacing: -2px; position: relative;">
            <span style="background: linear-gradient(135deg, #7c3aed, #a78bfa, #7c3aed); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradShift 3s ease infinite;">AureumDev</span>
            <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 60%; height: 2px; background: linear-gradient(90deg, transparent, #7c3aed, transparent);"></div>
          </div>
          <div style="width: min(300px, 80vw); height: 3px; background: rgba(124, 58, 237, 0.1); border-radius: 4px; overflow: hidden; position: relative; margin: 0 auto;">
            <div id="loaderBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed); background-size: 200% 200%; border-radius: 4px; transition: width 0.3s ease; animation: gradShift 1.5s ease infinite; box-shadow: 0 0 40px rgba(124, 58, 237, 0.3);"></div>
          </div>
          <div style="margin-top: 1.5rem; color: #6b6b8a; font-size: clamp(0.6rem, 1.5vw, 0.7rem); letter-spacing: 3px; text-transform: uppercase;">
            <span id="loaderText">Inicializando</span>
            <span id="loaderDots" style="display: inline-block; width: 12px; text-align: left;">.</span>
          </div>
        </div>
      `;
    }

    startProgress() {
      const texts = ['Conectando neuronas', 'Cargando creatividad', 'Compilando codigo', 'Ajustando pixeles', 'Listo'];
      let textIndex = 0, progress = 0;
      const bar = document.getElementById('loaderBar');
      const textEl = document.getElementById('loaderText');
      const dotsEl = document.getElementById('loaderDots');
      let dotCount = 0;

      const textInterval = setInterval(() => {
        if (textIndex < texts.length - 1) {
          textEl.textContent = texts[++textIndex];
        }
      }, 400);

      const dotInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        dotsEl.textContent = '.'.repeat(dotCount);
      }, 300);

      const progressInterval = setInterval(() => {
        progress += Math.random() * 6 + 1;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          clearInterval(textInterval);
          clearInterval(dotInterval);
          textEl.textContent = 'Listo';
          dotsEl.textContent = '';
          setTimeout(() => {
            this.loader.style.opacity = '0';
            this.loader.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
          }, 600);
        }
        bar.style.width = progress + '%';
      }, 120);
    }
  }

  class ParticleSystem {
    constructor(container, count = 150) {
      this.container = container;
      this.count = count;
      this.particles = [];
      this.mouseX = 0;
      this.mouseY = 0;
      this.init();
    }

    init() {
      this.canvas = document.createElement('canvas');
      this.canvas.style.cssText = `
        position: absolute; top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none; z-index: 1;
      `;
      this.container.insertBefore(this.canvas, this.container.firstChild);
      this.ctx = this.canvas.getContext('2d');
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
      
      for (let i = 0; i < this.count; i++) {
        this.particles.push(new Particle3D(this.canvas.width, this.canvas.height));
      }

      this.setupMouseTracking();
      this.animate();
    }

    resize() {
      this.canvas.width = this.container.offsetWidth;
      this.canvas.height = this.container.offsetHeight;
    }

    setupMouseTracking() {
      document.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
      });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const time = Date.now();
      
      this.particles.forEach(p => {
        p.update(time, this.mouseX, this.mouseY, this.canvas.width, this.canvas.height);
        p.draw(this.ctx, time);
      });

      this.drawConnections(this.ctx, time);
      requestAnimationFrame(() => this.animate());
    }

    drawConnections(ctx, time) {
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            const alpha = 0.08 * (1 - dist / 120) * (0.5 + Math.sin(time * 0.001 + i) * 0.5);
            ctx.beginPath();
            ctx.moveTo(this.particles[i].x, this.particles[i].y);
            ctx.lineTo(this.particles[j].x, this.particles[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }
  }

  class Particle3D {
    constructor(width, height) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = Math.random() * 200;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.phase = Math.random() * Math.PI * 2;
      this.originalX = this.x;
      this.originalY = this.y;
    }

    update(time, mouseX, mouseY, width, height) {
      this.x += Math.sin(time * 0.0008 + this.phase) * 0.4;
      this.y += Math.cos(time * 0.001 + this.phase) * 0.4;
      this.z += Math.sin(time * 0.0015 + this.phase) * 0.3;

      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.03;
        this.x += dx * force;
        this.y += dy * force;
      }

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw(ctx, time) {
      const scale = 1 + this.z / 400;
      const size = this.size * scale;
      const opacity = 0.3 + (this.z / 200) * 0.5;
      
      const gradient = ctx.createRadialGradient(
        this.x - size/2, this.y - size/2, 0,
        this.x, this.y, size
      );
      gradient.addColorStop(0, `rgba(139, 92, 246, ${opacity})`);
      gradient.addColorStop(1, `rgba(124, 58, 237, ${opacity * 0.3})`);
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      if (size > 2) {
        ctx.shadowColor = 'rgba(124, 58, 237, 0.3)';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  class TypeWriterEffect {
    constructor(element, text, speed = 30) {
      this.element = element;
      this.text = text;
      this.speed = speed;
      this.index = 0;
      this.init();
    }

    init() {
      this.element.textContent = '';
      this.element.style.cssText = `
        display: inline-block;
        white-space: nowrap;
        min-width: 100%;
        position: relative;
      `;

      this.cursor = document.createElement('span');
      this.cursor.style.cssText = `
        display: inline-block;
        width: 3px;
        height: 1.2em;
        background: linear-gradient(180deg, #7c3aed, #a78bfa);
        margin-left: 2px;
        animation: blinkCursor 0.8s infinite;
        vertical-align: text-bottom;
        box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
      `;
      this.element.appendChild(this.cursor);

      this.addCursorStyles();
      this.startTyping();
    }

    addCursorStyles() {
      const styles = document.createElement('style');
      styles.textContent = `
        @keyframes blinkCursor {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `;
      document.head.appendChild(styles);
    }

    startTyping() {
      const type = () => {
        if (this.index < this.text.length) {
          const char = this.text.charAt(this.index);
          const span = document.createElement('span');
          
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
            `;
          }
          
          this.element.insertBefore(span, this.cursor);
          this.index++;
          
          if (char !== ' ' && Math.random() > 0.9) {
            this.createGlitchEffect(char);
          }
          
          setTimeout(type, this.speed + Math.random() * 40);
        } else {
          setTimeout(() => {
            this.cursor.style.animation = 'none';
            this.cursor.style.opacity = '0';
          }, 500);
        }
      };
      
      setTimeout(type, 400);
    }

    createGlitchEffect(char) {
      const glitch = document.createElement('span');
      glitch.textContent = char;
      glitch.style.cssText = `
        position: absolute;
        opacity: 0.15;
        color: #7c3aed;
        transform: translate(${Math.random()*8-4}px, ${Math.random()*8-4}px);
        font-size: 1.1em;
        pointer-events: none;
        filter: blur(1px);
        z-index: -1;
      `;
      this.element.appendChild(glitch);
      setTimeout(() => glitch.remove(), 150);
    }
  }

  class WaveAnimation {
    constructor(container, layers = 3) {
      this.container = container;
      this.layers = layers;
      this.init();
    }

    init() {
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
      this.container.appendChild(waveContainer);

      const colors = [
        'rgba(124, 58, 237, 0.04)',
        'rgba(139, 92, 246, 0.05)',
        'rgba(167, 139, 250, 0.03)'
      ];

      for (let w = 0; w < this.layers; w++) {
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
        const offset = w * 30;
        path.setAttribute('d', `
          M0,${192 + offset}
          C${360 + w * 100},${132 + offset}
          ${720 + w * 80},${252 + offset}
          ${1080 + w * 60},${192 + offset}
          L${1440 + w * 40},${192 + offset}
          L1440,320 L0,320 Z
        `);
        path.setAttribute('fill', colors[w]);
        svg.appendChild(path);
        waveContainer.appendChild(svg);
      }

      createStyles(`
        @keyframes waveFloat {
          0% { transform: translateX(-30px) scaleY(0.95); }
          100% { transform: translateX(30px) scaleY(1.05); }
        }
      `);
    }
  }

  class Card3DEffect {
    constructor(selector) {
      this.cards = document.querySelectorAll(selector);
      this.init();
    }

    init() {
      this.cards.forEach(card => {
        card.addEventListener('mousemove', this.handleMove.bind(this));
        card.addEventListener('mouseleave', this.handleLeave.bind(this));
      });
    }

    handleMove(e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const rotateX = (y - 0.5) * 25;
      const rotateY = (x - 0.5) * 25;
      
      e.currentTarget.style.transform = `
        perspective(1200px)
        rotateX(${-rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.05)
        translateZ(20px)
      `;
      e.currentTarget.style.transition = 'transform 0.05s ease';
      
      e.currentTarget.style.boxShadow = `
        ${(x - 0.5) * 30}px ${(y - 0.5) * 30}px 50px rgba(124, 58, 237, 0.15),
        0 0 80px rgba(124, 58, 237, 0.05)
      `;
    }

    handleLeave(e) {
      e.currentTarget.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
      e.currentTarget.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      e.currentTarget.style.boxShadow = 'none';
    }
  }

  class ScrollProgress {
    constructor() {
      this.bar = null;
      this.init();
    }

    init() {
      this.bar = document.createElement('div');
      this.bar.style.cssText = `
        position: fixed; top: 0; left: 0;
        height: 3px;
        background: linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed);
        background-size: 200% 200%;
        z-index: 99999;
        width: 0%;
        transition: width 0.1s ease;
        box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
        animation: gradShift 2s ease infinite;
      `;
      document.body.appendChild(this.bar);
      
      window.addEventListener('scroll', this.update.bind(this), { passive: true });
    }

    update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      this.bar.style.width = progress + '%';
    }
  }

  class ParallaxEffect {
    constructor(selector) {
      this.sections = document.querySelectorAll(selector);
      this.ticking = false;
      this.init();
    }

    init() {
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }

    handleScroll() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          this.sections.forEach((section, index) => {
            const speed = 0.05 + (index % 3) * 0.02;
            const yPos = (scrollY - section.offsetTop) * speed;
            section.style.transform = `translateY(${yPos}px)`;
            section.style.opacity = Math.min(1, Math.max(0, 1 - Math.abs(yPos) / 500));
          });
          this.ticking = false;
        });
        this.ticking = true;
      }
    }
  }

  class FloatingShapes {
    constructor(container, count = 15) {
      this.container = container;
      this.count = count;
      this.init();
    }

    init() {
      const container = document.createElement('div');
      container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
      `;
      this.container.insertBefore(container, this.container.firstChild);

      const shapes = ['circle', 'square', 'triangle'];
      for (let i = 0; i < this.count; i++) {
        const shape = document.createElement('div');
        const size = Math.random() * 60 + 20;
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        
        let clipPath = 'circle(50%)';
        if (shapeType === 'square') clipPath = 'none';
        if (shapeType === 'triangle') {
          clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
        }

        shape.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          ${shapeType === 'square' ? `background: rgba(124, 58, 237, ${Math.random() * 0.05 + 0.02});` : 
           shapeType === 'circle' ? `background: radial-gradient(circle, rgba(124, 58, 237, 0.05), rgba(124, 58, 237, 0.01));` :
           `background: linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(167, 139, 250, 0.02));`}
          clip-path: ${clipPath};
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          animation: floatParticle ${15 + Math.random() * 20}s ease-in-out infinite;
          animation-delay: ${Math.random() * 5}s;
          transform: rotate(${Math.random() * 360}deg);
          border: ${shapeType === 'square' ? '1px solid rgba(124, 58, 237, 0.05)' : 'none'};
          backdrop-filter: blur(10px);
          border-radius: ${shapeType === 'circle' ? '50%' : shapeType === 'square' ? '4px' : '0'};
        `;
        container.appendChild(shape);
      }
    }
  }

  class GlitchText {
    constructor(element) {
      this.element = element;
      this.init();
    }

    init() {
      const text = this.element.textContent;
      this.element.textContent = '';
      
      const letters = text.split('');
      letters.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.cssText = `
          display: inline-block;
          transition: all 0.3s ease;
          animation: textGlitch ${0.5 + Math.random() * 0.5}s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
        `;
        
        if (char !== ' ' && Math.random() > 0.7) {
          span.style.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
          span.style.textShadow = `0 0 ${10 + Math.random() * 20}px currentColor`;
        }
        
        this.element.appendChild(span);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new LoaderManager();

    const hero = document.querySelector('.hero');
    if (hero) {
      new ParticleSystem(hero, 180);
      new WaveAnimation(hero, 4);
      new FloatingShapes(hero, 20);
    }

    const highlight = document.querySelector('.hero-text h1 .highlight');
    if (highlight) {
      new TypeWriterEffect(highlight, 'Luis Naal Pacheco', 25);
    }

    new Card3DEffect('.project-card, .skill-item, .exp-item');
    new ScrollProgress();
    new ParallaxEffect('.section');

    document.querySelectorAll('.glitch-text').forEach(el => new GlitchText(el));

    const footer = document.querySelector('footer p');
    if (footer) {
      new TypeWriterEffect(footer, footer.textContent, 20);
      footer.style.cssText = 'display: inline-block; min-width: 100%;';
    }
  });
})();