document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const titleEl = document.getElementById('title');
    const welcomeEl = document.getElementById('welcome');
    const q1Label = document.getElementById('q1-label');
    const q2Label = document.getElementById('q2-label');
    const q3Label = document.getElementById('q3-label');
    const submitBtn = document.getElementById('submit-btn');
    const enBtn = document.getElementById('en-btn');
    const frBtn = document.getElementById('fr-btn');
    
    // Check for saved language preference
    let currentLang = localStorage.getItem('language') || 'en';
    
    // Set initial language
    updateLanguage(currentLang);
    
    // Language switcher event listeners
    enBtn.addEventListener('click', function() {
        currentLang = 'en';
        updateLanguage(currentLang);
        localStorage.setItem('language', 'en');
    });
    
    frBtn.addEventListener('click', function() {
        currentLang = 'fr';
        updateLanguage(currentLang);
        localStorage.setItem('language', 'fr');
    });
    
    // Form submission
    document.getElementById('feedback-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert(currentLang === 'en' ? 'Thank you for your feedback!' : 'Merci pour vos commentaires!');
        this.reset();
    });
    
    // Update page content based on selected language
    function updateLanguage(lang) {
        const langData = translations[lang];
        
        titleEl.textContent = langData.title;
        welcomeEl.textContent = langData.welcome;
        q1Label.textContent = langData.q1;
        q2Label.textContent = langData.q2;
        q3Label.textContent = langData.q3;
        submitBtn.textContent = langData.submit;
        
        // Update active language button
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (lang === 'en') {
            enBtn.classList.add('active');
        } else {
            frBtn.classList.add('active');
        }
    }
    
    // Optional: Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'fr' && !localStorage.getItem('language')) {
        currentLang = 'fr';
        updateLanguage(currentLang);
    }
});