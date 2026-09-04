document.addEventListener("DOMContentLoaded", () => {
    loadNews();
    loadPublications();
    loadPosters();
    
    // Initialize other functionality
    initMobileMenu();
    initSmoothScrolling();
    initCounters();
});

let allPublications = [];
let showingAll = false;

// Initialize mobile menu functionality
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if(mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
}

// Counter animation
function animateCounter(element, target) {
    let count = 0;
    const duration = 2000; // ms
    const increment = target / (duration / 16); // assuming 60fps
    
    const timer = setInterval(() => {
        count += increment;
        if(count >= target) {
            element.textContent = target > 1000 ? (target/1000).toFixed(1) + 'k' : target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(count) > 1000 ? 
                (Math.floor(count)/1000).toFixed(1) + 'k' : 
                Math.floor(count);
        }
    }, 16);
}

// Initialize counters when they come into view
function initCounters() {
    const counterItems = document.querySelectorAll('.counter-item');
    if(counterItems.length > 0) {
        counterItems.forEach(item => {
            const counter = item.querySelector('.counter');
            if(!counter) return;
            
            const target = parseInt(counter.getAttribute('data-target'));
            if(isNaN(target)) return;
            
            // Simple animation trigger when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) {
                        animateCounter(counter, target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(item);
        });
    }
}

// 1. Load News & Research Blog
async function loadNews() {
    try {
        const response = await fetch('data/news.json');
        const newsItems = await response.json();
        const container = document.getElementById('news-container');
        if (!container) return;

        container.innerHTML = '';

        newsItems.forEach(item => {
            const card = document.createElement('div');
            card.className = "bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition";
            
            let colorClasses = "bg-blue-100 text-blue-900";
            if (item.categoryColor === "emerald") colorClasses = "bg-emerald-100 text-emerald-900";
            if (item.categoryColor === "purple") colorClasses = "bg-purple-100 text-purple-900";

            let mediaHtml = '';
            if (item.mediaType === 'image' && item.mediaUrl) {
                mediaHtml = `<img src="${item.mediaUrl}" class="w-full h-48 object-cover rounded-lg border border-slate-100 mt-2" alt="${item.title}">`;
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
                                title="${item.title}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                        </iframe>
                    </div>`;
            }

            card.innerHTML = `
                <div class="space-y-2">
                    <div class="flex justify-between items-center text-xs">
                        <span class="px-2 py-0.5 font-semibold rounded ${colorClasses}">${item.category}</span>
                        <span class="text-slate-400">${item.date}</span>
                    </div>
                    <h3 class="font-bold text-slate-900">${item.title}</h3>
                    <p class="text-sm text-slate-600">${item.description}</p>
                    ${mediaHtml}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading news items:", error);
    }
}

// 2. Load Publications
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
    if (!listContainer) return;

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
    const statsSpan = document.querySelector('#publications .bg-slate-200');
    if (statsSpan) {
        statsSpan.innerText = `${allPublications.length}+ Articles | h-index: 9`;
    }
    if (toggleBtn) {
        toggleBtn.innerText = showingAll 
            ? 'Show Top 10 Publications' 
            : `Show All Publications (${allPublications.length})`;
    }
}

function togglePublications() {
    showingAll = !showingAll;
    renderPublications();
}

// Add event listener for toggle button after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-pubs-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', togglePublications);
    }
});

// 3. Load Posters
async function loadPosters() {
    try {
        const response = await fetch('data/posters.json');
        const posters = await response.json();
        
        posters.sort((a, b) => b.year - a.year);

        const container = document.getElementById('posters-container');
        if (!container) return;

        container.innerHTML = '';

        posters.forEach(poster => {
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
                    <p class="text-sm text-slate-600 pt-1">${poster.description}</p>
                </div>
                <div class="p-4 bg-slate-50 border-t border-slate-100">
                    <a href="${poster.pdfPath}" target="_blank" class="inline-flex items-center text-sm font-semibold text-blue-900 hover:text-blue-700">
                        <i class="fas fa-file-pdf mr-2"></i> View / Download Poster PDF →
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error loading posters:", error);
    }
}