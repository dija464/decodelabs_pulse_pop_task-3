/* ============================================
   PULSE — INTERACTIVITY
   Project: DecodeLabs Internship — Project 3
   ============================================ */

/* ============================================
   1. DARK MODE TOGGLE
   IPO Loop: Click (Input) → Check & flip state (Process)
   → Update DOM + save (Output)
   ============================================ */

// ✅ const for DOM references — they never get reassigned
const themeToggleBtn = document.querySelector('.js-theme-toggle');
const themeIcon = document.querySelector('.js-theme-icon');
const body = document.body;

// PROCESS: Check if user already has a saved preference
function applySavedTheme() {
  const savedTheme = localStorage.getItem('pulse-theme');

  if (savedTheme === 'dark') {
    body.classList.add('is-dark-mode');
    themeIcon.textContent = '☀️';
  }
}

// PROCESS + OUTPUT: Flip the theme and save it
function toggleTheme() {
  // classList.toggle returns true if class was ADDED, false if REMOVED
  const isDarkNow = body.classList.toggle('is-dark-mode');

  if (isDarkNow) {
    themeIcon.textContent = '☀️';       // show sun (click to go light)
    localStorage.setItem('pulse-theme', 'dark');
  } else {
    themeIcon.textContent = '🌙';       // show moon (click to go dark)
    localStorage.setItem('pulse-theme', 'light');
  }
}

// INPUT: Wire the event listener
themeToggleBtn.addEventListener('click', toggleTheme);

// Run on page load to restore previous choice
applySavedTheme();


/* ============================================
   2. FAQ ACCORDION
   IPO Loop: Click question (Input) → toggle open state (Process)
   → expand/collapse answer (Output)
   ============================================ */

// Get ALL faq items on the page
const faqItems = document.querySelectorAll('.js-faq-item');

faqItems.forEach((item) => {
  const trigger = item.querySelector('.js-faq-trigger');
  const answer = item.querySelector('.faq-item__answer');

  trigger.addEventListener('click', () => {

    const isCurrentlyOpen = item.classList.contains('is-open');

    // First, close ALL faq items (accordion behavior — only one open at a time)
    faqItems.forEach((otherItem) => {
      otherItem.classList.remove('is-open');
      otherItem.querySelector('.faq-item__answer').style.maxHeight = null;
      otherItem.querySelector('.js-faq-trigger').setAttribute('aria-expanded', 'false');
    });

    // Then, if THIS item wasn't already open, open it
    if (!isCurrentlyOpen) {
      item.classList.add('is-open');
      // scrollHeight = the actual content height needed for the animation
      answer.style.maxHeight = answer.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});


/* ============================================
   3. ANIMATED STATS COUNTER
   IPO Loop: Element enters viewport (Input) →
   increment number gradually (Process) → update text (Output)
   ============================================ */

const counters = document.querySelectorAll('.js-counter');

function animateCounter(counterEl) {
  const target = parseInt(counterEl.getAttribute('data-target'), 10);
  const duration = 1500; // total animation time in ms
  const frameRate = 16;  // ~60fps
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const countUp = setInterval(() => {
    frame++;
    // Ease-out progress curve — fast start, slow finish
    const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
    const currentValue = Math.round(target * progress);

    counterEl.textContent = currentValue.toLocaleString();

    if (frame >= totalFrames) {
      counterEl.textContent = target.toLocaleString();
      clearInterval(countUp);
    }
  }, frameRate);
}


/* ============================================
   4. SCROLL-REVEAL ANIMATIONS
   Uses Intersection Observer — modern, performant
   way to detect when elements enter the viewport
   ============================================ */

const revealElements = document.querySelectorAll('.js-reveal');

// PROCESS: Create an observer that watches elements
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // OUTPUT: Add the visible class to trigger CSS transition
      entry.target.classList.add('is-visible');

      // ✅ Special case: if this element contains a counter, animate it
      const counterInside = entry.target.querySelector('.js-counter');
      if (counterInside && !counterInside.classList.contains('has-counted')) {
        counterInside.classList.add('has-counted');
        animateCounter(counterInside);
      }

      // Stop observing once revealed — saves performance
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15 // trigger when 15% of element is visible
});

// INPUT: Tell the observer to watch every reveal element
revealElements.forEach((el) => revealObserver.observe(el));

// ✅ Special handling: stats are inside a single .js-reveal wrapper,
// but each counter needs the observer too
document.querySelectorAll('.stats__grid .js-counter').forEach((counter) => {
  revealObserver.observe(counter.closest('.js-reveal') || counter);
});

/* ============================================
   5. SIGNATURE ELEMENT — Hero Ticker
   Continuously increments to feel "live"
   ============================================ */

   const tickerEl = document.querySelector('.js-ticker-number');

   if (tickerEl) {
     let tickerValue = 12847; // starting number
     tickerEl.textContent = tickerValue.toLocaleString();
   
     setInterval(() => {
       // Random small increment — feels organic, not robotic
       tickerValue += Math.floor(Math.random() * 3) + 1;
       tickerEl.textContent = tickerValue.toLocaleString();
     }, 2200);
   }