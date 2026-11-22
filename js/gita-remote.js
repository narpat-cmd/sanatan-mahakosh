// Sanatan Mahakosh - Gita fallback loader.
// Agar data/scriptures/gita/chNN.js file maujood na ho, to poori Gita (701 shlok) internet se
// github.com/gita/gita dataset (Unlicense) se jsDelivr ke zariye laata hai. Hindi: Swami Tejomayananda, English: Shri Purohit Swami.
// Ek baar load hone ke baad har adhyay localStorage mein cache hota hai.
(function () {
  'use strict';
  var BASE = 'https://cdn.jsdelivr.net/gh/gita/gita@main/data/';
  var CACHE = 'sanatan_gita_ch_v1_';
  var all = null;

  function loadAll() {
    if (all) return all;
    all = Promise.all([
      fetch(BASE + 'verse.json').then(function (r) { return r.json(); }),
      fetch(BASE + 'translation.json').then(function (r) { return r.json(); }),
      fetch(BASE + 'chapters.json').then(function (r) { return r.json(); })
    ]).then(function (res) { return { V: res[0], T: res[1], C: res[2] }; });
    all.catch(function () { all = null; });
    return all;
  }

  function cleanSa(s) { return String(s || '').replace(/ /g, ' ').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).join('\n'); }
  function cleanHi(s) { return String(s || '').replace(/ /g, ' ').trim().replace(/^।।[\d.\-]+।।\s*/, '').replace(/\s+/g, ' '); }

  var IMGQ = { 1: 'Krishna Arjuna chariot Kurukshetra', 6: 'Yoga meditation Himalaya', 8: 'Vishnu Ananta Shesha', 11: 'Vishvarupa Krishna', 13: 'Kurukshetra', 15: 'Ashvattha tree Bhagavad Gita' };

  function chunk(n) {
    var key = CACHE + n;
    try { var c = localStorage.getItem(key); if (c) return Promise.resolve(JSON.parse(c)); } catch (e) {}
    return loadAll().then(function (d) {
      var tm = {}, pu = {};
      d.T.forEach(function (x) {
        if (x.authorName === 'Swami Tejomayananda') tm[x.verse_id] = x.description;
        if (x.authorName === 'Shri Purohit Swami') pu[x.verse_id] = x.description;
      });
      var meta = d.C.filter(function (c) { return c.chapter_number === n; })[0] || {};
      var verses = d.V.filter(function (v) { return v.chapter_number === n; }).map(function (v) {
        return {
          n: v.verse_number, sa: cleanSa(v.text),
          tr: String(v.transliteration || '').split('\n').map(function (l) { return l.trim(); }).filter(Boolean).join('\n'),
          hi: cleanHi(tm[v.id]), en: String(pu[v.id] || '').trim(),
          source: 'github.com/gita/gita (Unlicense); Hindi: Swami Tejomayananda; English: Shri Purohit Swami',
          license: 'dataset Unlicense; translations credited to authors'
        };
      });
      var out = {
        book: 'bhagavad-gita', section: 'chapters', chapter: n, title: meta.name || ('Adhyay ' + n), illustration: '',
        illustrationCaption: meta.name_meaning || '', imageQuery: IMGQ[n] || 'Krishna Arjuna Bhagavad Gita',
        summaryHi: meta.chapter_summary_hindi || '', summaryEn: meta.chapter_summary || '', verses: verses
      };
      try { localStorage.setItem(key, JSON.stringify(out)); } catch (e) {}
      return out;
    });
  }

  window.GitaRemote = { chunk: chunk };
})();
