// Sanatan Dharma Mahakosh - Search Engine
// Advanced multi-category autocomplete search

class SearchEngine {
    constructor() {
        this.scripts = window.SCRIPTURES || {};
        this.temples = window.TEMPLES || {};
        this.traditions = window.TRADITIONS || {};

        this.indexes = {
            scriptures: [],
            temples: [],
            traditions: []
        };

        this.init();
    }

    init() {
        this.buildIndexes();
        this.setupEventListeners();
    }

    buildIndexes() {
        // Build scripture index
        this.indexScriptures();

        // Build temple index
        this.indexTemples();

        // Build traditions index
        this.indexTraditions();
    }

    indexScriptures() {
        if (!this.scripts.bhagavadGita?.chapters) return;

        this.scripts.bhagavadGita.chapters.forEach(chapter => {
            this.indexes.scriptures.push({
                type: 'chapter',
                category: 'scripture',
                subcategory: 'bhagavad-gita',
                id: chapter.id,
                title: chapter.title,
                titleEnglish: chapter.titleEnglish,
                displayName: `${chapter.titleEnglish} - Chapter ${parseInt(chapter.id.split('-')[2])}`,
                keywords: [chapter.title, chapter.titleEnglish, 'gita', 'krishna', 'arjuna', 'yoga', 'bhagavad'],
                data: chapter
            });

            // Index key verses
            chapter.verses?.forEach((verse, idx) => {
                this.indexes.scriptures.push({
                    type: 'verse',
                    category: 'scripture',
                    subcategory: 'bhagavad-gita',
                    id: verse.id,
                    title: `Verse ${verse.number}.${verse.numberEnglish}`,
                    titleEnglish: `Gita Chapter ${parseInt(chapter.id.split('-')[2])}, Verse ${verse.numberEnglish}`,
                    description: verse.translation?.substring(0, 100) || '',
                    keywords: [
                        verse.sanskrit.substring(0, 50),
                        verse.transliteration?.substring(0, 50),
                        verse.translation?.toLowerCase() || ''
                    ],
                    data: { ...verse, chapterTitle: chapter.titleEnglish }
                });
            });

            // Index key verses specially
            chapter.keyVerses?.forEach(verse => {
                this.indexes.scriptures.push({
                    type: 'keyVerse',
                    category: 'scripture',
                    subcategory: 'bhagavad-gita',
                    id: verse.id,
                    title: `${chapter.titleEnglish} - Key Verse ${verse.number}.${verse.numberEnglish}`,
                    titleEnglish: `Gita ${parseInt(chapter.id.split('-')[2])}.${verse.numberEnglish}`,
                    description: verse.translation?.substring(0, 100) || '',
                    keywords: [verse.sanskrit, verse.transliteration, verse.translation].filter(Boolean),
                    featured: true
                });
            });
        });

        // Index Ramayan Kands
        if (this.scripts.ramayan?.kands) {
            this.scripts.ramayan.kands.forEach(kand => {
                this.indexes.scriptures.push({
                    type: 'kand',
                    category: 'scripture',
                    subcategory: 'ramayan',
                    id: kand.id,
                    title: kand.title,
                    titleEnglish: kand.titleEnglish,
                    displayName: kand.titleEnglish,
                    keywords: [kand.title, kand.titleEnglish, 'rama', 'ramayan', 'valmiki', 'ayodhya', 'aranya', 'kishkindha', 'sundar', 'lanka', 'uttara'],
                    data: kand
                });
            });
        }
    }

    indexTemples() {
        const categories = [
            { key: 'jyotirlingas', label: 'Jyotirlinga' },
            { key: 'shaktipeeths', label: 'Shaktipeeth' },
            { key: 'charDham', label: 'Char Dham' },
            { key: 'saptaPuri', label: 'Sapta Puri' },
            { key: 'famousTemples', label: 'Famous Temple' }
        ];

        categories.forEach(cat => {
            (this.temples[cat.key] || []).forEach(temple => {
                this.indexes.temples.push({
                    type: 'temple',
                    category: cat.label,
                    subcategory: 'temple',
                    id: temple.id,
                    title: temple.name,
                    titleEnglish: temple.nameEnglish,
                    subtitle: `${temple.mainDeity} • ${temple.state || temple.location}`,
                    description: temple.description,
                    keywords: [
                        temple.name,
                        temple.nameEnglish,
                        temple.mainDeity,
                        temple.state,
                        ...(temple.images || [])
                    ],
                    data: temple
                });
            });
        });
    }

