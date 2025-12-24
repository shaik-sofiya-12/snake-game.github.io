/* ===================== BACKGROUND ANIMATIONS ===================== */

// Initialize background animations
function initBackground() {
    createStars();
    createLasers();
    createParticles();
}

// Create twinkling stars
function createStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;

    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'floating-star';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = Math.random() * 100 + 'vh';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = 1 + Math.random() * 4 + 's';
        container.appendChild(star);
    }
}

// Create sweeping laser beams
function createLasers() {
    const container = document.getElementById('lasersContainer');
    if (!container) return;

    for (let i = 0; i < 8; i++) {
        const laser = document.createElement('div');
        laser.className = 'laser-beam';
        laser.style.top = Math.random() * 100 + 'vh';
        laser.style.width = Math.random() * 100 + 200 + 'px';
        laser.style.setProperty('--rotate', Math.random() * 10 - 5 + 'deg');
        laser.style.animationDelay = Math.random() * 4 + 's';
        laser.style.animationDuration = 3 + Math.random() * 3 + 's';

        // Random color
        const colors = ['cyan', 'magenta', 'yellow'];
        laser.style.background = `linear-gradient(90deg, transparent, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;

        container.appendChild(laser);
    }
}

// Create orbiting particles
function createParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'color-particle';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.setProperty('--distance', Math.random() * 300 + 100 + 'px');
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = 8 + Math.random() * 8 + 's';

        // Random color
        const colors = ['#00f7ff', '#ff00ff', '#ffff00'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initBackground);