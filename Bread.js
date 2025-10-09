// ==UserScript==
// @name         Bread
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  much bread
// @author       Conduit
// @match        *://*/*
// @icon         https://pngimg.com/d/bread_PNG2233.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


//       config
    const IMAGE_URL = 'https://pngimg.com/d/bread_PNG2233.png';
    const NUM_PARTICLES = 100;
    const PARTICLE_SIZE = 20;
    const PARTICLE_SPEED = 0.5;
    const CURSOR_INFLUENCE_RADIUS = 100;
    const CURSOR_FORCE = 0.5;



    let particles = [];
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let canvas, ctx;
    function createParticle() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const vx = (Math.random() - 0.5) * PARTICLE_SPEED * 2;
        const vy = (Math.random() - 0.5) * PARTICLE_SPEED * 2;

        const img = new Image();
        img.src = IMAGE_URL;

        return { x, y, vx, vy, img, alpha: 1 };
    }

    function initCanvas() {
        canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '99999';
        document.body.appendChild(canvas);

        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function updateParticles() {
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.vx *= 0.99;
            p.vy *= 0.99;
            p.vx += (Math.random() - 0.5) * 0.05;
            p.vy += (Math.random() - 0.5) * 0.05;
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CURSOR_INFLUENCE_RADIUS) {
                const force = (CURSOR_INFLUENCE_RADIUS - distance) / CURSOR_INFLUENCE_RADIUS * CURSOR_FORCE;
                p.vx += (dx / distance) * force;
                p.vy += (dy / distance) * force;
            }
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -PARTICLE_SIZE) p.x = canvas.width + PARTICLE_SIZE;
            if (p.x > canvas.width + PARTICLE_SIZE) p.x = -PARTICLE_SIZE;
            if (p.y < -PARTICLE_SIZE) p.y = canvas.height + PARTICLE_SIZE;
            if (p.y > canvas.height + PARTICLE_SIZE) p.y = -PARTICLE_SIZE;
        }
    }
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            if (p.img.complete) {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.drawImage(p.img, p.x - PARTICLE_SIZE / 2, p.y - PARTICLE_SIZE / 2, PARTICLE_SIZE, PARTICLE_SIZE);
                ctx.restore();
            }
        }
    }
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    initCanvas();
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(createParticle());
    }
    animate();
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    console.log(`Image Particle Effect loaded with image: ${IMAGE_URL}`);
})();
