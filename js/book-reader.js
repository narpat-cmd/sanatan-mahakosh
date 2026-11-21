// Sanatan Dharma Mahakosh - Book Reader Module
// 3D Page-flip physics using StPageFlip CDN

class BookReader {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 0;
        this.currentBook = null;
        this.bookInstance = null;
        this.audioContext = null;
        this.pageRustle = null;
        this.init();
    }

    init() {
        this.loadAudioAssets();
        this.setupEventListeners();
    }

    loadAudioAssets() {
        // Load ambient temple sounds
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    setupEventListeners() {
        document.getElementById('closeBook')?.addEventListener('click', () => {
            this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('bookModal')?.classList.contains('hidden')) {
                this.handleKeyboard(e);
            }
        });
    }

    open(bookId) {
        const bookData = this.getBookData(bookId);
        if (!bookData) return;

        this.currentBook = bookData;
        this.totalPages = bookData.verses?.length || 20;
        this.currentPage = 1;

        this.showModal();
        this.initializePageFlip();
    }

    getBookData(bookId) {
        // Get book data from SCRIPTURES object
        if (window.SCRIPTURES?.bhagavadGita?.chapters) {
            const chapter = window.SCRIPTURES.bhagavadGita.chapters.find(c => c.id === bookId);
            if (chapter) return chapter;
        }

        // Get from Ramayan
        if (window.SCRIPTURES?.ramayan?.kands) {
            const kand = window.SCRIPTURES.ramayan.kands.find(k => k.id === bookId);
            if (kand) return { ...kand, verses: [] };
        }

        return null;
    }

    showModal() {
        const modal = document.getElementById('bookModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        const modal = document.getElementById('bookModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }

        if (this.bookInstance) {
            this.bookInstance.destroy();
            this.bookInstance = null;
        }

        const container = document.getElementById('bookContainer');
        if (container) container.innerHTML = '';
    }

    initializePageFlip() {
        const container = document.getElementById('bookContainer');
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Create book structure
        const bookHTML = this.createBookStructure();
        container.innerHTML = bookHTML;

        // Initialize page flip using StPageFlip
        setTimeout(() => {
            try {
                const PF = window.PageFlip;
                this.bookInstance = new PF('#book', {
                    width: 800,
                    height: 1000,
                    size: 'fixed',
                    coverOrientation: 'vertical',
                    derivativesSizeOnDesktop: 'auto',
                    derivativesOnMobile: 'auto',
                    showCover: true,
                    autoCenter: true,
                    animationTimingFunction: 'cubic-bezier(0.3, 0, 0.25, 1)',
                    flippingTime: 300,
                    disableFlip: false,
                    disableCover: false,
                    disablePageFlip: false,
                    clickDistance: 10,
                    widthMaxRatio: 0.85,
                    widthMinRatio: 0.5,
                    minWidth: 0,
                    heightLimitRatio: 1.3,
                    mobileLayout: 'single page',
                    lightMargin: 40,
                    margin: 20
                });

                // Load pages
                this.loadBookPages();

                // Setup event listeners
                this.setupPageListeners();
            } catch (e) {
                // Fallback to custom 3D implementation
                this.createCustomBook();
            }
        }, 100);
    }

    createBookStructure() {
        const book = document.createElement('div');
        book.id = 'book';
        book.className = 'relative';
        book.style.width = '800px';
        book.style.height = '1000px';
        book.style.background = 'transparent';

        // Create pages
        for (let i = 0; i <= this.totalPages + 2; i++) {
            const page = document.createElement('div');
            page.className = 'page';
            page.style.width = '100%';
            page.style.height = '100%';
            page.style.background = 'linear-gradient(145deg, #F9F1DF, #F2E2C4)';
            page.style.border = '1px solid rgba(212, 155, 39, 0.3)';
            page.style.borderLeft = '3px solid #D4AF37';
            page.style.borderRight = '3px solid #C59B27';
            page.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            page.style.position = 'relative';
            page.style.overflow = 'hidden';
            page.style.display = 'flex';
            page.style.flexDirection = 'column';
            page.style.padding = '40px';
            page.style.fontSize = '18px';

            // Page number indicator
            const pageNum = document.createElement('div');
            pageNum.className = 'absolute top-4 right-4 text-gold font-bold text-sm';
            pageNum.textContent = i === 0 ? 'Cover' : i > this.totalPages + 1 ? 'Back Cover' : `Page ${i - 1}`;
            pageNum.style.background = 'rgba(212, 155, 39, 0.2)';
            pageNum.style.padding = '5px 15px';
            pageNum.style.borderRadius = '20px';

            // Page content container
            const content = document.createElement('div');
            content.className = 'page-content flex-1';
            content.style.color = '#6B0F1A';

            page.appendChild(pageNum);
            page.appendChild(content);
            book.appendChild(page);
        }

        return book.outerHTML;
    }

    loadBookPages() {
        // Load content for each page
        this.loadCoverPage();
        this.loadChapterPage();
        this.loadContentPages();
        this.loadBackCover();
    }

    loadCoverPage() {
        const firstPage = document.querySelector('#book .page:first-child');
        if (firstPage) {
            const content = firstPage.querySelector('.page-content');
            if (content) {
                content.innerHTML = `
                    <div class="text-center">
                        <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                            <span class="text-6xl font-bold text-gold">ॐ</span>
                        </div>
                        <h1 class="font-heading text-4xl text-maroon mb-4">${this.currentBook?.titleEnglish || this.currentBook?.title}</h1>
                        <p class="text-lg text-parchment/70 mb-6">${this.currentBook?.description || 'Sacred Scripture'}</p>
                        <div class="border-2 border-gold/30 rounded-full w-16 h-16 mx-auto"></div>
                    </div>
                `;
            }
        }
    }

    loadChapterPage() {
        const secondPage = document.querySelector('#book .page:nth-child(2)');
        if (secondPage && this.currentBook?.verses) {
            const content = secondPage.querySelector('.page-content');
            if (content) {
                const keyVerse = this.currentBook.keyVerses?.[0] || this.currentBook.verses[0];
                content.innerHTML = this.createVersePage(keyVerse);
            }
        }
    }

    createVersePage(verse) {
        return `
            <div class="space-y-6">
                <h2 class="font-heading text-2xl text-gold mb-4 flex items-center">
                    <span class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center mr-3">॥</span>
                    ${verse.titleEnglish || 'Shloka'}
                </h2>
                <div class="border-l-4 border-gold/30 pl-6 mb-4">
                    <blockquote class="font-sanskrit text-3xl text-sacrament italic mb-4 leading-relaxed">
                        ${verse.sanskrit.replace(/\n/g, '<br>')}
                    </blockquote>
                    <div class="text-lg text-maroon bg-gold/10 p-4 rounded">
                        ${verse.transliteration || ''}
                    </div>
                </div>
                <div class="bg-maroon/10 p-4 rounded">
                    <h4 class="font-bold text-gold mb-2">Translation</h4>
                    <p class="text-parchment mb-3">${verse.translation || verse.meaning || ''}</p>
                    <h4 class="font-bold text-gold mb-2">Meaning</h4>
                    <p class="text-parchment">${verse.meaning || ''}</p>
                </div>
            </div>
        `;
    }

    loadContentPages() {
        const pages = document.querySelectorAll('#book .page');
        const verseIndex = this.currentBook?.keyVerses?.length || 3;

        for (let i = 2; i < pages.length - 1 && i < verseIndex; i++) {
            const page = pages[i];
            const content = page.querySelector('.page-content');
            const verse = this.currentBook?.keyVerses?.[i - 2] || this.currentBook?.verses?.[i - 2];

            if (content && verse) {
                content.innerHTML = this.createVersePage(verse);
            }
        }
    }

    loadBackCover() {
        const lastPage = document.querySelector('#book .page:last-child');
        if (lastPage) {
            const content = lastPage.querySelector('.page-content');
            if (content) {
                content.innerHTML = `
                    <div class="text-center">
                        <h3 class="font-heading text-2xl text-gold mb-6">Shraddha & Samarpanam</h3>
                        <p class="text-parchment/80 mb-8 max-w-md">
                            May this sacred knowledge bring you wisdom, peace, and spiritual growth.
                            Share this knowledge with those who seek the truth.
                        </p>
                        <div class="flex justify-center space-x-4">
                            <button class="copy-url px-6 py-3 rounded-full bg-gold/20 hover:bg-gold/30 text-gold transition-all">
                                Share
                            </button>
                            <button class="close-book px-6 py-3 rounded-full bg-saffron/20 hover:bg-saffron/30 text-saffron transition-all"
                                    onclick="window.sanatanApp.closeBookReader()">
                                Close Book
                            </button>
                        </div>
                    </div>
                `;
            }
        }
    }

    createCustomBook() {
        // Fallback: Create a more traditional book display without page-flip library
        const container = document.getElementById('bookContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="flex items-center justify-center h-full bg-sandalwood-dark">
                <div class="w-1/2 h-3/4 bg-maroon rounded-l-3xl shadow-2xl flex items-center justify-center">
                    <div class="text-center p-8">
                        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
                            <span class="text-4xl font-bold text-gold">ॐ</span>
                        </div>
                        <h1 class="font-heading text-3xl text-gold mb-4">${this.currentBook?.titleEnglish || this.currentBook?.title}</h1>
                        <p class="text-parchment/80">${this.currentBook?.description || 'Sacred Scripture'}</p>
                    </div>
                </div>
                <div class="w-1/2 h-3/4 bg-parchment rounded-r-3xl shadow-2xl flex items-center justify-center overflow-y-auto">
                    <div class="p-12 text-maroon">
                        ${this.renderCurrentPage()}
                    </div>
                </div>
            </div>
        `;
    }

    renderCurrentPage() {
        if (!this.currentBook?.verses?.[0]) {
            return '<p class="text-parchment/60">Loading content...</p>';
        }

        const verse = this.currentBook.verses[0];
        return `
            <div class="space-y-6">
                <h2 class="font-heading text-2xl text-gold mb-4">${this.currentBook.titleEnglish}</h2>
                <blockquote class="font-sanskrit text-2xl text-sacrament italic mb-4">
                    ${verse.sanskrit.replace(/\n/g, '<br>')}
                </blockquote>
                <div class="text-lg text-maroon bg-gold/10 p-4 rounded">
                    ${verse.transliteration || ''}
                </div>
                <p class="text-base text-parchment/80">${verse.translation || verse.meaning || ''}</p>
            </div>
        `;
    }

    setupPageListeners() {
        if (!this.bookInstance) return;

        this.bookInstance.on('flip', (page) => {
            this.onPageFlip(page + 1);
        });
    }

    onPageFlip(pageNumber) {
        this.currentPage = pageNumber;

        // Play page rustle sound
        this.playPageSound();

        // Update UI
        this.updatePageInfo();
    }

    playPageSound() {
        // Create a simple rustle sound effect
        if (this.audioContext) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);

            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.15);
        }
    }

    updatePageInfo() {
        document.querySelectorAll('#book .page .absolute.top-4.right-4').forEach(el => {
            el.textContent = `\`${this.currentPage > this.totalPages + 1 ? 'Back Cover' : this.currentPage === 0 ? 'Cover' : `Page ${this.currentPage}`}`;
        });
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
                this.nextPage();
                break;
            case 'ArrowLeft':
            case 'PageDown':
                this.prevPage();
                break;
            case 'Home':
                this.firstPage();
                break;
            case 'End':
                this.lastPage();
                break;
        }
        e.preventDefault();
    }

    nextPage() {
        if (this.bookInstance && this.currentPage < this.totalPages + 2) {
            this.bookInstance.flipToNextPage();
        }
    }

    prevPage() {
        if (this.bookInstance && this.currentPage > 1) {
            this.bookInstance.flipToPreviousPage();
        }
    }

    firstPage() {
        if (this.bookInstance) {
            this.bookInstance.flipToPage(1);
        }
    }

    lastPage() {
        if (this.bookInstance) {
            this.bookInstance.flipToPage(this.totalPages + 2);
        }
    }

    goToPage(page) {
        if (this.bookInstance && page > 0 && page <= this.totalPages + 2) {
            this.bookInstance.flipToPage(page);
        }
    }
}

// Initialize book reader when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.bookReader = new BookReader();
    });
} else {
    window.bookReader = new BookReader();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookReader;
}