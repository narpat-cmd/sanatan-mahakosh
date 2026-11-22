// Sanatan Mahakosh - Roz ka shlok (Shloka of the Day) + vaar + tithi (index.html)
// Har din Bhagavad Gita ka naya shlok (701 shlok, saal-bhar chakra mein), saath mein aaj ka vaar, devta aur tithi.
// NOTE: Tithi yahan chandra-kala ke ganit se LAGBHAG nikalti hai (+-1 tithi). Vrat/tyohar ke liye panchang se milaan karein.
(function () {
  'use strict';

  var COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78]; // kul 701
  var VAAR = [
    ['रविवार', 'सूर्य देव'], ['सोमवार', 'भगवान शिव'], ['मंगलवार', 'हनुमान जी'],
    ['बुधवार', 'श्री गणेश'], ['गुरुवार', 'भगवान विष्णु'], ['शुक्रवार', 'माँ लक्ष्मी / देवी'], ['शनिवार', 'शनि देव / हनुमान जी']
  ];
  var TITHI = ['प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
    'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी'];

  function tithiOf(date) {
    var SYN = 29.530588853;
    var ref = Date.UTC(2000, 0, 6, 18, 14); // ek gyaat amavasya
    var age = (((date.getTime() - ref) / 86400000) % SYN + SYN) % SYN;
    var t = Math.floor(age / (SYN / 30)); // 0..29
    var paksha, name, n;
    if (t < 15) { paksha = 'शुक्ल पक्ष'; n = t + 1; name = n === 15 ? 'पूर्णिमा' : TITHI[n - 1]; }
    else { paksha = 'कृष्ण पक्ष'; n = t - 14; name = n === 15 ? 'अमावस्या' : TITHI[n - 1]; }
    return { paksha: paksha, name: name, n: n };
  }

  function pick(date) {
    var day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000);
    var idx = ((day % 701) + 701) % 701;
    for (var c = 0; c < COUNTS.length; c++) {
      if (idx < COUNTS[c]) return { ch: c + 1, i: idx };
      idx -= COUNTS[c];
    }
    return { ch: 1, i: 0 };
  }

  function loadChunk(ch) {
    var key = 'bhagavad-gita/ch' + (ch < 10 ? '0' : '') + ch;
    return new Promise(function (resolve, reject) {
      var have = window.SCRIPTURE_CHUNKS && window.SCRIPTURE_CHUNKS[key];
      if (have) return resolve(have);
      var s = document.createElement('script');
      s.src = './data/scriptures/gita/ch' + (ch < 10 ? '0' : '') + ch + '.js';
      s.onload = function () {
        var d = window.SCRIPTURE_CHUNKS && window.SCRIPTURE_CHUNKS[key];
        d ? resolve(d) : reject(new Error('chunk missing'));
      };
      s.onerror = function () {
        if (window.GitaRemote) window.GitaRemote.chunk(ch).then(resolve, reject);
        else reject(new Error('load failed'));
      };
      document.head.appendChild(s);
    });
  }

  function set(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; return el; }

  function run() {
    var box = document.getElementById('shlokaOfDay');
    if (!box) return;
    var now = new Date();
    var vaar = VAAR[now.getDay()];
    var th = tithiOf(now);
    var dateStr = now.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    set('shlokaDate', dateStr);

    // vaar + tithi patti
    var info = document.getElementById('dailyPanchangLine');
    if (!info) {
      info = document.createElement('p');
      info.id = 'dailyPanchangLine';
      info.style.cssText = 'text-align:center;font-size:.85rem;margin:-.25rem 0 .9rem;color:#E85D04';
      var sk = document.getElementById('shlokaSanskrit');
      if (sk && sk.parentNode) sk.parentNode.insertBefore(info, sk);
    }
    var special = '';
    if (th.n === 11) special = ' • एकादशी (विष्णु पूजन)';
    else if (th.name === 'पूर्णिमा') special = ' • पूर्णिमा';
    else if (th.name === 'अमावस्या') special = ' • अमावस्या';
    else if (th.n === 4 && th.paksha === 'कृष्ण पक्ष') special = ' • संकष्टी चतुर्थी (गणेश)';
    else if (th.n === 13) special = ' • प्रदोष (शिव पूजन)';
    info.textContent = vaar[0] + ' — ' + vaar[1] + ' का दिन • ' + th.paksha + ' ' + th.name + ' (लगभग)' + special;

    var p = pick(now);
    loadChunk(p.ch).then(function (chunk) {
      var v = chunk.verses[p.i];
      if (!v) return;
      set('shlokaSanskrit', v.sa);
      var sk = document.getElementById('shlokaSanskrit');
      if (sk) sk.style.whiteSpace = 'pre-line';
      var tr = set('shlokaTransliteration', v.tr);
      if (tr) tr.style.whiteSpace = 'pre-line';
      set('shlokaMeaning', v.hi + '  — भगवद्गीता ' + chunk.chapter + '.' + v.n);
      box.dataset.copy = v.sa.replace(/\n/g, ' ') + '\n\n' + v.hi + '\n(भगवद्गीता ' + chunk.chapter + '.' + v.n + ')';
    }).catch(function () {
      set('shlokaSanskrit', 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।');
      set('shlokaMeaning', 'आज का श्लोक लोड नहीं हो सका (data/scriptures/gita/ फ़ाइलें देखें)।');
    });
  }

  document.addEventListener('click', function (e) {
    var box = document.getElementById('shlokaOfDay');
    if (e.target.closest('#copyShloka') && box && box.dataset.copy) {
      if (navigator.clipboard) navigator.clipboard.writeText(box.dataset.copy).catch(function () {});
    } else if (e.target.closest('#shareShloka') && box && box.dataset.copy) {
      window.open('https://wa.me/?text=' + encodeURIComponent(box.dataset.copy), '_blank', 'noopener');
    }
    // index par mandir category tabs -> temples.html?cat=
    var tab = e.target.closest('.filter-tab');
    if (tab) {
      var map = { 'char-dham': 'badi-char-dham' };
      var f = tab.dataset.filter || 'all';
      window.location.href = 'temples.html?cat=' + encodeURIComponent(map[f] || f);
    }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 0); });
  else setTimeout(run, 0);
})();
