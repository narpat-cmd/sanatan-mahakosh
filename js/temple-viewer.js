// Sanatan Dharma Mahakosh - Temple Viewer Module
// Modal viewer for temple details with image gallery

class TempleViewer {
    constructor() {
        this.currentTemple = null;
        this.currentImageIndex = 0;
        this.imageGallery = [];
        this.init();
    }

    init() {
        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('closeTemple')?.addEventListener('click', () => {
            this.close();
        });

        // Gallery navigation
        document.getElementById('prevImage')?.addEventListener('click', () => {
            this.prevImage();
        });

        document.getElementById('nextImage')?.addEventListener('click', () => {
            this.nextImage();
        });

        // Dot indicators for gallery
        document.querySelectorAll('.gallery-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.showImage(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('templeModal')?.classList.contains('hidden')) {
                this.handleKeyboard(e);
            }
        });
    }

    open(templeId) {
        const templeData = this.getTempleData(templeId);
        if (!templeData) return;

        this.currentTemple = templeData;
        this.imageGallery = templeData.images || [];
        this.currentImageIndex = 0;

        this.showModal();
        this.renderTempleDetails();
    }

    getTempleData(templeId) {
        // Search across all temple categories
        const categories = ['jyotirlingas', 'shaktipeeths', 'charDham', 'saptaPuri', 'famousTemples'];
        for (const category of categories) {
            const temple = window.TEMPLES?.[category]?.find(t => t.id === templeId);
            if (temple) return { ...temple, category };
        }
        return null;
    }

    showModal() {
        const modal = document.getElementById('templeModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        const modal = document.getElementById('templeModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        this.currentImageIndex = 0;
    }

    renderTempleDetails() {
        if (!this.currentTemple) return;

        const container = document.getElementById('templeContainer');
        if (!container) return;

        container.innerHTML = this.createTempleDetailHTML();
        this.showImage(0);
        this.updateGalleryIndicators();
    }

    createTempleDetailHTML() {
        const t = this.currentTemple;
        return `
            <div class="relative h-full text-parchment">
                <!-- Header -->
                <div class="bg-maroon/90 p-6 border-b border-gold/30">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-heading text-gold mb-1">${t.nameEnglish}</h2>
                            <p class="text-parchment/80 text-sm">${t.name}</p>
                        </div>
                        <span class="px-3 py-1 text-xs font-bold rounded-full bg-gold/20 text-gold">${t.category || 'Temple'}</span>
                    </div>
                </div>

                <!-- Image Gallery -->
                <div class="relative h-80 md:h-96 bg-maroon/20 flex items-center justify-center">
                    <img id="templeImage"
                         src="${this.imageGallery[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JvYnNldD0iMCIgZmlsbD0ibm9uZSIgLz4='}"
                         alt="${t.nameEnglish}"
                         class="max-h-full max-w-full object-contain rounded-2xl"
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JvYnNldD0iMCIgZmlsbD0ibm9uZSIgLz4='">

                    <!-- Navigation Arrows -->
                    ${this.imageGallery.length > 1 ? `
                        <button id="prevImage" class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold/30 flex items-center justify-center hover:bg-gold/50 transition-all">
                            <svg class="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button id="nextImage" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold/30 flex items-center justify-center hover:bg-gold/50 transition-all">
                            <svg class="w-6 h-6 text-maroon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ` : ''}
                </div>

                <!-- Gallery Dots -->
                ${this.imageGallery.length > 1 ? `
                    <div class="flex justify-center space-x-2 p-4">
                        ${this.imageGallery.map((_, i) => `
                            <div class="w-3 h-3 rounded-full cursor-pointer gallery-dot transition-all"
                                 data-index="${i}"
                                 style="background-color: ${i === this.currentImageIndex ? '#D4AF37' : '#D4AF3733'}"></div>
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Temple Details -->
                <div class="p-6 overflow-y-auto">
                    <div class="space-y-4">
                        <div>
                            <h3 class="text-gold font-bold mb-2">Sacred Details</h3>
                            <p class="text-parchment/90">${t.description}</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 class="text-gold font-semibold mb-2">Main Deity</h4>
                                <p class="text-parchment/80">${t.mainDeity}</p>
                            </div>
                            <div>
                                <h4 class="text-gold font-semibold mb-2">Location</h4>
                                <p class="text-parchment/80">${t.location}</p>
                            </div>
                            ${t.state ? `
                                <div>
                                    <h4 class="text-gold font-semibold mb-2">State</h4>
                                    <p class="text-parchment/80">${t.state}</p>
                                </div>
                            ` : ''}
                            <div>
                                <h4 class="text-gold font-semibold mb-2">Best Season</h4>
                                <p class="text-parchment/80">${t.bestSeason}</p>
                            </div>
                        </div>

                        ${t.darshanTimings ? `
                            <div class="bg-gold/10 p-4 rounded-2xl">
                                <h4 class="text-gold font-bold mb-2">Darshan Timings</h4>
                                <p class="text-parchment">${t.darshanTimings}</p>
                            </div>
                        ` : ''}

                        <div class="border-t border-gold/30 pt-4">
                            <button class="copy-url w-full py-3 rounded-full bg-gold/20 hover:bg-gold/30 text-gold font-bold transition-all"
                                    onclick="window.templeViewer.copyLink()">
                                Copy Temple Details Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showImage(index) {
        if (!this.imageGallery[index]) return;

        this.currentImageIndex = index;
        const img = document.getElementById('templeImage');
        if (img) {
            img.src = this.imageGallery[index];
        }
        this.updateGalleryIndicators();
    }

    prevImage() {
        if (this.currentImageIndex > 0) {
            this.showImage(this.currentImageIndex - 1);
        }
    }

    nextImage() {
        if (this.currentImageIndex < this.imageGallery.length - 1) {
            this.showImage(this.currentImageIndex + 1);
        }
    }

    updateGalleryIndicators() {
        document.querySelectorAll('.gallery-dot').forEach((dot, index) => {
            dot.style.backgroundColor = index === this.currentImageIndex ? '#D4AF37' : '#D4AF3733';
        });
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowRight':
                this.nextImage();
                e.preventDefault();
                break;
            case 'ArrowLeft':
                this.prevImage();
                e.preventDefault();
                break;
            case 'Escape':
                this.close();
                break;
        }
    }

    copyLink() {
        if (this.currentTemple) {
            const url = `${window.location.origin}#temple/${this.currentTemple.id}`;
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    }
}

// Initialize temple viewer
const templeViewer = new TempleViewer();
window.templeViewer = templeViewer;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TempleViewer;
}