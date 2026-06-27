/**
 * HarmoniGrid Landing Page Main Orchestrator
 */
import { translatePage } from './i18n.js';
import { initializeUI } from './ui.js';
import { initializeFeedbackForm, initializeNewsletterForm } from './forms.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Language Detection Strategy
  let targetLang = 'es'; // default fallback is Spanish, matching mockup model
  
  // URL Param detection (e.g. ?lang=en)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  
  // localStorage detection
  const localLang = localStorage.getItem('harmonigrid_lang');
  
  // Navigator locale detection
  const browserLang = navigator.language ? navigator.language.split('-')[0].toLowerCase() : '';
  const supportedLangs = ['es', 'en', 'pt', 'fr', 'de', 'it'];

  if (urlLang && supportedLangs.includes(urlLang)) {
    targetLang = urlLang;
  } else if (localLang && supportedLangs.includes(localLang)) {
    targetLang = localLang;
  } else if (browserLang && supportedLangs.includes(browserLang)) {
    targetLang = browserLang;
  }

  // 2. Initialize Translations
  translatePage(targetLang);

  // 3. Initialize UI Interactive Features
  initializeUI();

  // 4. Initialize Forms with Honeypot Security
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    initializeFeedbackForm(feedbackForm, (data) => {
      console.log(`Feedback safely processed for: ${data.name}`);
    });
  }

  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach((form) => {
    initializeNewsletterForm(form);
  });

  console.log(`HarmoniGrid Landing Page successfully loaded. Theme: Light. Language: ${targetLang.toUpperCase()}`);
});
