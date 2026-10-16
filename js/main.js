let currentLang = 'en';
let allPublications = [];
let showingAll = false;
let allNews = [];
let allPosters = [];

document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initMobileMenu();
    initSmoothScrolling();
    initCounters();
    
    loadNews();
    loadPublications();
    loadPosters();
});

// Inizializzazione della lingua con rilevamento automatico
function initLanguage() {
    const savedLang = localStorage.getItem('site_lang');
    if (savedLang) {
        currentLang = savedLang;
    } else {
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        currentLang = browserLang.toLowerCase().startsWith('it') ? 'it' : 'en';
    }

    applyTranslations(currentLang);
    updateLanguageButton(currentLang);

    const toggleBtn = document.getElementById('lang-toggle-btn');
    const toggleBtnMobile = document.getElementById('lang-toggle-mobile');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleLanguage);
    }
    if (toggleBtnMobile) {
        toggleBtnMobile.addEventListener('click', toggleLanguage);
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'it' : 'en';
    localStorage.setItem('site_lang', currentLang);
    applyTranslations(currentLang);
    updateLanguageButton(currentLang);
    renderNews();
    renderPublications();
    renderPosters();
}

function updateLanguageButton(lang) {
    const flagSpan = document.getElementById('lang-flag');
    const labelSpan = document.getElementById('lang-label');
    const mobileBtn = document.getElementById('lang-toggle-mobile');

    // Mostra la lingua di destinazione se si clicca
    if (lang === 'en') {
        if (flagSpan) flagSpan.textContent = '🇮🇹';
        if (labelSpan) labelSpan.textContent = 'IT';
        if (mobileBtn) mobileBtn.textContent = 'IT';
        document.documentElement.lang = 'en';
    } else {
        if (flagSpan) flagSpan.textContent = '🇬🇧';
        if (labelSpan) labelSpan.textContent = 'EN';
        if (mobileBtn) mobileBtn.textContent = 'EN';
        document.documentElement.lang = 'it';
    }
}

function applyTranslations(lang) {
    if (!translations || !translations[lang]) return;
    const dict = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.textContent = dict[key];
        }
    });
}

// Menu mobile
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
}

// Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
}

// Animazione contatori
function animateCounter(element, target) {
    let count = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            element.textContent = target > 1000 ? (target / 1000).toFixed(1) + 'k' : target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(count) > 1000 ? 
                (Math.floor(count) / 1000).toFixed(1) + 'k' : 
                Math.floor(count);
        }
    }, 16);
}

