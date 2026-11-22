// Sanatan Mahakosh - Poore granth (Valmiki Ramayan, Ramcharitmanas, Mahabharat, Char Ved)
// Source: "Hindu Sacred Texts Dataset" github.com/bhavykhatri/DharmicData (ODbL license - attribution zaroori).
//   Ramcharitmanas: IIT Kanpur | Valmiki Ramayan: Sanskrit + English | Mahabharat: Critical Edition (Sanskrit)
//   Rigveda / Yajurveda / Atharvaveda: Vedic Heritage Portal | Samaveda: R.T.H. Griffith (English)
// Pehli baar kholne par internet se aata hai aur browser mein cache hota hai.
// Is file ko scriptures.js ke BAAD load karein (manifest yahin register hota hai).
(function () {
  'use strict';
  var RAW = 'https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/';
  var SRC = 'github.com/bhavykhatri/DharmicData (ODbL)';
  var fileCache = {};

  function getJSON(path) {
    if (fileCache[path]) return fileCache[path];
    var url = RAW + path.split('/').map(encodeURIComponent).join('/');
    fileCache[path] = fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + path);
      return r.json();
    });
    fileCache[path].catch(function () { delete fileCache[path]; });
    return fileCache[path];
  }

  // ---------- manifest data ----------
  var KANDA = [
    { f: '1_balakanda.json', hi: 'बालकाण्ड', en: 'Bala Kanda', n: 77, q: 'Ramayana Rama Sita wedding painting' },
    { f: '2_ayodhyakanda.json', hi: 'अयोध्याकाण्ड', en: 'Ayodhya Kanda', n: 119, q: 'Ramayana Rama exile forest painting' },
    { f: '3_aranyakanda.json', hi: 'अरण्यकाण्ड', en: 'Aranya Kanda', n: 75, q: 'Ramayana Sita Ravana Jatayu painting' },
    { f: '4_kishkindhakanda.json', hi: 'किष्किन्धाकाण्ड', en: 'Kishkindha Kanda', n: 67, q: 'Hanuman Sugriva Rama painting' },
    { f: '5_sundarakanda.json', hi: 'सुन्दरकाण्ड', en: 'Sundara Kanda', n: 68, q: 'Hanuman Sita Ashoka Vatika painting' },
    { f: '6_yudhhakanda.json', hi: 'युद्धकाण्ड', en: 'Yuddha Kanda', n: 131, q: 'Rama Ravana battle painting' },
    { f: '7_uttarakanda.json', hi: 'उत्तरकाण्ड', en: 'Uttara Kanda', n: 111, q: 'Ramayana Lava Kusha painting' }
  ];
  var RCM = [
    { f: '1_बाल_काण्ड_data.json', hi: 'बालकाण्ड' }, { f: '2_अयोध्या_काण्ड_data.json', hi: 'अयोध्याकाण्ड' },
    { f: '3_अरण्य_काण्ड_data.json', hi: 'अरण्यकाण्ड' }, { f: '4_किष्किन्धा_काण्ड_data.json', hi: 'किष्किन्धाकाण्ड' },
    { f: '5_सुंदर_काण्ड_data.json', hi: 'सुन्दरकाण्ड' }, { f: '6_लंका_काण्ड_data.json', hi: 'लंकाकाण्ड' },
    { f: '7_उत्तर_काण्ड_data.json', hi: 'उत्तरकाण्ड' }
  ];
  var PARVA = [
    ['आदिपर्व', 'Adi Parva', 225], ['सभापर्व', 'Sabha Parva', 72], ['वनपर्व', 'Vana Parva', 299], ['विराटपर्व', 'Virata Parva', 67],
    ['उद्योगपर्व', 'Udyoga Parva', 197], ['भीष्मपर्व', 'Bhishma Parva', 117], ['द्रोणपर्व', 'Drona Parva', 173], ['कर्णपर्व', 'Karna Parva', 69],
    ['शल्यपर्व', 'Shalya Parva', 64], ['सौप्तिकपर्व', 'Sauptika Parva', 18], ['स्त्रीपर्व', 'Stri Parva', 27], ['शान्तिपर्व', 'Shanti Parva', 353],
    ['अनुशासनपर्व', 'Anushasana Parva', 154], ['अश्वमेधिकपर्व', 'Ashvamedhika Parva', 96], ['आश्रमवासिकपर्व', 'Ashramavasika Parva', 47],
    ['मौसलपर्व', 'Mausala Parva', 9], ['महाप्रस्थानिकपर्व', 'Mahaprasthanika Parva', 3], ['स्वर्गारोहणपर्व', 'Svargarohana Parva', 5]
  ];
  var RV_N = 10, AV_N = 20, YV_N = 40;
  var SV = [
    ['FIRST PART', 'Book I'], ['FIRST PART', 'Book II'], ['FIRST PART', 'Book III'], ['FIRST PART', 'Book IV'], ['FIRST PART', 'Book V'], ['FIRST PART', 'Book VI'],
    ['PART SECOND', 'Book I'], ['PART SECOND', 'Book II'], ['PART SECOND', 'Book III'], ['PART SECOND', 'Book IV'], ['PART SECOND', 'Book V'],
    ['PART SECOND', 'Book VI'], ['PART SECOND', 'Book VII'], ['PART SECOND', 'Book VIII'], ['PART SECOND', 'Book IX']
  ];

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function T(hi, en) { return { sa: hi, hi: hi, en: en }; }

  function registerBooks() {
    var data = window.SCRIPTURES_DATA = window.SCRIPTURES_DATA || [];
    function upsert(book) {
      var i = -1;
      data.forEach(function (b, k) { if (b.id === book.id) i = k; });
      if (i >= 0) data[i] = book; else data.push(book);
    }
    function base(id, title, sub, cat, color, emblem, chapters, verses, src) {
      return {
        id: id, title: title, subtitle: sub, category: cat, remote: true,
        cover: { color: color, emblem: emblem, subtitle: '' },
        languages: ['sa', 'hi', 'en'],
        structure: { type: 'chapters', count: chapters.length, chapters: chapters },
        totals: { chapters: chapters.length, verses: verses },
        source: src || SRC, license: 'ODbL (attribution)', loaded: false, data: null
      };
    }

    // Valmiki Ramayan: har kanda ke sarg
    var ch = [];
    KANDA.forEach(function (k, ki) {
      for (var s = 1; s <= k.n; s++) ch.push({ key: 'vr-' + (ki + 1) + '-' + s, title: T(k.hi + ' - सर्ग ' + s, k.en + ' - Sarga ' + s), file: '' });
    });
    upsert(base('ramayan', T('वाल्मीकि रामायण', 'Valmiki Ramayana'), T('संस्कृत मूल + अंग्रेज़ी अनुवाद', 'Sanskrit with English translation'),
      'इतिहास | रामायण', '#8B4513', 'ॐ', ch, 23592, 'Valmiki Ramayana (Sanskrit + English) - ' + SRC));
    var vr = data.filter(function (b) { return b.id === 'ramayan'; })[0];
    if (vr) vr.imageQuery = 'Ramayana painting Rama Sita Lakshmana';

    // Ramcharitmanas
    ch = RCM.map(function (k, i) { return { key: 'rcm-' + (i + 1), title: T(k.hi, k.hi), file: '' }; });
    upsert(base('ramcharitmanas', T('रामचरितमानस', 'Ramcharitmanas'), T('गोस्वामी तुलसीदास', 'Goswami Tulsidas'),
      'इतिहास | रामायण | भक्ति', '#B5451B', 'श्री', ch, 1977, 'Ramcharitmanas - IIT Kanpur via ' + SRC));
    var rc = data.filter(function (b) { return b.id === 'ramcharitmanas'; })[0];
    if (rc) rc.imageQuery = 'Tulsidas Ramcharitmanas';

    // Mahabharat
    ch = [];
    PARVA.forEach(function (p, pi) {
      for (var c = 1; c <= p[2]; c++) ch.push({ key: 'mb-' + (pi + 1) + '-' + c, title: T(p[0] + ' - अध्याय ' + c, p[1] + ' - Chapter ' + c), file: '' });
    });
    upsert(base('mahabharata', T('महाभारत', 'Mahabharata'), T('18 पर्व (Critical Edition, संस्कृत)', '18 Parvas (Critical Edition, Sanskrit)'),
      'इतिहास | महाभारत', '#3E2A47', 'ॐ', ch, 72000, 'Mahabharata Critical Edition - ' + SRC));
    var mb = data.filter(function (b) { return b.id === 'mahabharata'; })[0];
    if (mb) mb.imageQuery = 'Mahabharata painting Krishna Arjuna';

    // Char Ved
    ch = [];
    for (var m = 1; m <= RV_N; m++) ch.push({ key: 'rv-' + m, title: T('ऋग्वेद - मण्डल ' + m, 'Rigveda - Mandala ' + m), file: '' });
    for (var y = 1; y <= YV_N; y++) ch.push({ key: 'yv-' + y, title: T('यजुर्वेद (माध्यन्दिन) - अध्याय ' + y, 'Yajurveda (Madhyandina) - Adhyaya ' + y), file: '' });
    for (var a = 1; a <= AV_N; a++) ch.push({ key: 'av-' + a, title: T('अथर्ववेद - काण्ड ' + a, 'Atharvaveda - Kanda ' + a), file: '' });
    SV.forEach(function (s, i) { ch.push({ key: 'sv-' + (i + 1), title: T('सामवेद - ' + (i < 6 ? 'पूर्वार्चिक/उत्तरार्चिक अंश ' : 'उत्तरार्चिक अंश ') + (i + 1), 'Samaveda - ' + s[0] + ' ' + s[1]), file: '' }); });
    upsert(base('vedas', T('चार वेद', 'The Four Vedas'), T('ऋग्वेद, यजुर्वेद, सामवेद, अथर्ववेद', 'Rigveda, Yajurveda, Samaveda, Atharvaveda'),
      'वेद | शास्त्र', '#1B4F72', '🜂', ch, 30000, 'Vedic Heritage Portal / Griffith (Samaveda) - ' + SRC));
    var vd = data.filter(function (b) { return b.id === 'vedas'; })[0];
    if (vd) vd.imageQuery = 'Rigveda manuscript';
  }

  // ---------- chunk builders ----------
  var CLOSER = /[॥।|]{1,2}\s*[०-९0-9]+\s*[॥।|]{1,2}\s*$/;

  // Ved text ko mantra-by-mantra todo (har mantra ke ant mein ॥N॥ hota hai)
  function splitMantras(text, label) {
    var lines = String(text || '').split('\n').map(function (l) { return l.replace(/ /g, ' ').trim(); }).filter(Boolean);
    var out = [], cur = [], first = true;
    lines.forEach(function (l) {
      cur.push(l);
      if (CLOSER.test(l) || cur.length >= 8) { out.push(cur.join('\n')); cur = []; }
    });
    if (cur.length) out.push(cur.join('\n'));
    if (label && out.length) out[0] = label + '\n' + out[0];
    return out;
  }

  function verse(n, sa, en, hi, tr) {
    return { n: n, sa: sa || '', tr: tr || '', hi: hi || '', en: en || '', source: SRC, license: 'ODbL' };
  }

  function mk(key, title, q, verses, caption) {
    var bookId = null;
    return { book: bookId, section: 'chapters', chapter: key, title: title, illustration: '', illustrationCaption: caption || '', imageQuery: q, verses: verses };
  }

  function buildVR(key) {
    var p = key.split('-'); var ki = +p[1] - 1, sarg = +p[2], k = KANDA[ki];
    return getJSON('ValmikiRamayana/' + k.f).then(function (d) {
      var vs = d.filter(function (x) { return x.sarg === sarg; }).map(function (x) {
        var en = x.translation || '';
        if (x.word_meanings) en += '\n\nWord meanings: ' + x.word_meanings;
        return verse(x.shloka, x.text, en, '', '');
      });
      return mk(key, k.hi + ' - सर्ग ' + sarg, k.q, vs, 'वाल्मीकि रामायण - ' + k.hi);
    });
  }

  function buildRCM(key) {
    var i = +key.split('-')[1] - 1, k = RCM[i];
    return getJSON('Ramcharitmanas/' + k.f).then(function (d) {
      var vs = d.map(function (x, j) {
        var lines = String(x.content || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).join('\n');
        return verse(j + 1, '[' + (x.type || '') + ']\n' + lines, '', '', '');
      });
      return mk(key, k.hi, 'Tulsidas Ramcharitmanas Rama', vs, 'रामचरितमानस - ' + k.hi);
    });
  }

  function buildMB(key) {
    var p = key.split('-'), bk = +p[1], ch = +p[2], pv = PARVA[bk - 1];
    return getJSON('Mahabharata/mahabharata_book_' + bk + '.json').then(function (d) {
      var vs = d.filter(function (x) { return x.chapter === ch; }).map(function (x) { return verse(x.shloka, x.text, '', '', ''); });
      return mk(key, pv[0] + ' - अध्याय ' + ch, 'Mahabharata ' + pv[1], vs, 'महाभारत - ' + pv[0]);
    });
  }

  function buildVeda(key) {
    var p = key.split('-'), kind = p[0], n = +p[1];
    if (kind === 'rv') {
      return getJSON('Rigveda/rigveda_mandala_' + n + '.json').then(function (d) {
        var vs = [];
        d.forEach(function (s) {
          splitMantras(s.text, '— सूक्त ' + s.sukta + ' —').forEach(function (m) { vs.push(verse(vs.length + 1, m)); });
        });
        return mk(key, 'ऋग्वेद - मण्डल ' + n, 'Rigveda manuscript', vs, 'ऋग्वेद');
      });
    }
    if (kind === 'av') {
      return getJSON('AtharvaVeda/atharvaveda_kaanda_' + n + '.json').then(function (d) {
        var vs = [];
        d.forEach(function (s) {
          splitMantras(s.text, '— सूक्त ' + s.sukta + ' —').forEach(function (m) { vs.push(verse(vs.length + 1, m)); });
        });
        return mk(key, 'अथर्ववेद - काण्ड ' + n, 'Atharvaveda manuscript', vs, 'अथर्ववेद');
      });
    }
    if (kind === 'yv') {
      return getJSON('Yajurveda/vajasneyi_madhyadina_samhita.json').then(function (d) {
        var item = d.filter(function (x) { return x.adhyaya === n; })[0];
        var vs = item ? splitMantras(item.text).map(function (m, i) { return verse(i + 1, m); }) : [];
        return mk(key, 'यजुर्वेद (माध्यन्दिन) - अध्याय ' + n, 'Yajurveda manuscript', vs, 'शुक्ल यजुर्वेद');
      });
    }
    if (kind === 'sv') {
      var def = SV[n - 1];
      return getJSON('Samaveda/Samaveda.json').then(function (d) {
        var vs = d.verses.filter(function (x) { return x.part === def[0] && x.book === def[1]; }).map(function (x, i) {
          return verse(i + 1, 'देवता: ' + (x.deity || '') + '  |  ' + (x.chapter || '') + ', ' + (x.section || '') + ', Hymn ' + x.hymn + '.' + x.verse, x.text);
        });
        return mk(key, 'सामवेद - ' + def[0] + ' ' + def[1], 'Samaveda manuscript', vs, 'सामवेद (R.T.H. Griffith, English)');
      });
    }
    return Promise.reject(new Error('unknown veda key ' + key));
  }

  function chunk(bookId, key) {
    var p;
    if (/^vr-/.test(key)) p = buildVR(key);
    else if (/^rcm-/.test(key)) p = buildRCM(key);
    else if (/^mb-/.test(key)) p = buildMB(key);
    else p = buildVeda(key);
    return p.then(function (c) { c.book = bookId; return c; });
  }

  window.TextsRemote = { chunk: chunk, remoteBooks: ['ramayan', 'ramcharitmanas', 'mahabharata', 'vedas'] };
  registerBooks();
})();
