// Sanatan Dharma Mahakosh - Scriptures Manifest
// Lazy-loaded chunked data structure
// Attaches to window.SCRIPTURES_DATA (manifest only)
// Each chapter file registers itself: window.SCRIPTURE_CHUNKS["book/key"]

window.SCRIPTURES_DATA = [
  {
    id: 'bhagavad-gita',
    title: { sa: 'श्रीमद् भगवद्गीता', hi: 'भगवद्गीता', en: 'Bhagavad Gita' },
    subtitle: { sa: 'गीता संतान', hi: 'भगवद्गीता', en: 'The Song Divine' },
    category: 'गीता | इतिहास | धर्म',
    cover: { color: '#6B0F1A', emblem: 'ॐ', subtitle: 'कर्म क्षेत्र' },
    languages: ['sa', 'hi', 'en'],
    structure: {
      type: 'chapters',
      count: 6,
      chapters: [
        { key: 'ch01', title: { sa: 'प्रारम्भ योग', hi: 'प्रारम्भ योग', en: 'Arjuna Vishada Yoga' }, file: 'data/scriptures/gita/ch01.js' },
        { key: 'ch02', title: { sa: 'संख्या योग', hi: 'संख्या योग', en: 'Sankhya Yoga' }, file: 'data/scriptures/gita/ch02.js' },
        { key: 'ch03', title: { sa: 'कर्म योग', hi: 'कर्म योग', en: 'Karma Yoga' }, file: 'data/scriptures/gita/ch03.js' },
        { key: 'ch10', title: { sa: 'विभूति योग', hi: 'विभूति योग', en: 'Vibhuti Yoga' }, file: 'data/scriptures/gita/ch10.js' },
        { key: 'ch11', title: { sa: 'विष्णु रूप दर्शन योग', hi: 'विष्णु रूप दर्शन योग', en: 'Vishvarupa Darshana Yoga' }, file: 'data/scriptures/gita/ch11.js' },
        { key: 'ch18', title: { sa: 'मोक्ष सन्न्यास योग', hi: 'मोक्ष सन्न्यास योग', en: 'Moksha Sannyasa Yoga' }, file: 'data/scriptures/gita/ch18.js' }
      ]
    },
    totals: { chapters: 6, verses: 15 },
    source: 'Wikisource Sanskrit (public domain)',
    license: 'public-domain',
    loaded: false,
    data: null
  },
  {
    id: 'ramayan',
    title: { sa: 'वाल्मीकि रामायणम्', hi: 'वाल्मीकि रामायण', en: 'Valmiki Ramayana' },
    subtitle: { sa: 'धर्मकथा', hi: 'धर्मकथा', en: 'The Epic Journey of Dharma' },
    category: 'इतिहास | रामायण',
    cover: { color: '#8B4513', emblem: '🕉', subtitle: 'रामराज्य' },
    languages: ['sa', 'hi', 'en'],
    structure: {
      type: 'files',
      count: 7,
      files: [
        { key: 'chapter-01', title: { sa: 'प्रथम अध्याय', hi: 'पहला अध्याय', en: 'First Chapter' }, file: 'data/scriptures/valmiki-ramayan/chapter-01.js' },
        { key: 'chapter-02', title: { sa: 'द्वितीय अध्याय', hi: 'दूसरा अध्याय', en: 'Second Chapter' }, file: 'data/scriptures/valmiki-ramayan/chapter-02.js' },
        { key: 'chapter-03', title: { sa: 'तृतीय अध्याय', hi: 'तीसरा अध्याय', en: 'Third Chapter' }, file: 'data/scriptures/valmiki-ramayan/chapter-03.js' },
        { key: 'chapter-04', title: { sa: 'चतुर्थ अध्याय', hi: 'चौथा अध्याय', en: 'Fourth Chapter' }, file: 'data/scriptures/valmiki-ramayan/chapter-04.js' },
        { key: 'chapter-05', title: { sa: 'पंचम अध्याय', hi: 'पाँचवा अध्याय', en: 'Fifth Chapter' }, file: 'data/scriptures/valmiki-ramayan/chapter-05.js' },
        { key: 'chapter-06', title: { sa: 'षष्ठ अध्याय', hi: 'छैंचा अध्याय', en: 'Sixth Chapter' }, file: 'data/scriptures/valmiki-ramayan/chapter-06.js' },
        { key: 'chapter-07', title: { sa: 'सप्तम अध्याय', hi: 'सातवा अध्याय', en: 'Seventh Chapter' }, file: 'data/scriptures/valmiki-ramayan/chapter-07.js' }
      ]
    },
    totals: { chapters: 7, verses: 7 },
    source: 'Wikisource (public domain)',
    license: 'public-domain',
    loaded: false,
    data: null
  },
  {
    id: 'vedas',
    title: { sa: 'चतुः वेदाः', hi: 'चार वेद', en: 'The Four Vedas' },
    subtitle: { sa: 'शास्त्रधर्म', hi: 'शास्त्रधर्म', en: 'The Eternal Knowledge' },
    category: 'वेद | शास्त्र',
    cover: { color: '#1B4F72', emblem: '🜂', subtitle: 'सृष्टि' },
    languages: ['sa', 'hi', 'en'],
    structure: {
      type: 'files',
      count: 8,
      files: [
        { key: 'entry-01', title: { sa: 'ऋग्वेद', hi: 'ऋग्वेद', en: 'Rigveda' }, file: 'data/scriptures/vedas/entry-01.js' },
        { key: 'entry-02', title: { sa: 'यजुर्वेद', hi: 'यजुर्वेद', en: 'Yajurveda' }, file: 'data/scriptures/vedas/entry-02.js' },
        { key: 'entry-03', title: { sa: 'सामवेद', hi: 'सामवेद', en: 'Samaveda' }, file: 'data/scriptures/vedas/entry-03.js' },
        { key: 'entry-04', title: { sa: 'अथर्ववेद', hi: 'अथर्ववेद', en: 'Atharvaveda' }, file: 'data/scriptures/vedas/entry-04.js' },
        { key: 'entry-05', title: { sa: 'ईशावास्य उपनिषद्', hi: 'ईशावास्य उपनिषद', en: 'Isha Upanishad' }, file: 'data/scriptures/vedas/entry-05.js' },
        { key: 'entry-06', title: { sa: 'कथा उपनिषद्', hi: 'कथा उपनिषद', en: 'Katha Upanishad' }, file: 'data/scriptures/vedas/entry-06.js' },
        { key: 'entry-07', title: { sa: 'मुंडक उपनिषद्', hi: 'मुंडक उपनिषद', en: 'Mundaka Upanishad' }, file: 'data/scriptures/vedas/entry-07.js' },
        { key: 'entry-08', title: { sa: 'माण्डूकय उपनिषद्', hi: 'माण्डूकय उपनिषद', en: 'Mandukya Upanishad' }, file: 'data/scriptures/vedas/entry-08.js' }
      ]
    },
    totals: { files: 8, verses: 8 },
    source: 'Wikisource (public domain)',
    license: 'public-domain',
    loaded: false,
    data: null
  },
  {
    id: 'puranas',
    title: { sa: 'पुराणानि', hi: 'महापुराण', en: 'The Mahapuranas' },
    subtitle: { sa: 'ब्रह्मराक्षस', hi: 'ब्रह्मराक्षस', en: 'Ancient Chronicles of Cosmic History' },
    category: 'पुराण | इतिहास | धर्म',
    cover: { color: '#4B2E83', emblem: '🜄', subtitle: 'कृष्ण' },
    languages: ['sa', 'hi', 'en'],
    structure: {
      type: 'files',
      count: 5,
      files: [
        { key: 'entry-01', title: { sa: 'शिव पुराण', hi: 'शिव पुराण', en: 'Shiva Purana' }, file: 'data/scriptures/puranas/entry-01.js' },
        { key: 'entry-02', title: { sa: 'विष्णु पुराण', hi: 'विष्णु पुराण', en: 'Vishnu Purana' }, file: 'data/scriptures/puranas/entry-02.js' },
        { key: 'entry-03', title: { sa: 'श्रीमद् भगवद्गीता पुराण', hi: 'श्रीमद्भगवद्गीता पुराण', en: 'Shrimad Bhagavata Purana' }, file: 'data/scriptures/puranas/entry-03.js' },
        { key: 'entry-04', title: { sa: 'गरुड़ पुराण', hi: 'गरुड़ पुराण', en: 'Garuda Purana' }, file: 'data/scriptures/puranas/entry-04.js' },
        { key: 'entry-05', title: { sa: 'मार्कंडेय पुराण', hi: 'मार्कंडेय पुराण', en: 'Markandeya Purana' }, file: 'data/scriptures/puranas/entry-05.js' }
      ]
    },
    totals: { files: 5, verses: 5 },
    source: 'Wikisource (public domain)',
    license: 'public-domain',
    loaded: false,
    data: null
  },
  {
    id: 'aarti-chalisa',
    title: { sa: 'अर्चना तथा चालिसा', hi: 'अर्चना और चालिसा', en: 'Aarti, Chalisa, Stotras & Mantras' },
    subtitle: { sa: 'पूजा वाहन', hi: 'पूजा वाहन', en: 'Prayers for Every Occasion' },
    category: 'पूजा | आमंत्रण | उपासना',
    cover: { color: '#8B0000', emblem: '🜏', subtitle: 'रूप' },
    languages: ['sa', 'hi', 'en'],
    structure: {
      type: 'files',
      count: 10,
      files: [
        { key: 'entry-01', title: { sa: 'हनुमान चालिसा', hi: 'हनुमान चालिसा', en: 'Hanuman Chalisa' }, file: 'data/scriptures/aarti/entry-01.js' },
        { key: 'entry-02', title: { sa: 'गणेश आरती', hi: 'गणेश आरती', en: 'Ganesh Aarti' }, file: 'data/scriptures/aarti/entry-02.js' },
        { key: 'entry-03', title: { sa: 'शिव आरती', hi: 'शिव आरती', en: 'Shiva Aarti' }, file: 'data/scriptures/aarti/entry-03.js' },
        { key: 'entry-04', title: { sa: 'लक्ष्मी आरती', hi: 'लक्ष्मी आरती', en: 'Lakshmi Aarti' }, file: 'data/scriptures/aarti/entry-04.js' },
        { key: 'entry-05', title: { sa: 'दुर्गा चालिसा', hi: 'दुर्गा चालिसा', en: 'Durga Chalisa' }, file: 'data/scriptures/aarti/entry-05.js' },
        { key: 'entry-06', title: { sa: 'शिव ताडव स्तोत्र', hi: 'शिव ताडव स्तोत्र', en: 'Shiva Tandav Stotram' }, file: 'data/scriptures/aarti/entry-06.js' },
        { key: 'entry-07', title: { sa: 'रुद्रष्टकम्', hi: 'रुद्रष्टकम', en: 'Rudrashtakam' }, file: 'data/scriptures/aarti/entry-07.js' },
        { key: 'entry-08', title: { sa: 'मधुरष्टकम्', hi: 'मधुरष्टकम', en: 'Madhurashtakam' }, file: 'data/scriptures/aarti/entry-08.js' },
        { key: 'entry-09', title: { sa: 'गायत्री मंत्र', hi: 'गायत्री मंत्र', en: 'Gayatri Mantra' }, file: 'data/scriptures/aarti/entry-09.js' },
        { key: 'entry-10', title: { sa: 'महामृत्युंजय मंत्र', hi: 'महामृत्युंजय मंत्र', en: 'Mahamrityunjaya Mantra' }, file: 'data/scriptures/aarti/entry-10.js' }
      ]
    },
    totals: { files: 10, verses: 10 },
    source: 'Traditional texts (public domain)',
    license: 'public-domain',
    loaded: false,
    data: null
  }
];

// SCRIPTURES_MANIFEST = SCRIPTURES_DATA (alias for clarity)
window.SCRIPTURES_MANIFEST = window.SCRIPTURES_DATA;

console.log('SCRIPTURES_MANIFEST loaded:', SCRIPTURES_DATA.length, 'books');