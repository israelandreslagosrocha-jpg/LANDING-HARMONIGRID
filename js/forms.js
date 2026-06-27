/**
 * Secure Form Processing and Input Validation Module
 * Features XSS sanitization, spam honeypot filters, and persistent local mocking.
 */

// Helper to escape HTML tags and prevent XSS injections
export function sanitizeHTML(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Regex to validate emails according to standard format
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates form inputs and handles dynamic banner feedback
 * @param {HTMLFormElement} formElement 
 * @param {Function} onSuccessCallback 
 */
export function initializeFeedbackForm(formElement, onSuccessCallback) {
  if (!formElement) return;

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Honeypot check (Spam bot detection)
    // A bot will usually fill in every input it finds in the HTML.
    const honeypot = formElement.querySelector('[name="website_url"]');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn("Spam submission blocked via honeypot.");
      // Confuse the bot by showing success without actually processing
      showFeedbackBanner(formElement, true);
      formElement.reset();
      return;
    }

    // 2. Extract inputs
    const nameInput = formElement.querySelector('[name="name"]');
    const emailInput = formElement.querySelector('[name="email"]');
    const suggestInput = formElement.querySelector('[name="suggestion"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const suggestion = suggestInput ? suggestInput.value.trim() : '';

    // Reset error visuals
    clearErrors(formElement);

    // 3. Validation Checks
    let hasError = false;

    if (name.length < 2 || name.length > 50) {
      showFieldError(nameInput, "Invalid name length");
      hasError = true;
    }

    if (!EMAIL_REGEX.test(email)) {
      showFieldError(emailInput, "Invalid email format");
      hasError = true;
    }

    if (suggestion.length < 5 || suggestion.length > 1000) {
      showFieldError(suggestInput, "Invalid suggestion length");
      hasError = true;
    }

    if (hasError) {
      showFeedbackBanner(formElement, false);
      return;
    }

    // 4. Secure Sanitization (Agency Standard)
    const secureName = sanitizeHTML(name);
    const secureEmail = sanitizeHTML(email);
    const secureSuggestion = sanitizeHTML(suggestion);

    // 5. Store Locally (Mock Submission)
    const feedbackList = JSON.parse(localStorage.getItem('harmonigrid_feedback') || '[]');
    feedbackList.push({
      name: secureName,
      email: secureEmail,
      suggestion: secureSuggestion,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('harmonigrid_feedback', JSON.stringify(feedbackList));

    // Show Success Banner
    showFeedbackBanner(formElement, true);
    formElement.reset();

    if (typeof onSuccessCallback === 'function') {
      onSuccessCallback({ name: secureName, email: secureEmail });
    }
  });
}

/**
 * Initializes inline newsletters forms
 * @param {HTMLFormElement} formElement 
 */
export function initializeNewsletterForm(formElement) {
  if (!formElement) return;

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot check
    const honeypot = formElement.querySelector('[name="website_url"]');
    if (honeypot && honeypot.value.trim() !== '') {
      alert("Subscribed!");
      formElement.reset();
      return;
    }

    const emailInput = formElement.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!EMAIL_REGEX.test(email)) {
      if (emailInput) {
        emailInput.style.borderColor = '#ef4444';
        setTimeout(() => { emailInput.style.borderColor = ''; }, 3000);
      }
      return;
    }

    // Secure local save
    const subscribers = JSON.parse(localStorage.getItem('harmonigrid_subscribers') || '[]');
    subscribers.push({
      email: sanitizeHTML(email),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('harmonigrid_subscribers', JSON.stringify(subscribers));

    // Success response alert trigger
    const alertMsgMap = {
      es: "¡Suscripción completada!",
      en: "Subscription completed!",
      pt: "Inscrição concluída!",
      fr: "Inscription réussie !",
      de: "Abonnement erfolgreich!",
      it: "Iscrizione completata!"
    };
    
    const currentLang = document.documentElement.getAttribute('lang') || 'es';
    alert(alertMsgMap[currentLang] || alertMsgMap.es);
    formElement.reset();
  });
}

function showFieldError(inputNode, message) {
  if (!inputNode) return;
  inputNode.style.borderColor = '#ef4444';
  const group = inputNode.closest('.form-group');
  if (group) {
    const errorDisplay = group.querySelector('.form-error');
    if (errorDisplay) {
      errorDisplay.textContent = message;
      errorDisplay.style.display = 'block';
    }
  }
}

function clearErrors(formElement) {
  formElement.querySelectorAll('.form-control').forEach((ctrl) => {
    ctrl.style.borderColor = '';
  });
  formElement.querySelectorAll('.form-error').forEach((err) => {
    err.style.display = 'none';
  });
}

function showFeedbackBanner(formElement, isSuccess) {
  const successBanner = formElement.querySelector('.form-notification--success');
  const errorBanner = formElement.querySelector('.form-notification--error');

  if (isSuccess) {
    if (successBanner) {
      successBanner.style.display = 'flex';
      // Auto translate success text if translation object exists
      const lang = document.documentElement.getAttribute('lang') || 'es';
      const msg = lang === 'es' ? "¡Gracias! Tu sugerencia ha sido enviada con éxito." : "Thank you! Your suggestion was successfully submitted.";
      successBanner.textContent = msg;
    }
    if (errorBanner) errorBanner.style.display = 'none';
    
    // Hide after 5 seconds
    setTimeout(() => {
      if (successBanner) successBanner.style.display = 'none';
    }, 5000);
  } else {
    if (errorBanner) {
      errorBanner.style.display = 'flex';
      const lang = document.documentElement.getAttribute('lang') || 'es';
      const msg = lang === 'es' ? "Por favor, completa todos los campos de forma válida." : "Please complete all fields with valid inputs.";
      errorBanner.textContent = msg;
    }
    if (successBanner) successBanner.style.display = 'none';
  }
}
