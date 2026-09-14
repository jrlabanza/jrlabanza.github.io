(function () {
  'use strict';

  var D = window.PORTFOLIO_DATA || { profile: {}, repos: [] };
  var C = window.PORTFOLIO_CONTENT || {};
  var repos = D.repos || [];
  var profile = D.profile || {};
  var byName = {};
  repos.forEach(function (r) { byName[r.name] = r; });

  // Projects from a second account (js/work.js), minus anything content.js excludes.
  var W = window.PORTFOLIO_WORK || { owner: null, repos: [] };
  var workExclude = (C.work && C.work.exclude) || [];
  var workRepos = (W.repos || []).filter(function (r) { return workExclude.indexOf(r.name) === -1; });
  var workLabel = (W.owner && W.owner.label) || 'work';

  // GitHub linguist colours for the language dots.
  var LANG_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', HTML: '#e34c26',
    CSS: '#663399', 'C#': '#178600', 'C++': '#f34b7d', Cuda: '#3A4E3A', Shell: '#89e051',
    Batchfile: '#C1F12E', PowerShell: '#012456', Dockerfile: '#384d54', CMake: '#DA3434',
    ASP: '#6a40fd', Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', PHP: '#4F5D95',
    Ruby: '#701516', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Vue: '#41b883',
  };

  // ---------------------------------------------------------------- helpers
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'style') el.style.cssText = v;
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    for (var i = 2; i < arguments.length; i += 1) {
      var child = arguments[i];
      if (child === null || child === undefined || child === false) continue;
      if (Array.isArray(child)) child.forEach(function (c) { if (c) el.appendChild(c); });
      else el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return el;
  }

  function monthYear(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en', { month: 'short', year: 'numeric' });
  }

  function year(iso) { return new Date(iso).getFullYear(); }

  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  function describe(r) {
    if (r.description) return r.description.trim();
    if (C.descriptions && C.descriptions[r.name]) return C.descriptions[r.name];
    if (!r.size) return 'Empty repository.';
    return 'No description yet.';
  }

  function dot(lang) {
    return h('span', { class: 'dot', style: 'background:' + (LANG_COLORS[lang] || '#86868b'), 'aria-hidden': 'true' });
  }

  function externalLink(attrs) {
    attrs.target = '_blank';
    attrs.rel = 'noopener';
    return attrs;
  }

  function chevLink(href, label, cls) {
    return h('a', externalLink({ class: 'link ' + (cls || ''), href: href }),
      label + ' ', h('span', { class: 'chev', 'aria-hidden': 'true', text: '›' }));
  }

  // ---------------------------------------------------------------- hero
  function renderHero() {
    var name = profile.name || 'Jorelle Labanza';
    $$('[data-bind="name"]').forEach(function (el) { el.textContent = name + '.'; });
    $$('[data-bind="bio"]').forEach(function (el) { if (profile.bio) el.textContent = profile.bio; });
    $$('[data-bind="avatar"]').forEach(function (el) {
      if (profile.avatarUrl) el.src = profile.avatarUrl;
      el.alt = 'Portrait of ' + name;
    });
    $$('[data-bind="profile-url"]').forEach(function (el) { if (profile.url) el.href = profile.url; });
    var intro = $('[data-bind="hero-intro"]');
    if (intro && C.hero && C.hero.intro) intro.textContent = C.hero.intro;
    document.title = name + ' — ' + (profile.bio || 'Software Developer');
  }

  // ---------------------------------------------------------------- stats
  function renderStats() {
    var wrap = $('#stats');
    if (!wrap) return;
    var langSet = {};
    repos.concat(workRepos).forEach(function (r) {
      Object.keys(r.languages || {}).forEach(function (l) { langSet[l] = true; });
      if (r.language) langSet[r.language] = true;
    });
    var years = profile.createdAt ? new Date().getFullYear() - year(profile.createdAt) : 0;
    var items = [
      { n: profile.publicRepos || repos.length, label: 'Public repositories' },
      { n: years, label: 'Years on GitHub' },
      { n: Object.keys(langSet).length, label: 'Languages in use' },
    ];
    if (workRepos.length) items.splice(1, 0, { n: workRepos.length, label: 'Projects at ' + workLabel });
    items.forEach(function (it) {
      wrap.appendChild(h('div', { class: 'stat reveal' },
        h('span', { class: 'stat__num', 'data-count': it.n, text: '0' }),
        h('span', { class: 'stat__label', text: it.label })));
    });
  }

  function animateCounters() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $$('.stat__num').forEach(function (el) {
      var target = Number(el.getAttribute('data-count')) || 0;
      if (reduce || !('requestAnimationFrame' in window)) { el.textContent = String(target); return; }
      var start = null;
      var dur = 1400;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  // ---------------------------------------------------------------- visuals
  var VISUALS = {
    studio: function () {
      var grid = h('div', { class: 'viz-studio__grid', 'aria-hidden': 'true' });
      for (var i = 0; i < 9; i += 1) grid.appendChild(h('span'));
      return h('div', { class: 'viz-studio' }, grid,
        h('div', { class: 'viz-studio__bar', 'aria-hidden': 'true' }, 'a neon street after rain, 16:9, 4 images', h('b', { text: '↑' })));
    },
    bracket: function () {
      var svg =
        '<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tournament bracket">' +
        '<g fill="#f5f5f7" stroke="#d2d2d7">' +
        '<rect x="8" y="14" width="86" height="26" rx="8"/><rect x="8" y="54" width="86" height="26" rx="8"/>' +
        '<rect x="8" y="118" width="86" height="26" rx="8"/><rect x="8" y="158" width="86" height="26" rx="8"/>' +
        '<rect x="122" y="34" width="86" height="26" rx="8"/><rect x="122" y="138" width="86" height="26" rx="8"/>' +
        '</g>' +
        '<rect x="226" y="86" width="86" height="26" rx="8" fill="#0071e3"/>' +
        '<g fill="none" stroke="#d2d2d7" stroke-width="1.5">' +
        '<path d="M94 27h14v20h14M94 67h14v-20"/><path d="M94 131h14v20h14M94 171h14v-20"/>' +
        '<path d="M208 151h9v-52h9"/>' +
        '</g>' +
        '<path d="M208 47h9v52h9" fill="none" stroke="#0071e3" stroke-width="1.5"/>' +
        '<g font-family="-apple-system,BlinkMacSystemFont,Inter,Helvetica,Arial,sans-serif" font-size="11" fill="#1d1d1f">' +
        '<text x="20" y="31">1 · Kazuya</text><text x="20" y="71">8 · Lili</text>' +
        '<text x="20" y="135">4 · Jin</text><text x="20" y="175">5 · Hwoarang</text>' +
        '<text x="134" y="51">1 · Kazuya</text><text x="134" y="155">4 · Jin</text>' +
        '<text x="238" y="103" fill="#fff" font-weight="600">Kazuya wins</text>' +
        '</g></svg>';
      return h('div', { class: 'viz-bracket', html: svg });
    },
    trivia: function () {
      return h('div', { class: 'viz-trivia', 'aria-hidden': 'true' },
        h('div', { class: 'viz-trivia__pin' }, 'Game PIN', h('b', { text: '482 913' })),
        h('div', { class: 'viz-trivia__grid' },
          h('span', { text: '▲' }), h('span', { text: '◆' }), h('span', { text: '●' }), h('span', { text: '■' })));
    },
    prompt: function () {
      function row(label, value) { return h('div', null, h('span', { text: label }), h('b', { text: value })); }
      var out = h('div', { class: 'viz-prompt__out' });
      ['sitting', 'upper body', 'watercolor (medium)', 'soft lighting', 'masterpiece'].forEach(function (t) {
        out.appendChild(h('span', { text: t }));
      });
      return h('div', { class: 'viz-prompt', 'aria-hidden': 'true' },
        h('div', { class: 'viz-prompt__rows' }, row('Pose', 'sitting'), row('Shot', 'upper body'), row('Style', 'soft watercolor')),
        h('div', { class: 'viz-prompt__arrow', text: 'Build prompt ↓' }),
        out);
    },
    lora: function () {
      var thumbs = h('div', { class: 'viz-lora__thumbs' });
      for (var i = 0; i < 5; i += 1) thumbs.appendChild(h('span'));
      return h('div', { class: 'viz-lora', 'aria-hidden': 'true' },
        thumbs,
        h('div', { class: 'viz-lora__progress' }, h('div')),
        h('div', { class: 'viz-lora__row' }, h('span', { text: 'Step 1,440 of 2,000 · fp16 · dim 16' }), h('b', { text: 'character.safetensors' })));
    },
  };

  // ---------------------------------------------------------------- featured
  function renderFeatured() {
    var grid = $('#featured');
    if (!grid) return;
    (C.featured || []).forEach(function (f) {
      var r = byName[f.repo];
      if (!r) return;
      var cls = 'tile reveal' + (f.wide ? ' tile--wide' : '') + (f.theme === 'dark' ? ' tile--dark' : '');
      var meta = h('div', { class: 'tile__meta' },
        r.language ? h('span', null, dot(r.language), r.language) : null,
        r.stars ? h('span', { text: '★ ' + r.stars }) : null,
        h('span', { text: 'Updated ' + monthYear(r.pushedAt) }));
      var chips = h('div', { class: 'chips' });
      (f.stack || []).forEach(function (s) { chips.appendChild(h('span', { class: 'chip', text: s })); });
      var text = [
        h('p', { class: 'tile__kicker', text: r.name }),
        h('h3', { class: 'tile__title', text: f.title }),
        h('p', { class: 'tile__tagline', text: f.tagline }),
        h('p', { class: 'tile__body', text: f.body }),
        chips,
      ];
      var foot = h('div', { class: 'tile__foot' }, meta, chevLink(r.url, 'View on GitHub'));
      var viz = f.visual && VISUALS[f.visual] ? h('div', { class: 'tile__viz' }, VISUALS[f.visual]()) : null;

      var tile;
      if (f.wide) {
        tile = h('article', { class: cls },
          h('div', { class: 'tile__text' }, text, foot),
          viz);
      } else {
        tile = h('article', { class: cls }, text, viz, foot);
      }
      grid.appendChild(tile);
    });
  }

  // ---------------------------------------------------------------- work
  function renderWork() {
    var section = $('#work');
    var nav = $('#nav-work');
    if (!section || !workRepos.length) return;
    var cfg = C.work || {};
    section.hidden = false;
    if (nav) nav.hidden = false;
    if (cfg.eyebrow) $('#work-eyebrow').textContent = cfg.eyebrow;
    if (cfg.headline) $('#work-headline').textContent = cfg.headline;
    if (cfg.intro) $('#work-intro').textContent = cfg.intro;

    var byWorkName = {};
    workRepos.forEach(function (r) { byWorkName[r.name] = r; });
    var grid = $('#work-grid');
    var shown = {};

    (cfg.featured || []).forEach(function (name) {
      var r = byWorkName[name];
      if (!r) return;
      shown[name] = true;
      var desc = (cfg.descriptions && cfg.descriptions[name]) || r.description || '';
      var title = r.private
        ? h('span', { text: r.name })
        : h('a', externalLink({ href: r.url, text: r.name }));
      grid.appendChild(h('article', { class: 'work-card reveal' },
        h('div', { class: 'work-card__top' },
          r.language ? h('span', null, dot(r.language), r.language) : h('span'),
          h('span', { class: 'tag tag--lock', text: r.private ? 'Private' : 'Public' })),
        h('h3', { class: 'work-card__title' }, title),
        desc ? h('p', { class: 'work-card__desc', text: desc }) : null,
        h('div', { class: 'work-card__meta', text: (r.fork ? 'Fork · ' : '') + 'Updated ' + monthYear(r.pushedAt) })));
    });

    var rest = workRepos.filter(function (r) { return !shown[r.name]; });
    if (rest.length) {
      var chips = h('div', { class: 'chips work__more' });
      rest.forEach(function (r) {
        chips.appendChild(h('span', {
          class: 'chip',
          title: r.description || '',
          text: r.name + (r.language ? ' · ' + r.language : ''),
        }));
      });
      section.querySelector('.wrap').appendChild(h('div', { class: 'work__rest reveal' },
        h('h3', { class: 'work__rest-title', text: 'And ' + rest.length + ' more in the account' }),
        chips));
    }
  }

  // ---------------------------------------------------------------- lanes
  var ICONS = {
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3"/><path d="M17 6h3v1a3 3 0 0 1-3 3"/><path d="M12 14v3"/><path d="M8 20h8"/><path d="M9 17h6v3H9z"/></svg>',
  };

  function renderLanes() {
    var wrap = $('#lanes');
    if (!wrap) return;
    (C.lanes || []).forEach(function (lane) {
      var list = h('ul', { class: 'lane__repos' });
      var found = lane.repos.map(function (n) { return byName[n]; }).filter(Boolean);
      found.forEach(function (r) {
        list.appendChild(h('li', null,
          h('a', externalLink({ href: r.url }),
            h('span', { text: r.name }),
            h('small', { text: r.language || (r.fork ? 'Fork' : '') }))));
      });
      wrap.appendChild(h('article', { class: 'lane reveal' },
        h('div', { class: 'lane__icon', html: ICONS[lane.icon] || ICONS.layers, 'aria-hidden': 'true' }),
        h('h3', { class: 'lane__title', text: lane.title }),
        h('p', { class: 'lane__body', text: lane.body }),
        h('div', { class: 'lane__count', text: found.length + (found.length === 1 ? ' repository' : ' repositories') }),
        list));
    });
  }

  // ---------------------------------------------------------------- skills
  function renderSkills() {
    var list = $('#languages');
    if (list) {
      var counts = {};
      var bytes = {};
      repos.concat(workRepos).forEach(function (r) {
        var langs = Object.keys(r.languages || {});
        if (!langs.length && r.language) langs = [r.language];
        langs.forEach(function (l) {
          counts[l] = (counts[l] || 0) + 1;
          bytes[l] = (bytes[l] || 0) + (r.languages && r.languages[l] > 1 ? r.languages[l] : 0);
        });
      });
      // Rank by how many repositories use a language; break ties by volume of code.
      var sorted = Object.keys(counts).sort(function (a, b) {
        return counts[b] - counts[a] || bytes[b] - bytes[a] || a.localeCompare(b);
      }).slice(0, 8);
      var max = sorted.length ? counts[sorted[0]] : 1;
      sorted.forEach(function (l) {
        list.appendChild(h('li', { class: 'lang' },
          h('span', { class: 'lang__name', text: l }),
          h('div', { class: 'lang__bar', role: 'img', 'aria-label': l + ': ' + plural(counts[l], 'repo') },
            h('div', { class: 'lang__fill', style: '--w:' + Math.round((counts[l] / max) * 100) + '%' })),
          h('span', { class: 'lang__count', text: plural(counts[l], 'repo') })));
      });
    }

    var stack = $('#stack');
    if (stack) {
      stack.appendChild(h('h3', { class: 'specs__title', text: 'Stack' }));
      (C.stack || []).forEach(function (g) {
        var chips = h('div', { class: 'chips' });
        g.items.forEach(function (it) { chips.appendChild(h('span', { class: 'chip', text: it })); });
        stack.appendChild(h('div', { class: 'stack-group' }, h('h3', { text: g.group }), chips));
      });
    }
  }

  // ---------------------------------------------------------------- timeline
  function renderTimeline() {
    var list = $('#tl');
    if (!list) return;
    var byYear = {};
    repos.forEach(function (r) {
      var y = year(r.createdAt);
      (byYear[y] = byYear[y] || []).push(r);
    });
    var years = Object.keys(byYear).map(Number);
    if (profile.createdAt) years.push(year(profile.createdAt));
    Object.keys(C.timeline || {}).forEach(function (y) { years.push(Number(y)); });
    years = years.filter(function (y, i, a) { return a.indexOf(y) === i; }).sort(function (a, b) { return b - a; });

    var span = years.length ? years[0] - years[years.length - 1] : 0;
    var head = $('#timeline-headline');
    if (head && span > 1) head.textContent = span + ' years in the making.';

    years.forEach(function (y) {
      var blurb = (C.timeline && C.timeline[y]) || '';
      var items = (byYear[y] || []).slice().sort(function (a, b) { return a.createdAt.localeCompare(b.createdAt); });
      if (!blurb && !items.length) return;
      var chips = h('div', { class: 'tl__repos' });
      items.forEach(function (r) {
        chips.appendChild(h('a', externalLink({ href: r.url, text: r.name + (r.fork ? ' (fork)' : '') })));
      });
      list.appendChild(h('li', { class: 'tl__item reveal' },
        h('div', { class: 'tl__year', text: String(y) }),
        h('div', null, blurb ? h('p', { class: 'tl__blurb', text: blurb }) : null, items.length ? chips : null)));
    });
  }

  // ---------------------------------------------------------------- full list
  function renderRepos() {
    var list = $('#repo-list');
    var filters = $('#filters');
    if (!list || !filters) return;

    var groups = [
      { key: 'all', label: 'All', test: function () { return true; } },
      { key: 'JavaScript', label: 'JavaScript', test: function (r) { return r.language === 'JavaScript'; } },
      { key: 'Python', label: 'Python', test: function (r) { return r.language === 'Python'; } },
      { key: 'other', label: 'Other', test: function (r) { return r.language !== 'JavaScript' && r.language !== 'Python'; } },
    ];

    repos.forEach(function (r) {
      var meta = h('div', { class: 'repo__meta' },
        r.language ? h('span', null, dot(r.language), r.language) : h('span', { text: r.size ? 'Mixed' : 'Empty' }),
        r.stars ? h('span', { text: '★ ' + r.stars }) : null,
        h('span', { text: 'Updated ' + monthYear(r.pushedAt) }));
      list.appendChild(h('article', { class: 'repo', 'data-lang': r.language || '' },
        h('div', null,
          h('a', externalLink({ class: 'repo__name', href: r.url, text: r.name })),
          r.fork ? h('span', { class: 'tag', text: 'Fork' }) : null,
          r.archived ? h('span', { class: 'tag', text: 'Archived' }) : null,
          h('p', { class: 'repo__desc', text: describe(r) })),
        meta));
    });
    var empty = h('p', { class: 'repos__empty', text: 'Nothing here yet.', hidden: true });
    list.appendChild(empty);

    var rows = $$('.repo', list);
    function apply(group) {
      var shown = 0;
      rows.forEach(function (row, i) {
        var ok = group.test(repos[i]);
        row.hidden = !ok;
        if (ok) shown += 1;
      });
      empty.hidden = shown > 0;
      $$('.filter', filters).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-key') === group.key ? 'true' : 'false'); });
    }
    groups.forEach(function (g) {
      var count = repos.filter(g.test).length;
      var btn = h('button', { class: 'filter', type: 'button', 'data-key': g.key, 'aria-pressed': 'false', text: g.label + ' · ' + count });
      btn.addEventListener('click', function () { apply(g); });
      filters.appendChild(btn);
    });
    apply(groups[0]);
  }

  // ---------------------------------------------------------------- footer
  function renderFooter() {
    var legal = $('#footer-legal');
    if (legal) legal.textContent = 'Copyright © ' + new Date().getFullYear() + ' ' + (profile.name || 'Jorelle Labanza') + '. All rights reserved.';
    var note = $('#footer-note');
    if (note && D.generatedAt) {
      var when = new Date(D.generatedAt).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });
      note.textContent = 'Built with plain HTML, CSS and JavaScript. Data comes from the GitHub API and was last refreshed on ' + when + '.';
    }
  }

  // ---------------------------------------------------------------- nav
  function initNav() {
    var nav = $('.gnav');
    var toggle = $('.gnav__toggle');
    if (!nav || !toggle) return;
    function setOpen(open) {
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    $$('.gnav__menu a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });
  }

  // ---------------------------------------------------------------- reveal
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      animateCounters();
      return;
    }
    var countersDone = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
        if (!countersDone && entry.target.classList.contains('stat')) {
          countersDone = true;
          animateCounters();
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // ---------------------------------------------------------------- go
  renderHero();
  renderStats();
  renderFeatured();
  renderWork();
  renderLanes();
  renderSkills();
  renderTimeline();
  renderRepos();
  renderFooter();
  initNav();
  initReveal();
})();
