/* The James NZ — cover pictures for seasons and faith topics, using the
   painted reading-nook artwork (October 2026). */
(function () {
  var MAP = {
    christmas: './story-pages/story-30-begin.webp',
    lent: './october/samaritan-1.webp',
    holyweek: './october/children-1.webp',
    easter: './story-pages/story-10-middle.webp',
    matariki: './story-pages/story-30-middle.webp',
    nzdays: './expansion/culture-a-0.webp',
    year: './october/creation-0.webp',
    mass: './expansion/church-book-2.webp',
    sacraments: './expansion/church-book-1.webp',
    commandments: './october/noah-0.webp',
    beatitudes: './october/loaves-1.webp',
    mercy: './october/samaritan-2.webp',
    spirit: './october/creation-1.webp',
    virtues: './october/sheep-3.webp',
    stations: './october/sheep-2.webp',
    symbols: './rosary-natural.webp',
    bible: './story-pages/story-05-end.webp',
    jesus: './october/sheep-0.webp',
    prayers: './october/children-0.webp'
  };
  window.JNZX = window.JNZX || {};
  window.JNZX.art = function (k) { var p = MAP[k]; if (!p) return null; try { return jAsset(p); } catch (e) { return null; } };
})();
