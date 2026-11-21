// Sanatan Dharma Mahakosh - Traditions & Daily Rituals Database

window.TRADITIONS = {
    dailyRituals: [
        {
            id: "bramha-muhurta",
            name: "ब्रह्म मुहूर्त",
            nameEnglish: "Brahma Muhurta",
            description: "The sacred time of pre-dawn, 1 hour and 36 minutes before sunrise",
            significance: "Optimal time for meditation, yoga practice, and spiritual disciplines",
            scientificBasis: "The cosmic clock aligns, circadian rhythms are most receptive to spiritual practices",
            timing: "Arrives 96 minutes before sunrise",
            benefits: "Enhanced mental clarity, meditation depth, and spiritual connection"
        },
        {
            id: "surya-arghya",
            name: "सूर्य आर्घ्य",
            nameEnglish: "Surya Arghya",
            description: "Offering of water to the sun god at sunrise",
            significance: "Honors Surya Dev, source of life and energy",
            procedure: [
                "Face East at sunrise",
                "Offer water in a copper vessel while chanting Surya Sahasranama",
                "Sprinkle water on feet and hands",
                "Conclude with 'Om Sri Surya Namah' 108 times"
            ],
            scientificBasis: "Vitamin D synthesis, eye health, circadian rhythm regulation"
        },
        {
            id: "tilak",
            name: "तिलक",
            nameEnglish: "Tilak",
            types: [
                {
                    type: "संदल वृक्ष तिलक",
                    ingredients: "Sandalwood paste",
                    significance: "Cooling, calming the mind, associated with Lord Shiva",
                    application: "Three horizontal lines above the forehead"
                },
                {
                    type: "भास्कर तिलक",
                    ingredients: "Kumkum (saffron powder)",
                    significance: "Auspicious, associated with Goddess Lakshmi and Parvati",
                    application: "Single vertical line with small decorative patterns"
                },
                {
                    type: "अशोक तिलक",
                    ingredients: "Red vermilion",
                    significance: "Passion and devotion, associated with Krishna",
                    application: "U-shaped marking"
                }
            ]
        }
    ],

    sankars: [
        {
            id: "garbhadhana",
            name: "गर्भधान संकार",
            nameEnglish: "Garbhadhana Sanskar",
            when: "Before conception",
            mantra: "इतीऽस्तु गर्भे धनुर्वती हिमादिवृक्षस्य प्रति",
            significance: "Invokes divine energy for a blessed pregnancy",
            practice: "Worship of the divine cosmic energies in the womb"
        },
        {
            id: "namakarana",
            name: "नामकरण संकार",
            nameEnglish: "Namakarana Sanskar",
            when: "Between 9-12 months",
            significance: "Gift of the divine name, soul's first identity",
            procedure: "Name given by a wise person, name must auspicious",
            mantras: "Om Namah Shivaya, Govinda"
        },
        {
            id: "chudakarana",
            name: "चूड़ाकरण संकार",
            nameEnglish: "Chudakarana Sanskar",
            when: "1 year old (boy), 8 years old (girl)",
            hairStyle: "Traditional top-knot",
            significance: "First hair-cutting ceremony, symbolic of cutting ego"
        },
        {
            id: "kartigandan",
            name: "कार्तिक दग्धा संकार",
            nameEnglish: "Kartigandan Sanskar",
            when: "Vishukleicha month",
            significance: "First participation in Linga worship and decoration"
        },
        {
            id: "upanayana",
            name: "उपनयन संकार",
            nameEnglish: "Upanayana Sanskar",
            when: "After horoscope matching",
            significance: "Sacred thread ceremony, beginning of formal education",
            ritual: "Three sacred strands of hair given by father to guru"
        },
        {
            id: "vivaha",
            name: "विवाह संकार",
            nameEnglish: "Vivaha Sanskar",
            when: "When both partners are of marriageable age",
            significance: "Union of souls, commitment to dharma",
            ceremonies: ["Kanyadan", "Phere", "Saptapadi"]
        },
        {
            id: "antyeshti",
            name: "अन्त्येष्टि संकार",
            nameEnglish: "Antyeshti Sanskar",
            when: "End of life",
            significance: "Transition from physical to spiritual form",
            ritual: "Last rites performed by eldest son"
        }
    ],

    panchang: [
        {
            id: "muhurtas",
            name: "महोत्सव मुहूर्त",
            nameEnglish: "Festive Muhurtas",
            timings: {
                "शुक्लपक्ष": {
                    "त्रिपुरारी": "5:30-7:00",
                    "भाव": "7:00-8:30",
                    "अमर": "8:30-10:00"
                },
                "कृष्णपक्ष": {
                    "पूर्णिमा": "5:30-7:00",
                    "विघ्न": "7:00-8:30",
                    "रात्रि": "8:30-10:00"
                }
            }
        },
        {
            id: "tithis",
            name: "तिथिः",
            nameEnglish: "Tithi (Lunar Day)",
            significance: "Auspicious activities performed according to lunar calendar",
            types: ["Shukla Paksha", "Krishna Paksha", "Purnima", "Amavasya"]
        }
    ],

    rituals: {
        homePuja: {
            name: "गृह पूजा",
            nameEnglish: "Home Puja",
            sections: [
                {
                    title: "इशान कोण सेटअप",
                    titleEnglish: "Ishanya Corner Setup",
                    direction: "North-East (Ishanya) is most auspicious",
                    items: [
                        "Idol or yantra of chosen deity",
                        "Fresh flowers and fruits",
                        "Diyaa (oil lamp) with ghee",
                        "Pure water (Gangajal if available)"
                    ]
                },
                {
                    title: "दिवसीय पूजा",
                    titleEnglish: "Daily Puja",
                    steps: [
                        "Bath and wear clean clothes",
                        "Clean the puja area",
                        "Offer flowers, then fruit",
                        "Light diyas and incense",
                        "Offer food and worship",
                        "Prasad distribution"
                    ]
                },
                {
                    title: "धूप व अग्नि",
                    titleEnglish: "Incense and Fire",
                    types: [
                        "Sandalwood dhoop - cooling",
                        "Jaggery agarbatti - sweet aroma",
                        "Camphor - pure offering"
                    ]
                }
            ]
        },

        diyaRules: {
            name: "दीपक नियम",
            nameEnglish: "Diya Rules",
            materials: {
                "चंदन तेल": {
                    oil: "Sesame oil",
                    reason: "Heating the body, promotes circulation, helps digestion",
                    wick: "Cotton, oriented East-West"
                },
                "गुड़": {
                    wick: "Cotton string",
                    orientation: "wick should face East",
                    timing: "Lit first in the morning before worship"
                },
                "गहूँ": {
                    oil: "Mustard oil",
                    benefit: "Purifies the surrounding area, drives away negative energy"
                }
            },
            lighting: {
                direction: "Always light from left to right",
                order: "Outer diyas lit before inner ones",
                extinguishing: "Blow gently, never step on or throw water"
            }
        },

        rudraksha: {
            name: "रुद्रक्ष गाइड",
            nameEnglish: "Rudraksh Guide",
            types: [
                {
                    fNumbers: 1,
                    name: "एक मुक्ती",
                    benefits: "भगवान शिव के सर्वशठ बरकता",
                    wearing: "आगे वा बाएँ गुंडा में"
                },
                {
                    fNumbers: 2,
                    name: "दो मुक्ती",
                    benefits: "भद्रा और शिव की कृपा",
                    wearing: "आगे वा माथे पर"
                },
                {
                    fNumbers: 3,
                    name: "तीन मुक्ती",
                    benefits: "ब्रह्मा, विष्णु, शिव की शक्ति",
                    wearing: "भर्ती में या आगे"
                },
                {
                    fNumbers: 4,
                    name: "चार मुक्ती",
                    benefits: "चतुर्स्थ विद्या और समृद्धि",
                    wearing: "भर्ती में"
                },
                {
                    fNumbers: 5,
                    name: "पाँच मुक्ती",
                    benefits: "पाँच साहसिकता और साहसी बनता है",
                    wearing: "आगे वा माथे पर"
                },
                {
                    fNumbers: 6,
                    name: "छः मुक्ती",
                    benefits: "भारतीय रक्षा और स्वास्थ्य",
                    wearing: "भर्ती में"
                },
                {
                    fNumbers: 7,
                    name: "सात मुक्ती",
                    benefits: "आध्यात्मिक ज्ञान और गुना मोक्ष",
                    wearing: "माथे पर"
                },
                {
                    fNumbers: 9,
                    name: "नौ मुक्ती",
                    benefits: "अमर संहार और शाश्वत ज्ञान",
                    wearing: "माथे पर"
                },
                {
                    fNumbers: 10,
                    name: "दस मुक्ती",
                    benefits: "अमर जीवन और समृद्धि",
                    wearing: "आगे वा माथे पर"
                }
            ]
        },

        shankh: {
            name: "शंकू पूजा",
            nameEnglish: "Shankh Puja",
            significance: "Conch represents purity, knowledge, and the sound of creation",
            types: [
                "कमल शंकू - जाने वाला स्वर",
                "दालचीनी शंकू - मधुर स्वर",
                "सिंह राज शंकू - प्रासाद का स्वर"
            ],
            usage: "Waved during aarti, blown during rituals, kept as decorative item"
        }
    },

    philosophy: {
        purusharthas: [
            {
                id: "dharma",
                name: "धर्म",
                meaning: "Righteousness, duty, moral order",
                description: "The eternal law that upholds the universe, individual and social duties"
            },
            {
                id: "artha",
                name: "अर्थ",
                meaning: "Wealth, prosperity, material needs",
                description: "Legitimate means to acquire wealth and provide for family"
            },
            {
                id: "kama",
                name: "काम",
                meaning: "Desire, love, pleasure",
                description: "Legitimate enjoyment of life, relations with loved ones"
            },
            {
                id: "moksha",
                name: "मोक्ष",
                meaning: "Liberation, ultimate happiness",
                description: "Freedom from the cycle of rebirth, union with the Divine"
            }
        ],

        ashramas: [
            {
                id: "brahmacarya",
                name: "ब्राह्मचर्य अश्रम",
                duration: "Student life (25 years)",
                focus: "Education, discipline, self-study, celibacy",
                stages: ["गुरु घर", "शास्त्र पाठन", "प्रयोगात्मक शिक्षा"]
            },
            {
                id: "grihastha",
                name: "गृहास्थ अश्रम",
                duration: "Householder life (50-60 years)",
                focus: "Marriage, family, career, dharma in daily life",
                duties: ["दायित्व", "देव पूजा", "परिवारिक कर्म"]
            },
            {
                id: "vanaprastha",
                name: "वाणिक अश्रम",
                duration: "Retirement (10-15 years)",
                focus: "Relaxation, spiritual study, detachment",
                activities: ["शिक्षा", "दान", "तपस्या"]
            },
            {
                id: "samnyasa",
                name: "संन्यास अश्रम",
                duration: "Renunciation (until death)",
                focus: "Complete liberation, living as an enlightened being",
                practice: "Renounce worldly attachments, practice meditation"
            }
        ],

        yugas: [
            {
                id: "satya",
                name: "सत् यuga",
                duration: "1,728,000 years",
                characteristics: [
                    "Truth and righteousness are the norms",
                    "Spiritual awareness is highest",
                    "Body is ageless, health is perfect",
                    "Life expectancy reaches thousands of years"
                ]
            },
            {
                id: "treta",
                name: "त्रेता यuga",
                duration: "1,296,000 years",
                characteristics: [
                    "Dharma is maintained but in lesser measure",
                    "Three-pronged sacrifice (tripundra) introduced",
                    "Gods descend to earth for protection",
                    "Moral decay begins"
                ]
            },
            {
                id: "dvapara",
                name: "द्वापर यuga",
                duration: "864,000 years",
                characteristics: [
                    "Dharma diminishes further",
                    "Krishna's avatar brings spiritual knowledge",
                    "Sacrifice moves towards ritualism",
                    "Human effort required to maintain virtue"
                ]
            },
            {
                id: "kali",
                name: "कालिय यuga",
                duration: "432,000 years",
                characteristics: [
                    "Darkest age, moral confusion",
                    "Dharma established by grace alone",
                    "Short life spans, constant challenges",
                    "Krishna's teachings help navigate this age"
                ],
                current: "Yes, this is the Kali Yuga (started 3102 BCE)"
            }
        ],

        grantha: [
            {
                name: "पुराण-s",
                description: "18 great epics describing divine acts and cosmic history",
                collection: "Vedas, Samhitas, Brahmanas"
            },
            {
                name: "ऋग्वेद",
                description: "Primordial hymns of creation, the oldest of all texts"
            },
            {
                name: "कृष्ण नववमी",
                description: "Daily spiritual reading practice"
            },
            {
                name: "त्रित्य",
                description: "Three daily prayers: Morning, Noon, Evening"
            }
        ]
    },

    navagraha: {
        planets: [
            {
                name: "सूर्य",
                deity: "सूर्य देव",
                symbol: "धनु",
                element: "आग",
                favorable: "Monday",
                remedy: "Surya Namaskar, wheat, milk, turmeric"
            },
            {
                name: "चंद्र",
                deity: "चंद्र अमर",
                symbol: "चाँद",
                element: "पानी",
                favorable: "Monday",
                remedy: "Milk, coconut water, white flowers"
            },
            {
                name: "ऋग्वेद",
                deity: "मंगल",
                symbol: "चालू",
                element: "आग",
                remedy: "Lemon, mustard seeds"
            },
            {
                name: "राहु",
                deity: "राहु",
                symbol: "बिंदास",
                element: "एक",
                favorable: "Tuesday, Thursday",
                remedy: "Honey, milk, jaggery"
            },
            {
                name: "केतु",
                deity: "केतु",
                symbol: "त्रिपुट",
                element: "दो",
                favorable: "Wednesday, Saturday",
                remedy: "Grapes, watermelon"
            },
            {
                name: "बृहस्पति",
                deity: "बृहस्पति",
                symbol: "सास",
                element: "आग",
                favorable: "Thursday",
                remedy: "Red flowers, sweets made of wheat"
            },
            {
                name: "शुक्र",
                deity: "शुक्र",
                symbol: "टेला",
                element: "पानी",
                favorable: "Friday",
                remedy: "Coconut, milk, betel leaves"
            },
            {
                name: "शनि",
                deity: "शनि",
                symbol: "त्रिकोण",
                element: "एक",
                favorable: "Saturday",
                remedy: "Black sesame, mustard seeds, black gram"
            },
            {
                name: "ग्रह",
                deity: "ग्रह",
                symbol: "गोल",
                element: "दो",
                favorable: "All days",
                remedy: "General offerings"
            }
        ]
    },

    vratham: [
        {
            name: "एकादशी व्रत",
            nameEnglish: "Ekadashi Vrat",
            timing: "Every lunar month - 24 times per year",
            description: "Fasting and devotion on Ekadashi days",
            significance: "Devotees of Vishnu observe for liberation and blessings"
        },
        {
            name: "प्रदोष व्रत",
            nameEnglish: "Pradosh Vrat",
            timing: "13 days each month (Krishna Paksha Krishnashtami)",
            description: "Evening worship during Pradosh time",
            timings: "15 minutes before sunset to 15 minutes after sunset"
        },
        {
            name: "महाशिवरात्रि",
            nameEnglish: "Maha Shivaratri",
            timing: "February/March (Krishna Paksha Chaturdashi)",
            description: "All-night Shiva worship, fasting, and meditation",
            significance: "Special appearance of Lord Shiva's cosmic form"
        },
        {
            name: "नवरात्रि",
            nameEnglish: "Navratri",
            timing: "September/October (Ashwin Krishna Paksha)",
            description: "Nine nights of Devi worship",
            forms: ["डुंगरी", "शाक्ति", "काली"]
        },
        {
            name: "जन्माष्टमी",
            nameEnglish: "Janmashtami",
            timing: "August (Krishna Paksha Ashtami)",
            description: "Celebration of Lord Krishna's birth",
            observances: "Fasting till midnight, Dahi Handi, devotion songs"
        },
        {
            name: "राम नवमी",
            nameEnglish: "Ram Navami",
            timing: "March/August (Chaitra/Shravana month)",
            description: "Celebration of Lord Rama's birth",
            traditions: "Reading Ramayana, Rama Puja, community recitations"
        },
        {
            name: "दिवाली",
            nameEnglish: "Diwali",
            timing: "October/November (Kartik Krishna Paksha)",
            description: "Festival of Lights celebrating Lord Rama's return",
            observances: "Lakshmi Puja, firecrackers, new clothes, sweets"
        }
    ],

    dailyObservances: [
        {
            name: "ब्रह्म मुहूर्त",
            time: "1 घंटा पहले सूर्योदय",
            practice: "ध्यान, योग, मंत्र जाप",
            benefits: "मन का शांति, ऊर्जा वृद्धि"
        },
        {
            name: "सूर्य आर्घ्य",
            time: "सुबह 6-7 बजे",
            practice: "पानी का आर्घ्य करना, सूर्य को समर्पन",
            benefits: "आहार गुणवत्ता, रक्त चलन"
        },
        {
            name: "मधुर व्रत",
            time: "सभी दिन",
            practice: "मधुर फल, गूड़, दूध पियना",
            benefits: "आंतरिक शक्ति, पाचन सुधार"
        },
        {
            name: "गंगा स्नान",
            time: "सुबह 4-6 बजे",
            practice: "गंगाजल से शुद्धि",
            benefits: "शरीर और आत्मा का पवित्रकरण"
        }
    ],

    seasonalObservances: [
        {
            name: "शरद पक्ष",
            months: "September-October",
            festivals: ["दशहरा", "नवरात्रि", "दिवाली"],
            practices: ["देवता वंश पाठन", "प्रदोष व्रत रिट"]
        },
        {
            name: "वसंत पक्ष",
            months: "April-May",
            festivals: ["विंगा व्रत", "राम नवमी", "शिवरात्रि"],
            practices: ["कमल उगना", "रंगीन सजावटों का उपयोग"]
        },
        {
            name: "कृष्ण ज्योति",
            months: "October-November",
            festivals: ["कृष्ण जन्माष्टमी", "नवरात्रि"],
            practices: ["भक्ति संगीत", "बांस वृत्ति"]
        },
        {
            name: "ग्रीष्म ज्योति",
            months: "July-August",
            festivals: ["नंदी व्रत", "शिवरात्रि"],
            practices: ["ताप रोधन", "नीले रंगों का उपयोग"]
        }
    ]
};