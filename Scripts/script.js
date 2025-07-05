document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const headerTitle = document.querySelector("header h1");
  const portfolioImages = document.querySelectorAll(".portfolio-gallery img");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  sections.forEach((section) => observer.observe(section));

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (headerTitle) {
      headerTitle.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  });

  const scrollBtn = document.createElement("button");
  scrollBtn.textContent = "↑ Top";
  scrollBtn.style.position = "fixed";
  scrollBtn.style.bottom = "40px";
  scrollBtn.style.right = "40px";
  scrollBtn.style.padding = "0.6rem 1rem";
  scrollBtn.style.fontSize = "1.2rem";
  scrollBtn.style.background = "var(--green)";
  scrollBtn.style.color = "var(--black)";
  scrollBtn.style.border = "none";
  scrollBtn.style.borderRadius = "8px";
  scrollBtn.style.cursor = "pointer";
  scrollBtn.style.boxShadow = "0 4px 10px var(--shadow)";
  scrollBtn.style.opacity = "0";
  scrollBtn.style.pointerEvents = "none";
  scrollBtn.style.transition = "opacity 0.4s ease";
  document.body.appendChild(scrollBtn);

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.style.opacity = "1";
      scrollBtn.style.pointerEvents = "auto";
    } else {
      scrollBtn.style.opacity = "0";
      scrollBtn.style.pointerEvents = "none";
    }
  });

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile) {
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");

    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 100;
    const MAX_DISTANCE = 120;
    const MOUSE_RADIUS = 100;

    const mouse = {
      x: null,
      y: null,
      radius: MOUSE_RADIUS,
      isDown: false,
    };

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.size = 2 + Math.random() * 1.5;
        this.baseSize = this.size;
        this.color = "rgba(194, 255, 235, 0.7)";
        this.opacity = 0;
        this.opacitySpeed = 0.0001 + Math.random() * 0.02;
        this.opacityDirection = 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        this.opacity += this.opacitySpeed * this.opacityDirection;
        if (this.opacity >= 1) this.opacityDirection = -1;
        if (this.opacity <= 0) {
          this.opacityDirection = 1;
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.8;
          this.vy = (Math.random() - 0.5) * 0.8;
          this.size = 2 + Math.random() * 1.5;
          this.baseSize = this.size;
        }
        this.size = this.baseSize + Math.sin(Date.now() / 300 + this.x) * 0.3;
        if (mouse.x !== null && mouse.y !== null) {
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            let angle = Math.atan2(dy, dx);
            let force = (mouse.radius - dist) / mouse.radius;
            if (mouse.isDown) {
              this.vx -= Math.cos(angle) * force * 0.5;
              this.vy -= Math.sin(angle) * force * 0.5;
            } else {
              this.vx += Math.cos(angle) * force * 0.6;
              this.vy += Math.sin(angle) * force * 0.6;
            }
          }
        }
        this.vx *= 0.95;
        this.vy *= 0.95;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(194, 255, 235, ${this.opacity})`;
        ctx.shadowColor = `rgba(0, 255, 180, ${this.opacity * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DISTANCE) {
            let opacity =
              (1 - dist / MAX_DISTANCE) *
              particles[a].opacity *
              particles[b].opacity;
            ctx.strokeStyle = `rgba(194, 255, 235, ${opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseout", () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener("mousedown", (e) => {
      mouse.isDown = true;
      const maxParticles = 100;
      const particlesToAdd = 5;

      while (particles.length + particlesToAdd > maxParticles) {
        particles.shift();
      }

      for (let i = 0; i < particlesToAdd; i++) {
        const p = new Particle();
        p.x = e.clientX + (Math.random() - 0.5) * 50;
        p.y = e.clientY + (Math.random() - 0.5) * 50;
        p.vx = (Math.random() - 0.5) * 3;
        p.vy = (Math.random() - 0.5) * 3;
        p.opacity = 1;
        p.opacityDirection = -1;
        particles.push(p);
      }
    });

    window.addEventListener("mouseup", () => {
      mouse.isDown = false;
    });
  }
});

window.addEventListener("load", () => {
  const music = document.getElementById("background-music");
  const toggleBtn = document.getElementById("music-toggle");

  toggleBtn.textContent = "🔇";

  toggleBtn.addEventListener("click", () => {
    if (music.muted) {
      music.muted = false;
      music.play();
      toggleBtn.textContent = "🔊";
    } else {
      music.muted = true;
      toggleBtn.textContent = "🔇";
    }
  });
});