    indexTraditions() {
        // Daily rituals
        this.traditions.dailyRituals?.forEach(r => {
            this.indexes.traditions.push({
                type: 'ritual',
                category: 'ritual',
                id: r.id,
                title: r.name,
                titleEnglish: r.nameEnglish || r.name,
                subtitle: r.description,
                keywords: [r.name, r.nameEnglish, 'daily', 'ritual', 'puja'].filter(Boolean)
            });
        });

        // Sanskars
        this.traditions.sankars?.forEach(s => {
            this.indexes.traditions.push({
                type: 'sanskar',
                category: 'sanskar',
                id: s.id,
                title: s.name,
                titleEnglish: s.nameEnglish,
                subtitle: s.when,
                description: s.description,
                keywords: [s.name, s.nameEnglish, 'sanskar', 'samskar', 'ritual'].filter(Boolean)
            });
        });

        // Vratham festivals
        this.traditions.vratham?.forEach(f => {
            this.indexes.traditions.push({
                type: 'festival',
                category: 'festival',
                id: f.id,
                title: f.name,
                titleEnglish: f.nameEnglish,
                subtitle: f.timing,
                description: f.description,
                keywords: [f.name, f.nameEnglish, 'festival', 'vratham', 'fast'].filter(Boolean)
            });
        });

        // Tilak types
        this.traditions.rituals?.tilak?.types?.forEach(t => {
            this.indexes.traditions.push({
                type: 'tilak',
                category: 'tilak',
                id: t.type || t.nameEnglish?.toLowerCase().replace(/\s+/g, '-'),
                title: t.type,
                titleEnglish: t.type,
                subtitle: t.significance || '',
                description: t.significance,
                keywords: [t.type, 'tilak', 'tilak types', 'vermilion', 'sandalwood', 'ashoka', 'bhaskar', 'tilak application'].filter(Boolean)
            });
        });

        // Rudraksha types
        this.traditions.rituals?.rudraksha?.types?.forEach(r => {
            this.indexes.traditions.push({
                type: 'rudraksha',
                category: 'rudraksha',
                id: r.id || `rudraksha-${r.fNumbers}`,
                title: r.name,
                titleEnglish: r.nameEnglish || r.name,
                subtitle: r.benefits || '',
                description: r.benefits,
                keywords: [r.name, r.nameEnglish, 'rudraksha', 'rudraksha beads', 'mukhi', `${r.fNumbers} mukhi`].filter(Boolean)
            });
        });
    }

    search(query) {
        const q = query.trim().toLowerCase();
        if (q.length < 2) return [];

        const results = [];
        const normalizedQuery = this.normalizeQuery(q);

        // Search in all indexes
        results.push(...this.searchIndex(this.indexes.scriptures, normalizedQuery, 'scripture'));
        results.push(...this.searchIndex(this.indexes.temples, normalizedQuery, 'temple'));
        results.push(...this.searchIndex(this.indexes.traditions, normalizedQuery, 'tradition'));

        // Sort by relevance and featured
        results.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            if (a.matches === b.matches) return b.score - a.score;
            return b.score - a.score;
        });

        return results.slice(0, 15);
    }

    normalizeQuery(query) {
        // Remove common prefixes like "gita", "chapter", etc.
        const prefixes = ['gita', 'bhagavad', 'chapter', 'verse', 'kanda', 'shloka'];
        let normalized = query;
        prefixes.forEach(prefix => {
            normalized = normalized.replace(new RegExp(`^${prefix}\\s*`, 'i'), '');
        });
        return normalized.trim();
    }

    searchIndex(index, query, category) {
        return index.filter(item => {
            const textToSearch = [
                item.title,
                item.titleEnglish,
                item.description,
                ...item.keywords
            ].join(' ').toLowerCase();

            // Calculate match score
            const matches = item.keywords.filter(k =>
                k.toLowerCase().includes(query)
            ).length;

            const titleMatch = (item.title.toLowerCase().includes(query) ||
                             item.titleEnglish?.toLowerCase().includes(query));

            const score = matches + (titleMatch ? 3 : 0) + (item.featured ? 2 : 0);

            this._lastMatchScore = matches;
            this._lastScore = score;

            return textToSearch.includes(query) || matches > 0 || titleMatch;
        }).map(item => ({
            ...item,
            matches: this._lastMatchScore,
            score: this._lastScore
        }));
    }

    // Type-ahead suggestions
    getSuggestions(query) {
        const results = this.search(query);
        return results.map(r => ({
            id: r.id,
            type: r.category,
            title: r.titleEnglish || r.title,
            subtitle: r.subtitle || (r.data?.description || ''),
            icon: this.getIcon(r.type)
        }));
    }

    getIcon(type) {
        const icons = {
            scripture: 'book',
            temple: 'temple',
            ritual: 'practice',
            sanskar: 'ritual',
            festival: 'celebration',
            tilak: 'tilak',
            rudraksha: 'rudraksha'
        };
        return icons[type] || 'search';
    }

    // Advanced search with filters
    advancedSearch(filters) {
        let results = [];

        if (filters.scripture) {
            results.push(...this.searchScriptures(filters.scripture));
        }
        if (filters.temple) {
            results.push(...this.searchTemples(filters.temple));
        }
        if (filters.tradition) {
            results.push(...this.searchTraditions(filters.tradition));
        }

        return [...new Set(results)];
    }

    searchScriptures(query) {
        return this.indexes.scriptures.filter(item =>
            item.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
        );
    }

    searchTemples(query) {
        return this.indexes.temples.filter(item =>
            item.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
        );
    }

    searchTraditions(query) {
        return this.indexes.traditions.filter(item =>
            item.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
        );
    }

    // Get popular searches
    getPopularSearches() {
        return [
            { query: 'gita chapter 2', type: 'verse', title: 'Gita Chapter 2, Verse 47' },
            { query: 'kedarnath', type: 'temple', title: 'Kedarnath Jyotirlinga' },
            { query: 'tilak', type: 'ritual', title: 'Tilak Types & Science' },
            { query: 'hanuman chalisa', type: 'scripture', title: 'Hanuman Chalisa' },
            { query: 'pradosh vrat', type: 'festival', title: 'Pradosh Vrat timings' },
            { query: 'sundarkand', type: 'scripture', title: 'Sundarakanda Ramayan' }
        ];
    }
}

