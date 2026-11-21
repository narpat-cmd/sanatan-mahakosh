// Sanatan Dharma Mahakosh - Main Application Controller
// State management, navigation, and utility functions

class SanatanApp {
    constructor() {
        this.state = {
            darkMode: false,
            fontSize: 16,
            ambientSound: false,
            currentTab: 'home',
            currentBook: null,
            audioContext: null,
            dailyShlokaIndex: 0
        };

        this.dailyShlokas = [
            {
                sanskrit: "अहं सर्वस्य प्रभवो मतिर्युज्यते महर्षयः ।\nअहं विष्णुर रक्षावीर ऋद्धो दशरथस्य वंशः ॥",
                transliteration: "aḥaṃ sarvasya prabhavo matiryujyate maharṣayaḥ | ahaṃ viṣṇur rakṣāvīr ṛddho daśarathasya vaṃśaḥ ||",
                translation: "I am the source of all beings. From Me, the entire universe emerges, exists, and returns. I am the Lord of wealth, the warrior Rama, and the progenitor of Dasharatha's lineage.",
                meaning: "This verse reveals the universal form of Krishna and His omnipresence in all aspects of creation and divine forms."
            },
            {
                sanskrit: "कर्मण्य् एवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुं भूयः समो अस्तु कर्मचर्युजः ॥",
                transliteration: "karmaṇy evādhikāraste mā phaleṣu kadācana | mā karmaphalāhetuṃ bhūyaḥ samo 'stu karmacarī yujas tasmād yah",
                translation: "You have the right to work, but never to the fruit of work. Let the fruits of action be set aside, and consider the work itself as your duty.",
                meaning: "This foundational verse teaches that one should perform actions without attachment to their results, dedicating all actions to the Divine."
            },
            {
                sanskrit: "अनादि शिवः साधु धीमन्ति स्वयं च मनोज गन्धर्वा ।\nशिवका शप्ता धरतीः शाश्वतं धर्मं यदाः समाधिः ॥",
                transliteration: "anādi śivaḥ sādhu dhīmanti svayaṃ ca manoja gandharvā | śivakā śaptā dharaṇīḥ śāśvataṃ dharmaṃ yadāḥ samādhiḥ ||",
                translation: "Shiva is eternal, the wise consider him self-existent. The curse of Shiva established eternal righteousness which leads to liberation.",
                meaning: "Lord Shiva represents the eternal and unchanging principle of consciousness and liberation."
            },
            {
                sanskrit: "लोकाम्पीदानं विष्णोर्ममासादितमुपाणडितम् ।\nपुनर्भ्रमति साधु धर्मं धिया धेयमाहुर्भिषक्करम् ॥",
                transliteration: "lokampīdānaṃ viṣṇormam āsāditamupāṇḍitam | punarbhramati sādhu dharmaṃ dhiyā dh eyamāhur bhikṣak ram ||",
                translation: "I have blessed the world, I have blessed the righteous path. The sage sees the eternal righteousness as the highest goal.",
                meaning: "The blessings of the Divine sustain the world order and guide the righteous on their spiritual path."
            },
            {
                sanskrit: "तत्तत्परता वन्दे श्रीपतिमभिमनीषिणम् ।\nहरिर्मयनाथं स्वराज्यं स्वराज्यं हरिदुर्गम् ॥",
                transliteration: "tatattparatā vande śrīpatim abhimanīṣiṇam | harir mayanāthaṃ svarājyaṃ svarājyaṃ haridurgam ||",
                translation: "I bow to the Lord with deep devotion. Hari is the supreme ruler, the eternal king who grants liberation.",
                meaning: "A prayer of devotion to Lord Hari (Vishnu/Krishna) acknowledging Him as the supreme ruler of all."
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedPreferences();
        this.rotateDailyShloka();
        this.populateBookshelf();
        this.populateTemples();
        this.populateMinuteDetails();
        this.setupDarkMode();
        this.setupAudio();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Mobile Navigation
        const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
        mobileNavButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
                this.closeMobileNav();
            });
        });

        // Font Size Controls
        document.getElementById('fontDec')?.addEventListener('click', () => {
            this.adjustFontSize(-1);
        });

        document.getElementById('fontInc')?.addEventListener('click', () => {
            this.adjustFontSize(1);
        });

        // Dark Mode Toggle
        document.getElementById('darkModeToggle')?.addEventListener('click', () => {
            this.toggleDarkMode();
        });

        // Sound Toggle
        document.getElementById('soundToggle')?.addEventListener('click', () => {
            this.toggleAmbientSound();
        });

        // Mobile Nav Drawer
        document.getElementById('closeMobileNav')?.addEventListener('click', () => {
            this.closeMobileNav();
        });

        // Book Modal
        document.getElementById('closeBook')?.addEventListener('click', () => {
            this.closeBookReader();
        });

        // Temple Modal
        document.getElementById('closeTemple')?.addEventListener('click', () => {
            this.closeTempleViewer();
        });

        // Copy Button
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.copyToClipboard(e.target);
            });
        });

        // WhatsApp Share
        document.querySelectorAll('.whatsapp-share').forEach(btn => {
            btn.addEventListener('click', () => {
                this.shareOnWhatsApp();
            });
        });

        // Search Functionality
        const searchInput = document.getElementById('universalSearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });
        }

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('bookModal')) {
                this.closeBookReader();
            }
            if (e.target === document.getElementById('templeModal')) {
                this.closeTempleViewer();
            }
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeBookReader();
                this.closeTempleViewer();
            }
            if (e.key === 'Tab') {
                // Handle accessible tab navigation
            }
        });
    }

    loadSavedPreferences() {
        const saved = localStorage.getItem('sanatan-preferences');
        if (saved) {
            const prefs = JSON.parse(saved);
            if (prefs.darkMode !== undefined) this.state.darkMode = prefs.darkMode;
            if (prefs.fontSize !== undefined) this.state.fontSize = prefs.fontSize;
        }
    }

    savePreferences() {
        localStorage.setItem('sanatan-preferences', JSON.stringify(this.state));
    }

    setupDarkMode() {
        const root = document.documentElement;
        if (this.state.darkMode) {
            root.setAttribute('data-theme', 'dark');
            this.updateDarkModeUI(true);
        } else {
            root.setAttribute('data-theme', 'light');
            this.updateDarkModeUI(false);
        }
    }

    updateDarkModeUI(isDark) {
        const moonIcon = document.getElementById('moonIcon');
        if (moonIcon) {
            if (isDark) {
                moonIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-12.66l-.7.71M4.34 18.66l-.7-.71m15.71 8.29l-3.72-3.72M6.34 6.34l-3.72-3.72M17 12H3m4 7v-1m4 4v-1M9 2h1v1M4 9h1v-1m12 0h1v1M4 15h1v-1m12 0h1v1M17 12v1M9 2v1m12 0v-1" />';
            } else {
                moonIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-12.66l-.7.71M4.34 18.66l-.7-.71m15.71 8.29l-3.72-3.72M6.34 6.34l-3.72-3.72M17 12H3m4 7v-1m4 4v-1M9 2h1v1M4 9h1v-1m12 0h1v1M4 15h1v-1m12 0h1v1M17 12v1M9 2v1m12 0v-1" />'
            }
        }
    }

    toggleDarkMode() {
        this.state.darkMode = !this.state.darkMode;
        this.setupDarkMode();
        this.savePreferences();
    }

    adjustFontSize(delta) {
        this.state.fontSize += delta;
        this.state.fontSize = Math.max(12, Math.min(24, this.state.fontSize));

        document.documentElement.style.fontSize = this.state.fontSize + 'px';
        this.savePreferences();
    }

    rotateDailyShloka() {
        this.state.dailyShlokaIndex = (this.state.dailyShlokaIndex + 1) % this.dailyShlokas.length;
        this.savePreferences();
        this.updateDailyShloka();
    }

    updateDailyShloka() {
        const shloka = this.dailyShlokas[this.state.dailyShlokaIndex];
        const container = document.getElementById('dailyShloka');
        if (container && shloka) {
            container.innerHTML = `
                <div class="bg-maroon/50 border-2 border-gold/30 rounded-3xl p-8 md:p-12 shadow-2xl max-w-3xl mx-auto">
                    <h2 class="text-3xl font-heading text-gold mb-4 flex items-center">
                        <span class="w-12 h-12 rounded-full bg-saffron/20 flex items-center justify-center mr-4">ॐ</span>
                        Shloka of the Day
                    </h2>
                    <div class="space-y-4 text-center">
                        <blockquote class="text-2xl md:text-3xl font-sanskrit text-sacrament italic leading-relaxed">
                            "${shloka.sanskrit.replace(/\n/g, '<br>')}"
                        </blockquote>
                        <p class="text-lg text-parchment/90">
                            <strong class="text-gold">Meaning:</strong> ${shloka.meaning}
                        </p>
                        <div class="flex justify-center space-x-4 pt-6">
                            <button class="copy-btn px-6 py-3 rounded-full bg-gold/20 hover:bg-gold/30 text-gold transition-all" data-clipboard-text="${shloka.sanskrit}">
                                Copy
                            </button>
                            <button class="whatsapp-share px-6 py-3 rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-all flex items-center">
                                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12c0 3.56 2.17 6.69 5.21 8.71-.38.76-.54 1.64-.54 2.55 0 .36.07.73.2 1.09L2 21l4.47-2.1c.36.16.75.25 1.14.25 6.62 0 12-5.38 12-12V6c0-3.31-2.69-6-6-6zm0 2c3.31 0 6 2.69 6 6 0 2.22-1.36 4.15-3.22 5.31-.13.07-.28.12-.43.16-.47.13-.95.2-1.43.2-.67 0-1.33-.1-1.97-.32-.93-.29-1.75-.77-2.42-1.43-.66-.66-1.14-1.48-1.43-2.42-.22-.64-.32-1.3-.32-1.97 0-.48.07-.97.2-1.43.16-.43.37-.82.61-1.14C8.37 10.3 10.22 11 12 11c2.21 0 4-1.79 4-4S14.21 4 12 4z"/>
                                </svg>
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            `;
            this.setupCopyButton();
            this.setupWhatsAppShare();
        }
    }

    setupCopyButton() {
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                navigator.clipboard.writeText(e.target.dataset.clipboardText).then(() => {
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Copied!';
                    e.target.classList.add('bg-green-500/20', 'text-green-400');
                    setTimeout(() => {
                        e.target.textContent = originalText;
                        e.target.classList.remove('bg-green-500/20', 'text-green-400');
                    }, 2000);
                });
            });
        }
    }

    setupWhatsAppShare() {
        const waBtn = document.querySelector('.whatsapp-share');
        if (waBtn) {
            waBtn.addEventListener('click', () => {
                const shloka = this.dailyShlokas[this.state.dailyShlokaIndex];
                const text = encodeURIComponent(`${shloka.sanskrit} - Sanatan Dharma Mahakosh`);
                window.open(`https://wa.me/?text=${text}`, '_blank');
            });
        }
    }

    setupAudio() {
        const audio = document.getElementById('templeAudio');
        if (audio) {
            audio.volume = 0.3;
        }

        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.toggleAmbientSound();
            });
        }
    }

    toggleAmbientSound() {
        this.state.ambientSound = !this.state.ambientSound;
        const audio = document.getElementById('templeAudio');
        const soundIcon = document.getElementById('soundIcon');

        if (this.state.ambientSound && audio) {
            audio.play().catch(e => console.log('Audio play blocked by browser'));
            soundIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4a2 2 0 002 2h2.59a3 3 0 01-1.3 4L8.5 20.79A2 2 0 008 22h8a2 2 0 002-2V8a2 2 0 00-2-2h-3.59a3 3 0 011.3-4H19a2 2 0 002-2V3a2 2 0 00-2-2H5a2 2 0 00-2 2z" />';
        } else {
            if (audio) audio.pause();
            soundIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
        }
    }

    switchTab(tabName) {
        this.state.currentTab = tabName;

        // Update active tab styling
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('bg-gold/20', 'text-gold', 'font-bold');
        });
        document.querySelector(`.nav-tab[data-tab="${tabName}"]`)?.classList.add('bg-gold/20', 'text-gold', 'font-bold');

        // Hide all tab content, show current
        document.querySelectorAll('[id$="Container"]').forEach(container => {
            container.classList.add('hidden');
        });

        // Close mobile nav on tab change
        this.closeMobileNav();

        // Scroll to appropriate section
        if (tabName === 'home') {
            document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
        }
    }

    closeMobileNav() {
        const nav = document.getElementById('mobileNav');
        if (nav) nav.classList.add('hidden');
    }

    openBookReader(bookId) {
        // Try Bhagavad Gita chapters
        let bookData = window.SCRIPTURES?.bhagavadGita?.chapters?.find(c => c.id === bookId);

        // Try Ramayan Kands
        if (!bookData) {
            bookData = window.SCRIPTURES?.ramayan?.kands?.find(k => k.id === bookId);
            if (bookData) {
                bookData.verses = [];
            }
        }

        // Try Vedas
        if (!bookData && window.SCRIPTURES?.vedas) {
            bookData = window.SCRIPTURES.vedas.find(v => v.id === bookId);
        }

        if (!bookData) {
            console.warn('Book not found:', bookId);
            return;
        }

        this.state.currentBook = bookId;
        const modal = document.getElementById('bookModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeBookReader() {
        const modal = document.getElementById('bookModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        this.state.currentBook = null;
    }

    openTempleViewer(templeId) {
        const templeData = window.TEMPLES?.jyotirlingas?.find(t => t.id === templeId) ||
                          window.TEMPLES?.shaktipeeths?.find(t => t.id === templeId) ||
                          window.TEMPLES?.charDham?.find(t => t.id === templeId) ||
                          window.TEMPLES?.saptaPuri?.find(t => t.id === templeId) ||
                          window.TEMPLES?.famousTemples?.find(t => t.id === templeId);
        if (!templeData) {
            console.warn('Temple not found:', templeId);
            return;
        }

        this.state.currentTemple = templeId;
        const modal = document.getElementById('templeModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeTempleViewer() {
        const modal = document.getElementById('templeModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        this.state.currentTemple = null;
    }

    copyToClipboard(button) {
        const text = button.dataset.clipboardText;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        });
    }

    shareOnWhatsApp() {
        const shloka = this.dailyShlokas[this.state.dailyShlokaIndex];
        const text = encodeURIComponent(`${shloka.sanskrit}\n\n${shloka.translation}\n\nRead more at Sanatan Dharma Mahakosh`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    }

    populateBookshelf() {
        const container = document.getElementById('bookshelf');
        if (!container) return;

        const books = [
            { id: 'gita-ch2', title: 'भगवद्गीता', author: 'श्रीकृष्ण', displayTitle: 'भगवद्गीता' },
            { id: 'rama-balakand', title: 'रामायण', author: 'वाल्मीकि', displayTitle: 'रामायण' },
            { id: 'rigveda', title: 'ऋग्वेद', author: 'वेद', displayTitle: 'ऋग्वेद' },
            { id: 'katha-up', title: 'कथा उपनिषद्', author: 'बृहस्पति', displayTitle: 'कथा' },
            { id: 'shiv-purana', title: 'शिव पुराण', author: 'शिव', displayTitle: 'शिव' },
            { id: 'durga-saptasati', title: 'दुर्गा सप्तशती', author: 'मार्कण्डेय', displayTitle: 'दुर्गा सप्तशती' },
            { id: 'hanuman-chalisa', title: 'हनुमत्क चालीसा', author: 'तुलसीदास', displayTitle: 'हनुमत्क' },
            { id: 'ganesh-aarti', title: 'गणेश आरती', author: 'भक्त', displayTitle: 'गणेश आरती' }
        ];

        books.forEach((book, index) => {
            const rotation = 'rotateY(' + (Math.random() * 40 - 20) + 'deg)';
            const delay = index * 0.1;

            const bookElement = document.createElement('div');
            bookElement.className = 'book transition-smooth';
            bookElement.style.transform = 'translateX(' + (index * 140 - 280) + 'px) rotateX(2deg)';
            bookElement.style.animationDelay = delay + 's';
            bookElement.dataset.bookId = book.id;
            bookElement.innerHTML = `
                <div class="book-front p-4 flex flex-col justify-between">
                    <div>
                        <h3 class="font-heading text-gold text-lg mb-2">${book.displayTitle}</h3>
                        <p class="text-xs text-maroon/60">${book.author}</p>
                    </div>
                    <div class="text-xs text-maroon/80 mt-2">📖</div>
                </div>
                <div class="page-curl"></div>
            `;
            bookElement.addEventListener('click', () => {
                this.openBookReader(book.id);
            });
            container.appendChild(bookElement);
        });
    }

    populateTemples() {
        const container = document.getElementById('templeGrid');
        if (!container) return;

        const temples = [...(window.TEMPLES?.jyotirlingas || []),
                         ...(window.TEMPLES?.shaktipeeths || []),
                         ...(window.TEMPLES?.charDham || []),
                         ...(window.TEMPLES?.saptaPuri || []),
                         ...(window.TEMPLES?.famousTemples || [])];

        temples.forEach(temple => {
            const card = document.createElement('div');
            card.className = 'temple-card bg-parchment/10 border border-gold/30 rounded-3xl overflow-hidden transition-smooth hover:scale-105';
            card.dataset.templeId = temple.id;
            card.innerHTML = `
                <img src="${temple.images[0] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JvYnNldD0iMCIgZmlsbD0ibm9uZSIgLz4='}"
                     alt="${temple.nameEnglish}"
                     class="w-full h-48 object-cover"
                     loading="lazy"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JvYnNldD0iMCIgZmlsbD0ibm9uZSIgLz4='">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <span class="px-3 py-1 text-xs font-bold rounded-full bg-gold/20 text-gold">${temple.category}</span>
                    </div>
                    <h3 class="font-heading text-maroon text-xl mb-2">${temple.nameEnglish}</h3>
                    <p class="text-parchment/80 text-sm mb-4">${temple.mainDeity}</p>
                    <button class="view-btn w-full py-2 rounded-full bg-gold text-maroon font-bold hover:bg-saffron transition-smooth"
                            onclick="window.sanatanApp.openTempleViewer('${temple.id}')">
                        View Details
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    populateMinuteDetails() {
        const container = document.getElementById('minuteDetailsGrid');
        if (!container) return;

        const items = [
            { id: 'tilak', title: 'तिलक विज्ञान', description: 'The sacred forehead mark - cooling, auspicious, spiritual activation' },
            { id: 'deepak', title: 'दीपक नियम', description: 'Rules for oil lamps - wick direction, materials, timing, and benefits' },
            { id: 'janeu', title: 'जनेऊ संकार', description: 'Sacred thread ceremony and its spiritual significance' },
            { id: 'rudraksha', title: 'रुद्रक्ष गाइड', description: 'Complete guide to 9 mukhi rudraksha benefits' },
            { id: 'pooja', title: 'पूजा विधि', description: 'Step-by-step home puja procedure and timings' },
            { id: 'sadhan', title: 'साधना सूत्र', description: 'Daily spiritual practices for modern life' }
        ];

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-maroon/50 border border-gold/30 rounded-3xl p-6 transition-smooth hover:scale-105';
            card.innerHTML = `
                <h3 class="font-heading text-gold text-xl mb-3">${item.title}</h3>
                <p class="text-parchment/90 mb-4">${item.description}</p>
                <button class="read-more text-saffron font-bold hover:underline"
                        onclick="window.sanatanApp.readMore('${item.id}')">
                    Read More →
                </button>
            `;
            container.appendChild(card);
        });
    }

    readMore(itemId) {
        // Handle reading more about specific item
        console.log('Reading more about:', itemId);
    }

    performSearch(query) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer || !query) {
            resultsContainer.classList.add('hidden');
            return;
        }

        const results = this.searchScriptures(query)
                    .concat(this.searchTemples(query))
                    .concat(this.searchTraditions(query))
                    .slice(0, 10);

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="p-4 text-parchment/60">
                    <p>No results found for "${query}"</p>
                    <p class="text-sm mt-2">Try searching for: Gita, Ramayan, Kedarnath, Tilak, etc.</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = results.map(result => `
                <div class="p-4 hover:bg-gold/10 cursor-pointer transition-smooth border-b border-gold/20"
                     onclick="window.sanatanApp.openResult('${result.type}', '${result.id}')">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center mr-3">
                            <svg class="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                                ${this.getIconForType(result.type)}
                            </svg>
                        </div>
                        <div>
                            <div class="font-bold text-maroon">${result.title}</div>
                            <div class="text-sm text-parchment/60">${result.subtitle}</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        resultsContainer.classList.remove('hidden');
    }

    searchScriptures(query) {
        const results = [];
        const q = query.toLowerCase();

        // Search in Gita chapters
        if (window.SCRIPTURES?.bhagavadGita?.chapters) {
            window.SCRIPTURES.bhagavadGita.chapters.forEach(ch => {
                if (ch.title.toLowerCase().includes(q) || ch.titleEnglish.toLowerCase().includes(q)) {
                    results.push({ type: 'scripture', id: ch.id, title: ch.titleEnglish, subtitle: ch.titleEnglish });
                }
            });

            // Search key verses
            window.SCRIPTURES.bhagavadGita.chapters.forEach(ch => {
                ch.keyVerses?.forEach(v => {
                    if (v.sanskrit.toLowerCase().includes(q) || v.transliteration?.toLowerCase().includes(q) || (v.translation?.toLowerCase().includes(q))) {
                        results.push({
                            type: 'scripture',
                            id: v.id,
                            title: `Gita ${v.number}.${v.numberEnglish}`,
                            subtitle: v.translation?.substring(0, 80) + '...' || ''
                        });
                    }
                });
            });
        }

        // Search in Ramayan Kands
        if (window.SCRIPTURES?.ramayan?.kands) {
            window.SCRIPTURES.ramayan.kands.forEach(kand => {
                if (kand.title.toLowerCase().includes(q) || kand.titleEnglish.toLowerCase().includes(q)) {
                    results.push({ type: 'scripture', id: kand.id, title: kand.titleEnglish, subtitle: kand.titleEnglish || '' });
                }
            });
        }

        // Search in Vedas
        if (window.SCRIPTURES?.vedas?.vedas) {
            window.SCRIPTURES.vedas.vedas.forEach(veda => {
                if (veda.name.toLowerCase().includes(q) || veda.nameEnglish?.toLowerCase().includes(q)) {
                    results.push({ type: 'scripture', id: veda.id, title: veda.nameEnglish || veda.name, subtitle: veda.description || '' });
                }
            });
        }

        return results;
    }

    searchTemples(query) {
        const results = [];
        const q = query.toLowerCase();

        const templeCategories = ['jyotirlingas', 'shaktipeeths', 'charDham', 'saptaPuri', 'famousTemples'];
        templeCategories.forEach(category => {
            window.TEMPLES?.[category]?.forEach(temple => {
                if (temple.name.toLowerCase().includes(q) || temple.nameEnglish.toLowerCase().includes(q)) {
                    results.push({
                        type: 'temple',
                        id: temple.id,
                        title: temple.nameEnglish,
                        subtitle: temple.mainDeity
                    });
                }
            });
        });

        return results;
    }

    searchTraditions(query) {
        const results = [];
        const q = query.toLowerCase();

        window.TRADITIONS?.dailyRituals?.forEach(r => {
            if (r.name.toLowerCase().includes(q) || r.nameEnglish?.toLowerCase().includes(q)) {
                results.push({ type: 'tradition', id: r.id, title: r.nameEnglish || r.name, subtitle: r.description });
            }
        });

        window.TRADITIONS?.sankars?.forEach(s => {
            if (s.name.toLowerCase().includes(q) || s.nameEnglish?.toLowerCase().includes(q)) {
                results.push({ type: 'sanskar', id: s.id, title: s.nameEnglish || s.name, subtitle: s.when });
            }
        });

        // Search tilak types
        if (window.TRADITIONS?.rituals?.tilak?.types) {
            window.TRADITIONS.rituals.tilak.types.forEach(t => {
                const typeEng = t.type?.replace(' संदल वृक्ष तिलक', 'Sandal Tree Tilak').replace(' भास्कर तिलक', 'Saffron Tilak').replace(' अशोक तिलक', 'Ashoka Tilak') || 'Tilak';
                if (typeEng.toLowerCase().includes(q) || t.type?.toLowerCase().includes(q)) {
                    results.push({ type: 'tradition', id: `tilak-${t.type}`, title: typeEng, subtitle: t.significance });
                }
            });
        }

        // Search rudraksha types
        if (window.TRADITIONS?.rituals?.rudraksha?.types) {
            window.TRADITIONS.rituals.rudraksha.types.forEach(r => {
                const nameEng = r.name || `Rudraksha ${r.fNumbers} Mukhi`;
                if (nameEng.toLowerCase().includes(q)) {
                    results.push({ type: 'tradition', id: `rudraksha-${r.fNumbers}`, title: nameEng, subtitle: r.benefits });
                }
            });
        }

        return results;
    }

    getIconForType(type) {
        const icons = {
            scripture: '<circle cx="12" cy="12" r="10" fill="currentColor" />',
            temple: '<rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" />',
            tradition: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2" />',
            sanskar: '<path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z" fill="none" stroke="currentColor" stroke-width="2" />'
        };
        return icons[type] || '<circle cx="12" cy="12" r="10" fill="currentColor" />';
    }

    openResult(type, id) {
        if (type === 'scripture') {
            this.openBookReader(id);
        } else if (type === 'temple') {
            this.openTempleViewer(id);
        }
        document.getElementById('universalSearch').value = '';
        document.getElementById('searchResults').classList.add('hidden');
    }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.sanatanApp = new SanatanApp();
    });
} else {
    window.sanatanApp = new SanatanApp();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SanatanApp;
}