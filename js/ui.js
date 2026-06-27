/**
 * UI Interaction and Event Listener Coordinator
 */
import { translatePage } from './i18n.js';
import { playChord, stopCurrentChord, setOscillatorType } from './audio.js';

export function initializeUI() {
  // ==========================================
  // 1. LANGUAGE DROPDOWN CONTROLS
  // ==========================================
  const langSelectBtn = document.getElementById('lang-select-btn');
  const langDropdown = document.getElementById('lang-dropdown');

  if (langSelectBtn && langDropdown) {
    langSelectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      langDropdown.classList.remove('open');
    });

    // Select language choice
    const options = langDropdown.querySelectorAll('.lang-option');
    options.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        const lang = opt.getAttribute('data-lang');
        if (lang) {
          translatePage(lang);
          localStorage.setItem('harmonigrid_lang', lang);
        }
        langDropdown.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 2. MOBILE HEADER BURGER NAVIGATION
  // ==========================================
  const burgerToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (burgerToggle && navLinks) {
    burgerToggle.addEventListener('click', () => {
      burgerToggle.classList.toggle('mobile-nav-toggle--open');
      navLinks.classList.toggle('nav-links--open');
    });

    // Close mobile menu when clicking links
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        burgerToggle.classList.remove('mobile-nav-toggle--open');
        navLinks.classList.remove('nav-links--open');
      });
    });
  }

  // ==========================================
  // 3. SHRINK HEADER ON SCROLL
  // ==========================================
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    });
  }

  // ==========================================
  // 4. ROADMAP ACCORDION PANELS
  // ==========================================
  const roadmapItems = document.querySelectorAll('.roadmap-item');
  roadmapItems.forEach((item) => {
    const rHeader = item.querySelector('.roadmap-header');
    const rContent = item.querySelector('.roadmap-content');
    
    if (rHeader && rContent) {
      rHeader.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Close other panels (accordion behavior)
        roadmapItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.roadmap-content').style.maxHeight = null;
          }
        });
        
        // Toggle current
        if (isOpen) {
          item.classList.remove('open');
          rContent.style.maxHeight = null;
        } else {
          item.classList.add('open');
          // Set max-height dynamically to match scrollHeight for smooth transition
          rContent.style.maxHeight = rContent.scrollHeight + "px";
        }
      });
    }
  });

  // ==========================================
  // 5. INTERACTIVE AUDIO SYNTH PAD BINDINGS
  // ==========================================
  const chordPads = document.querySelectorAll('.chord-pad');
  const oscSelect = document.getElementById('synth-osc');
  const activeChordName = document.getElementById('active-chord-name');
  const activeNotesDisp = document.getElementById('active-notes-display');

  if (chordPads.length > 0) {
    chordPads.forEach((pad) => {
      pad.addEventListener('click', () => {
        const chordKey = pad.getAttribute('data-chord');
        if (!chordKey) return;
        
        // Toggle visual active state
        chordPads.forEach((p) => p.classList.remove('playing'));
        pad.classList.add('playing');
        
        // Play chord sound
        const notes = playChord(chordKey);
        
        // Update display text safely
        if (activeChordName) {
          activeChordName.textContent = pad.querySelector('.chord-name').textContent;
        }
        if (activeNotesDisp && notes) {
          activeNotesDisp.textContent = `[ ${notes} ]`;
        }
      });
    });
    
    // Stop audio when mouse/touch leaves pads (optional, but let's allow it to ring out via release envelope)
    // To allow stop, we could bind a stop trigger, but release fade gives a beautiful echo.
    // If they click empty space on container, we stop sound:
    const synthGrid = document.querySelector('.synth-grid');
    if (synthGrid) {
      document.addEventListener('click', (e) => {
        const isClickInsidePad = e.target.closest('.chord-pad');
        const isClickInsideSelect = e.target.closest('.synth-select');
        if (!isClickInsidePad && !isClickInsideSelect) {
          stopCurrentChord();
          chordPads.forEach((p) => p.classList.remove('playing'));
          if (activeChordName) activeChordName.textContent = '---';
          if (activeNotesDisp) activeNotesDisp.textContent = '';
        }
      });
    }
  }

  // Handle oscillator sound mode changes
  if (oscSelect) {
    oscSelect.addEventListener('change', (e) => {
      setOscillatorType(e.target.value);
    });
  }

  // ==========================================
  // 6. INTERACTIVE COMPOSING FLOW HIGHLIGHTS (SECTION 1)
  // ==========================================
  const flowSteps = document.querySelectorAll('.flow-step');
  if (flowSteps.length > 0) {
    flowSteps.forEach((step, idx) => {
      step.addEventListener('mouseenter', () => {
        flowSteps.forEach((s) => s.classList.remove('flow-highlight'));
        step.classList.add('flow-highlight');
      });
      step.addEventListener('mouseleave', () => {
        step.classList.remove('flow-highlight');
        // highlight the center one by default
        if (flowSteps[1]) flowSteps[1].classList.add('flow-highlight');
      });
    });
    // Set step 2 (HarmoniGrid) as active initially
    if (flowSteps[1]) flowSteps[1].classList.add('flow-highlight');
  }

  // ==========================================
  // 7. SCROLL ENTRANCE EFFECTS FALLBACK (IntersectionObserver)
  // ==========================================
  // Check if browser native scroll-timeline is supported
  const supportsScrollTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  if (!supportsScrollTimeline) {
    document.documentElement.classList.add('no-scroll-timeline');
    
    // Fallback using IntersectionObserver
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // trigger when 15% is visible
    };
    
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, we don't need to track it anymore
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Register scroll targets
    const scrollTargets = document.querySelectorAll('.scroll-reveal, .scroll-scale');
    scrollTargets.forEach((target) => {
      target.classList.add('intersection-target');
      scrollObserver.observe(target);
    });
  }
}