// Initialize search engine
const searchEngine = new SearchEngine();
window.searchEngine = searchEngine;

// Enhanced search input handling
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('universalSearch');
    if (searchInput) {
        let debounceTimer;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            const query = e.target.value;

            if (query.length === 0) {
                document.getElementById('searchResults')?.classList.add('hidden');
                return;
            }

            debounceTimer = setTimeout(() => {
                const suggestions = searchEngine.getSuggestions(query);
                displaySuggestions(suggestions, query);
            }, 150);
        });
    }

    // Keyboard navigation for search results
    document.addEventListener('keydown', (e) => {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer && !resultsContainer.classList.contains('hidden')) {
            const items = resultsContainer.querySelectorAll('.search-result-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
            } else if (e.key === 'Escape') {
                resultsContainer.classList.add('hidden');
            }
        }
    });
});

function displaySuggestions(suggestions, query) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;

    if (suggestions.length === 0) {
        resultsContainer.innerHTML = `
            <div class="p-4 text-parchment/60">
                <p>No results found</p>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = suggestions.map(s => `
            <div class="p-4 hover:bg-gold/10 cursor-pointer transition-smooth border-b border-gold/20 search-result-item"
                 onclick="handleSearchClick('${s.type}', '${s.title}')">
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center mr-3">
                        <svg class="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                            ${getSuggestionIcon(s.type)}
                        </svg>
                    </div>
                    <div>
                        <div class="font-bold text-maroon">${s.title}</div>
                        <div class="text-sm text-parchment/60">${s.subtitle}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    resultsContainer.classList.remove('hidden');
}

function getSuggestionIcon(type) {
    const icons = {
        scripture: '<path d="M4 4h16c2.21 0 4 1.79 4 4v12c0 2.21-1.79-4-4-4H4c-2.21 0-4-1.79-4-4V4c0-2.21 1.79-4 4-4z" />',
        temple: '<path d="M12 2L2 7l10 5 10-5-10-5z" />',
        ritual: '<circle cx="12" cy="12" r="10" />',
        sanskar: '<path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z" />',
        festival: '<path d="M12 2a10 10 0 0 1 10 10v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a10 10 0 0 1 10-10z" />',
        celebration: '<path d="M12 2a10 10 0 0 1 10 10v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a10 10 0 0 1 10-10z" />',
        tilak: '<path d="M12 2L4 7l8 5 8-5-8-5zM4 10l8 5 8-5M4 17l8 5 8-5" />',
        rudraksha: '<circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" stroke="#fff" stroke-width="1.5" fill="none" />'
    };
    return icons[type] || '<path d="M21 21l-4.35-4.35m1.18-5.65A7.5 7.5 0 1 0 4.5 12a7.5 7.5 0 0 0 13.18-4.65z" />';
}

function handleSearchClick(type, title) {
    const input = document.getElementById('universalSearch');
    if (input) input.value = title;

    document.getElementById('searchResults')?.classList.add('hidden');

    // Perform the appropriate action
    if (type === 'scripture') {
        // Handle scripture opening
        console.log('Opening scripture:', title);
    }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchEngine;
}