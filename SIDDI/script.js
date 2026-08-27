/* ==========================================
   CONFIG & GLOBAL VARIABLES
   ========================================== */
   const SECRET_PIN = "2024"; // Easily change the 4-digit PIN here

   const LETTER_TEXT = `Happy rakhi to my bestest sisters🤭🎀 im soo glad to have you as my sisters🤌😭..even were are cousin's but you guys meant lot to me that my real bhai🤓!!!!lik bachpan se sth mei aur ab vishuu di Cs n sakshu di 12th mei omzii time fliess yrww but i miss humara bachpan like kaise we hv spend time during lock down 😭🤌...covid humare liye toh best gya h 😆 likee you guys are soo supportive n understanding mtlb now i feel i can share you everything i mean u should🤓 rhi baat wo block wli i am sorry😷 heheh- glti sbse hoti h yrww mei toh bhn hu apki pyaari si🤭🥰 Umm.....aur mujhe ni ate paragraph likhne😭 butt you guys are so special in my life i feel it everytime i hv spend with you guyss itss😭🤌🩷 cannot be expressed by wordss yrww🫶🫶 i wish hum log bade hokee travel kre msti krenn ans ese hi nani ka naam roshan krenn🫶🤞😭 like mera toh ni pta 💔🥲 just motivates me like you guys always do 👐 ...love youu guyss always😘🫶`;
   
   const RANDOM_MEMORIES = [
       "Remember the lockdown madness? 😂",
       "We really grew up way too fast 😭",
       "Still waiting for that future trip together ✈️",
       "Cousins officially, sisters emotionally. 🩷",
       "Some memories deserve unlimited replays.",
       "Block list drama is now legendary 😷🤭",
       "Nani ka naam roshan mode: ALWAYS ON 🤞"
   ];
   
   let currentPin = "";
   let currentImageIndex = 0;
   let isTyping = false;
   
   /* ==========================================
      DOM ELEMENTS
      ========================================== */
   const loadingScreen = document.getElementById('loading-screen');
   const progressBar = document.getElementById('progress-bar');
   const mainContent = document.getElementById('main-content');
   const openMemoriesBtn = document.getElementById('open-memories-btn');
   
   // Music & Theme
   const musicBtn = document.getElementById('music-btn');
   const bgMusic = document.getElementById('bg-music');
   const themeBtn = document.getElementById('theme-btn');
   
   // Gallery & Lightbox
   const photoFrames = document.querySelectorAll('.photo-frame');
   const lightbox = document.getElementById('lightbox');
   const lightboxImg = document.getElementById('lightbox-img');
   const lightboxClose = document.querySelector('.lightbox-close');
   const lightboxPrev = document.getElementById('lightbox-prev');
   const lightboxNext = document.getElementById('lightbox-next');
   
   // Letter
   const typewriterEl = document.getElementById('typewriter-text');
   const restartTypingBtn = document.getElementById('restart-typing-btn');
   
   // Bond Meter
   const meterFill = document.getElementById('meter-fill');
   
   // Random Generator
   const generateMemoryBtn = document.getElementById('generate-memory-btn');
   const memoryOutput = document.getElementById('memory-output');
   
   // PIN System
   const pinDots = document.querySelectorAll('.pin-dot');
   const keyBtns = document.querySelectorAll('.key-btn');
   const pinError = document.getElementById('pin-error');
   const pinCard = document.getElementById('pin-card');
   const unlockedContent = document.getElementById('unlocked-content');
   
   /* ==========================================
      1. LOADING SCREEN & INITIALIZATION
      ========================================== */
   window.addEventListener('DOMContentLoaded', () => {
       let progress = 0;
       const interval = setInterval(() => {
           progress += 15;
           if (progress > 100) progress = 100;
           progressBar.style.width = `${progress}%`;
   
           if (progress === 100) {
               clearInterval(interval);
               setTimeout(() => {
                   loadingScreen.classList.add('fade-out');
                   mainContent.classList.remove('hidden');
                   initScrollAnimations();
                   initAmbientCanvas();
               }, 500);
           }
       }, 200);
   
       // Setup stored theme
       const savedTheme = localStorage.getItem('theme') || 'light';
       document.documentElement.setAttribute('data-theme', savedTheme);
       themeBtn.querySelector('.btn-icon').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
   });
   
   /* ==========================================
      2. HERO BUTTON & CONFETTI
      ========================================== */
   openMemoriesBtn.addEventListener('click', () => {
       document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
       triggerConfetti();
   });
   
   function triggerConfetti() {
       if (typeof confetti === 'function') {
           confetti({
               particleCount: 80,
               spread: 70,
               origin: { y: 0.6 }
           });
       }
   }
   
   /* ==========================================
      3. GALLERY LIGHTBOX
      ========================================== */
   photoFrames.forEach((frame, index) => {
       frame.addEventListener('click', () => {
           currentImageIndex = index;
           openLightbox();
       });
   });
   
   function openLightbox() {
       const imgSrc = photoFrames[currentImageIndex].querySelector('img').src;
       lightboxImg.src = imgSrc;
       lightbox.classList.add('active');
   }
   
   lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
   
   lightboxPrev.addEventListener('click', () => {
       currentImageIndex = (currentImageIndex - 1 + photoFrames.length) % photoFrames.length;
       openLightbox();
   });
   
   lightboxNext.addEventListener('click', () => {
       currentImageIndex = (currentImageIndex + 1) % photoFrames.length;
       openLightbox();
   });
   
   lightbox.addEventListener('click', (e) => {
       if (e.target === lightbox) lightbox.classList.remove('active');
   });
   
   /* ==========================================
      4. TYPEWRITER LETTER EFFECT
      ========================================== */
   function typeWriter(text, element, speed = 30) {
       if (isTyping) return;
       isTyping = true;
       element.textContent = "";
       let i = 0;
   
       function type() {
           if (i < text.length) {
               element.textContent += text.charAt(i);
               i++;
               setTimeout(type, speed);
           } else {
               isTyping = false;
           }
       }
       type();
   }
   
   restartTypingBtn.addEventListener('click', () => {
       typeWriter(LETTER_TEXT, typewriterEl);
   });
   
   /* ==========================================
      5. RANDOM MEMORY GENERATOR
      ========================================== */
   generateMemoryBtn.addEventListener('click', () => {
       const randomIndex = Math.floor(Math.random() * RANDOM_MEMORIES.length);
       memoryOutput.style.opacity = 0;
       setTimeout(() => {
           memoryOutput.textContent = RANDOM_MEMORIES[randomIndex];
           memoryOutput.style.opacity = 1;
       }, 200);
   });
   
   /* ==========================================
      6. SECRET PIN SURPRISE SYSTEM
      ========================================== */
   keyBtns.forEach(btn => {
       btn.addEventListener('click', () => {
           const key = btn.dataset.key;
   
           if (key === 'C') {
               currentPin = "";
           } else if (key === 'DEL') {
               currentPin = currentPin.slice(0, -1);
           } else if (currentPin.length < 4) {
               currentPin += key;
           }
   
           updatePinDots();
   
           if (currentPin.length === 4) {
               checkPin();
           }
       });
   });
   
   function updatePinDots() {
       pinDots.forEach((dot, index) => {
           if (index < currentPin.length) {
               dot.classList.add('filled');
           } else {
               dot.classList.remove('filled');
           }
       });
   }
   
   function checkPin() {
       if (currentPin === SECRET_PIN) {
           pinError.classList.add('hidden');
           pinCard.classList.add('hidden');
           unlockedContent.classList.remove('hidden');
           triggerConfetti();
       } else {
           pinError.classList.remove('hidden');
           currentPin = "";
           setTimeout(updatePinDots, 500);
       }
   }
   
   /* ==========================================
      7. MUSIC CONTROL
      ========================================== */
   let isPlaying = false;
   
   musicBtn.addEventListener('click', () => {
       if (!isPlaying) {
           bgMusic.play().then(() => {
               isPlaying = true;
               musicBtn.querySelector('.btn-text').textContent = 'Music ON';
               musicBtn.classList.add('playing');
           }).catch(e => console.log('Audio play blocked:', e));
       } else {
           bgMusic.pause();
           isPlaying = false;
           musicBtn.querySelector('.btn-text').textContent = 'Music OFF';
           musicBtn.classList.remove('playing');
       }
   });
   
   /* ==========================================
      8. DARK MODE TOGGLE
      ========================================== */
   themeBtn.addEventListener('click', () => {
       const currentTheme = document.documentElement.getAttribute('data-theme');
       const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
       
       document.documentElement.setAttribute('data-theme', newTheme);
       localStorage.setItem('theme', newTheme);
       themeBtn.querySelector('.btn-icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
   });
   
   /* ==========================================
      9. SCROLL REVEAL & BOND METER ANIMATION
      ========================================== */
   function initScrollAnimations() {
       const reveals = document.querySelectorAll('.scroll-reveal');
   
       const observer = new IntersectionObserver((entries) => {
           entries.forEach(entry => {
               if (entry.isIntersecting) {
                   entry.target.classList.add('revealed');
   
                   // Trigger letter typing when letter section appears
                   if (entry.target.classList.contains('letter-card') && typewriterEl.textContent === "") {
                       typeWriter(LETTER_TEXT, typewriterEl);
                   }
   
                   // Trigger bond meter fill when bond section appears
                   if (entry.target.classList.contains('bond-section')) {
                       meterFill.style.width = '100%';
                   }
               }
           });
       }, { threshold: 0.2 });
   
       reveals.forEach(el => observer.observe(el));
   }
   
   /* ==========================================
      10. FLOATING PETALS & SPARKLES CANVAS
      ========================================== */
   function initAmbientCanvas() {
       const canvas = document.getElementById('ambient-canvas');
       const ctx = canvas.getContext('2d');
   
       let width = canvas.width = window.innerWidth;
       let height = canvas.height = window.innerHeight;
   
       window.addEventListener('resize', () => {
           width = canvas.width = window.innerWidth;
           height = canvas.height = window.innerHeight;
       });
   
       const particles = [];
       const numParticles = 25;
   
       class Particle {
           constructor() {
               this.reset();
           }
   
           reset() {
               this.x = Math.random() * width;
               this.y = -20;
               this.size = Math.random() * 8 + 4;
               this.speedY = Math.random() * 1.5 + 0.5;
               this.speedX = Math.random() * 1 - 0.5;
               this.rotation = Math.random() * 360;
               this.spin = Math.random() * 2 - 1;
               this.opacity = Math.random() * 0.5 + 0.3;
               this.type = Math.random() > 0.5 ? 'petal' : 'heart';
           }
   
           update() {
               this.y += this.speedY;
               this.x += this.speedX;
               this.rotation += this.spin;
   
               if (this.y > height + 20) {
                   this.reset();
               }
           }
   
           draw() {
               ctx.save();
               ctx.translate(this.x, this.y);
               ctx.rotate((this.rotation * Math.PI) / 180);
               ctx.globalAlpha = this.opacity;
   
               if (this.type === 'petal') {
                   ctx.fillStyle = '#ffb6c1';
                   ctx.beginPath();
                   ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, 2 * Math.PI);
                   ctx.fill();
               } else {
                   ctx.fillStyle = '#ff758c';
                   ctx.font = `${this.size * 1.5}px sans-serif`;
                   ctx.fillText('🩷', 0, 0);
               }
   
               ctx.restore();
           }
       }
   
       for (let i = 0; i < numParticles; i++) {
           particles.push(new Particle());
       }
   
       function animate() {
           ctx.clearRect(0, 0, width, height);
           particles.forEach(p => {
               p.update();
               p.draw();
           });
           requestAnimationFrame(animate);
       }
   
       animate();
   }