function initCounters() {
    const counterItems = document.querySelectorAll('.counter-item');
    if (counterItems.length > 0) {
        counterItems.forEach(item => {
            const counter = item.querySelector('.counter');
            if (!counter) return;
            
            const target = parseInt(counter.getAttribute('data-target'));
            if (isNaN(target)) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(counter, target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(item);
        });
    }
}

// 1. News
async function loadNews() {
    try {
        const response = await fetch('data/news.json');
        allNews = await response.json();
        renderNews();
    } catch (error) {
        console.error("Error loading news items:", error);
    }
}

function renderNews() {
    const container = document.getElementById('news-container');
    if (!container || !allNews.length) return;

    container.innerHTML = '';

    allNews.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition";
        
        let colorClasses = "bg-blue-100 text-blue-900";
        if (item.categoryColor === "emerald") colorClasses = "bg-emerald-100 text-emerald-900";
        if (item.categoryColor === "purple") colorClasses = "bg-purple-100 text-purple-900";

        const title = (currentLang === 'it' && item.title_it) ? item.title_it : item.title;
        const description = (currentLang === 'it' && item.description_it) ? item.description_it : item.description;
        const category = (currentLang === 'it' && item.category_it) ? item.category_it : item.category;

        let mediaHtml = '';
        if (item.mediaType === 'image' && item.mediaUrl) {
            mediaHtml = `<img src="${item.mediaUrl}" class="w-full h-48 object-cover rounded-lg border border-slate-100 mt-2" alt="${title}">`;
        } else if (item.mediaType === 'video' && item.mediaUrl) {
            mediaHtml = `
                <video controls class="w-full rounded-lg border border-slate-100 mt-2">
                    <source src="${item.mediaUrl}">
                    Your browser does not support video playback.
                </video>`;
        } else if (item.mediaType === 'youtube' && item.mediaUrl) {
            mediaHtml = `
                <div class="relative w-full aspect-video mt-2 rounded-lg overflow-hidden border border-slate-100">
                    <iframe class="absolute top-0 left-0 w-full h-full" 
                            src="${item.mediaUrl}" 
                            title="${title}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                </div>`;
        }

        card.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between items-center text-xs">
                    <span class="px-2 py-0.5 font-semibold rounded ${colorClasses}">${category}</span>
                    <span class="text-slate-400">${item.date}</span>
                </div>
                <h3 class="font-bold text-slate-900">${title}</h3>
                <p class="text-sm text-slate-600">${description}</p>
                ${mediaHtml}
            </div>
        `;
        container.appendChild(card);
    });
}

// 2. Pubblicazioni
async function loadPublications() {
    try {
        const response = await fetch('data/publications.json');
        allPublications = await response.json();
        allPublications.sort((a, b) => b.year - a.year);
        renderPublications();
    } catch (error) {
        console.error("Error loading publications:", error);
    }
}

function renderPublications() {
    const listContainer = document.getElementById('publications-list');
    if (!listContainer || !allPublications.length) return;

    listContainer.innerHTML = '';
    const displayList = showingAll ? allPublications : allPublications.slice(0, 10);

    displayList.forEach((pub) => {
        const li = document.createElement('li');
        li.className = "p-4 bg-white rounded-lg border border-slate-200 shadow-sm transition hover:border-blue-300";
        
        let doiHtml = pub.doi 
            ? `<a href="${pub.doi}" target="_blank" class="ml-2 text-xs font-semibold text-blue-900 hover:underline"><i class="fas fa-external-link-alt mr-1"></i>DOI</a>` 
            : '';

        li.innerHTML = `
            <strong>${pub.authors} (${pub.year}).</strong> 
            ${pub.title}. 
            <em class="text-blue-900">${pub.journal}</em>, ${pub.volume}.${doiHtml}
        `;
        listContainer.appendChild(li);
    });

    const toggleBtn = document.getElementById('toggle-pubs-btn');
    const statsSpan = document.getElementById('publication-count');
    
    if (statsSpan) {
        statsSpan.innerText = currentLang === 'it' 
            ? `${allPublications.length}+ Articoli | h-index: 9` 
            : `${allPublications.length}+ Articles | h-index: 9`;
    }
    if (toggleBtn) {
        const dict = translations[currentLang];
        toggleBtn.innerText = showingAll 
            ? dict['pubs-btn-top'] 
            : `${dict['pubs-btn-all']} (${allPublications.length})`;
    }
}

function togglePublications() {
    showingAll = !showingAll;
    renderPublications();
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-pubs-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', togglePublications);
    }
});

// 3. Poster
async function loadPosters() {
    try {
        const response = await fetch('data/posters.json');
        allPosters = await response.json();
        allPosters.sort((a, b) => b.year - a.year);
        renderPosters();
    } catch (error) {
        console.error("Error loading posters:", error);
    }
}

function renderPosters() {
    const container = document.getElementById('posters-container');
    if (!container || !allPosters.length) return;

    container.innerHTML = '';
    const dict = translations[currentLang];

    allPosters.forEach(poster => {
        const description = (currentLang === 'it' && poster.description_it) ? poster.description_it : poster.description;
        const card = document.createElement('div');
        card.className = "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition";
        card.innerHTML = `
            <div class="p-6 space-y-2">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">${poster.conference}</span>
                    <span class="text-xs font-medium text-slate-400">${poster.year}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900">${poster.title}</h3>
                <p class="text-xs text-slate-500">${poster.authors}</p>
                <p class="text-sm text-slate-600 pt-1">${description}</p>
            </div>
            <div class="p-4 bg-slate-50 border-t border-slate-100">
                <a href="${poster.pdfPath}" target="_blank" class="inline-flex items-center text-sm font-semibold text-blue-900 hover:text-blue-700">
                    <i class="fas fa-file-pdf mr-2"></i> ${dict['poster-download-btn']}
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}