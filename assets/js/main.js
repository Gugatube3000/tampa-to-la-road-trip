/* Novex Exterior — site interactions */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var header = doc.querySelector('.site-header');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------- header */
  var lastY = window.scrollY;
  var ticking = false;
  var actionBar = doc.querySelector('.action-bar');
  var footerEl = doc.querySelector('.site-footer');
  var footerVisible = false;

  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('is-solid', y > 40);
      var goingDown = y > lastY;
      var menuOpen = body.classList.contains('menu-open');
      var megaOpen = header.querySelector('.nav__item--mega:hover, .nav__item--mega:focus-within');
      header.classList.toggle('is-hidden', goingDown && y > 520 && !menuOpen && !megaOpen);
    }
    if (actionBar) {
      actionBar.classList.toggle('is-visible', y > window.innerHeight * 0.6 && !footerVisible && !body.classList.contains('menu-open'));
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  if (footerEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      footerVisible = entries[0].isIntersecting;
      onScroll();
    }).observe(footerEl);
  }
  onScroll();

  /* ---------------------------------------------------------- mobile menu */
  var toggle = doc.querySelector('.menu-toggle');
  var menu = doc.getElementById('mobile-menu');

  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (menu) menu.toggleAttribute('inert', !open);
    if (header) header.classList.remove('is-hidden');
    onScroll();
  }
  if (toggle && menu) {
    menu.setAttribute('inert', '');
    toggle.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && body.classList.contains('menu-open')) setMenu(false);
    });
  }

  /* ---------------------------------------------------------- mega menu (keyboard / touch) */
  doc.querySelectorAll('.nav__item--mega').forEach(function (item) {
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { item.classList.remove('is-open'); var l = item.querySelector('.nav__link'); if (l) { l.focus(); l.blur(); } }
    });
    item.addEventListener('mouseleave', function () { item.classList.remove('is-open'); });
  });

  /* ---------------------------------------------------------- split headlines into words */
  function splitWords(el) {
    var n = 0;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(' ')); return; }
            var w = doc.createElement('span');
            var wi = doc.createElement('span');
            w.className = 'w';
            w.setAttribute('aria-hidden', 'true');
            wi.className = 'wi';
            wi.style.setProperty('--wi', n++);
            wi.textContent = part;
            w.appendChild(wi);
            frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') {
          walk(c);
        }
      });
    })(el);
  }
  doc.querySelectorAll('[data-reveal="split"], [data-split-now]').forEach(splitWords);
  doc.querySelectorAll('[data-split-now]').forEach(function (el) {
    setTimeout(function () { el.classList.add('is-in'); }, 120);
  });

  /* ---------------------------------------------------------- reveal on scroll */
  var revealEls = doc.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------- scroll motion engine */
  var motion = doc.documentElement.classList.contains('motion');
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  var vh = window.innerHeight;
  var vw = window.innerWidth;
  var effects = [];
  var running = false;

  function frame() {
    var y = window.scrollY;
    var busy = false;
    for (var i = 0; i < effects.length; i++) {
      if (effects[i](y)) busy = true;
    }
    if (busy) window.requestAnimationFrame(frame);
    else running = false;
  }
  function kick() {
    if (!running && effects.length) { running = true; window.requestAnimationFrame(frame); }
  }
  // smooth a value toward its target; returns true while still moving
  function follow(state, target, rate, eps) {
    if (state.v === null) state.v = target;
    state.v += (target - state.v) * rate;
    if (Math.abs(target - state.v) < eps) state.v = target;
    return state.v !== target;
  }
  window.addEventListener('resize', function () { vh = window.innerHeight; vw = window.innerWidth; kick(); });

  // hero: photo drifts slower than the page, copy lifts and fades
  var hero = doc.querySelector('[data-hero]');
  if (motion && hero) {
    var heroMedia = hero.querySelector('.hero__media');
    var heroCopy = hero.querySelector('[data-hero-content]');
    var hs = { v: null };
    effects.push(function (y) {
      var h = hero.offsetHeight;
      var moving = follow(hs, Math.min(y, h), 0.2, 0.1);
      var hImgs = heroMedia.querySelectorAll('img');
      for (var i = 0; i < hImgs.length; i++) hImgs[i].style.transform = 'translate3d(0,' + (hs.v * 0.28).toFixed(1) + 'px,0)';
      if (heroCopy) {
        var wide = vw >= 900;
        heroCopy.style.transform = wide ? 'translate3d(0,' + (hs.v * -0.12).toFixed(1) + 'px,0)' : '';
        heroCopy.style.opacity = wide ? clamp(1 - hs.v / (vh * 0.8), 0, 1).toFixed(3) : '';
      }
      return moving;
    });
  }

  // parallax photos: the image glides inside its frame
  if (motion) {
    doc.querySelectorAll('[data-parallax], .band__media').forEach(function (m) {
      var strength = parseFloat(m.getAttribute('data-parallax')) || 0.12;
      var st = { v: null };
      effects.push(function () {
        var r = m.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return false;
        var pr = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
        var moving = follow(st, -pr * strength * r.height, 0.14, 0.2);
        var t = 'translate3d(0,' + st.v.toFixed(1) + 'px,0) scale(' + (1 + strength * 2.2).toFixed(3) + ')';
        var imgs = m.querySelectorAll('img');
        for (var i = 0; i < imgs.length; i++) imgs[i].style.transform = t;
        return moving;
      });
    });
  }

  // marquee: drifts on its own, speeds up and changes direction with scrolling
  var mq = doc.querySelector('[data-marquee]');
  if (motion && mq && 'IntersectionObserver' in window) {
    var track = mq.querySelector('.marquee__track');
    var mx = 0, mLast = window.scrollY, mVel = 0, mDir = 1, mIn = false, mPrev = 0;
    new IntersectionObserver(function (e) { mIn = e[0].isIntersecting; if (mIn) kick(); }).observe(mq);
    effects.push(function (y) {
      if (!mIn) { mLast = y; mPrev = 0; return false; }
      var now = performance.now();
      var dt = mPrev ? Math.min((now - mPrev) / 16.67, 3) : 1;
      mPrev = now;
      var dy = y - mLast;
      mLast = y;
      mVel += (dy - mVel) * 0.12;
      if (Math.abs(dy) > 0.5) mDir = dy > 0 ? 1 : -1;
      mx -= (0.55 + Math.min(Math.abs(mVel) * 0.32, 14)) * mDir * dt;
      var unit = track.scrollWidth / 4;
      if (mx <= -unit) mx += unit;
      if (mx > 0) mx -= unit;
      track.style.transform = 'translate3d(' + mx.toFixed(2) + 'px,0,0)';
      return true;
    });
  }

  // board stack: boards lift apart as the section scrolls in
  var stack = doc.querySelector('[data-stack] .stack__svg');
  if (motion && stack) {
    var sk = { v: 0 };
    effects.push(function () {
      var r = stack.getBoundingClientRect();
      if (r.top > vh + 200 && sk.v === 0) return false;
      var moving = follow(sk, ease(clamp((vh * 0.92 - r.top) / (vh * 0.6), 0, 1)), 0.09, 0.001);
      stack.style.setProperty('--k', sk.v.toFixed(4));
      return moving;
    });
  }

  // assembly: trim flies onto the house, one part per step, while the section is pinned
  var asm = doc.querySelector('[data-assembly]');
  if (asm) {
    var parts = ['corners', 'skirt', 'casings', 'frieze', 'rake', 'sheets'];
    // where each part flies in from (SVG units)
    var from = { corners: [0, 380], skirt: [-560, 0], casings: [0, -120], frieze: [560, 0], rake: [0, -380], sheets: [0, 0] };
    var groups = {};
    parts.forEach(function (k) { groups[k] = asm.querySelector('.ap[data-part="' + k + '"]'); });
    var stepEls = asm.querySelectorAll('.step-item');
    var countEl = asm.querySelector('[data-count]');
    var bar = asm.querySelector('[data-progress]');
    var ap = { v: null };
    var shown = null;
    var paint = function (p) {
      var seg = clamp((p - 0.05) / 0.86, 0, 1) * parts.length;
      for (var i = 0; i < parts.length; i++) {
        var g = groups[parts[i]];
        if (!g) continue;
        var k = ease(clamp((seg - i) / 0.8, 0, 1));
        var f = from[parts[i]];
        g.style.transform = k === 1 ? '' : 'translate(' + (f[0] * (1 - k)).toFixed(1) + 'px,' + (f[1] * (1 - k)).toFixed(1) + 'px)';
        g.style.opacity = k === 1 ? '' : k.toFixed(3);
      }
      var step = clamp(Math.floor(seg), 0, parts.length - 1);
      var finished = p > 0.94;
      var key = step + (finished ? 'f' : '') + (p < 0.05 ? 's' : '');
      if (key !== shown) {
        shown = key;
        stepEls.forEach(function (li, i) {
          li.classList.toggle('is-current', i === step);
          li.classList.toggle('is-done', i < step);
        });
        if (finished || p < 0.05) asm.removeAttribute('data-active');
        else asm.setAttribute('data-active', parts[step]);
        if (countEl) countEl.textContent = (step < 9 ? '0' : '') + (step + 1);
      }
      if (bar) bar.style.setProperty('--p', p.toFixed(4));
    };
    if (motion) {
      effects.push(function () {
        var r = asm.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return false;
        var moving = follow(ap, clamp(-r.top / (r.height - vh), 0, 1), 0.13, 0.0004);
        paint(ap.v);
        return moving;
      });
    } else if (countEl) {
      countEl.parentNode.style.display = 'none';
    }
  }

  if (motion) {
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('load', kick);
    kick();
  }

  /* ---------------------------------------------------------- spec tabs */
  doc.querySelectorAll('[data-tabs]').forEach(function (wrap) {
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        doc.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
  });

  /* ---------------------------------------------------------- gallery + lightbox */
  var gallery = doc.querySelector('[data-gallery]');
  if (gallery) {
    var tiles = Array.prototype.slice.call(gallery.querySelectorAll('.tile'));
    var filters = doc.querySelectorAll('[data-filter]');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        tiles.forEach(function (t) {
          var show = f === 'all' || (' ' + t.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') > -1;
          t.classList.toggle('is-hidden', !show);
          if (show) t.classList.add('is-in');
        });
      });
    });

    var lb = doc.querySelector('[data-lightbox]');
    var stage = lb.querySelector('[data-lb-stage]');
    var lbTitle = lb.querySelector('[data-lb-title]');
    var lbSub = lb.querySelector('[data-lb-sub]');
    var lbCount = lb.querySelector('[data-lb-count]');
    var closeBtn = lb.querySelector('[data-lb-close]');
    var index = 0;
    var lastFocus = null;

    var visibleTiles = function () { return tiles.filter(function (t) { return !t.classList.contains('is-hidden'); }); };
    var show = function (i) {
      var list = visibleTiles();
      index = (i + list.length) % list.length;
      var tile = list[index];
      var fig = tile.querySelector('.media').cloneNode(true);
      fig.querySelectorAll('img').forEach(function (img) { img.removeAttribute('loading'); });
      stage.innerHTML = '';
      stage.appendChild(fig);
      lbTitle.textContent = tile.getAttribute('data-title');
      lbSub.textContent = tile.getAttribute('data-sub');
      lbCount.textContent = (index + 1) + ' / ' + list.length;
    };
    var open = function (tile) {
      lastFocus = tile;
      lb.hidden = false;
      show(visibleTiles().indexOf(tile));
      window.requestAnimationFrame(function () { lb.classList.add('is-open'); });
      body.style.overflow = 'hidden';
      closeBtn.focus();
    };
    var close = function () {
      lb.classList.remove('is-open');
      body.style.overflow = '';
      setTimeout(function () { lb.hidden = true; stage.innerHTML = ''; }, 350);
      if (lastFocus) lastFocus.focus();
    };
    tiles.forEach(function (t) { t.addEventListener('click', function (e) { e.preventDefault(); open(t); }); });
    closeBtn.addEventListener('click', close);
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { show(index - 1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { show(index + 1); });
    lb.addEventListener('click', function (e) { if (e.target === stage) close(); });
    doc.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'Tab') {
        var f = lb.querySelectorAll('button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var touchX = null;
    stage.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  /* ---------------------------------------------------------- quote form */
  var form = doc.querySelector('[data-quote-form]');
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var product = params.get('product');
    var type = params.get('type');
    var topic = params.get('topic');
    if (product) {
      var box = form.querySelector('[data-product="' + product + '"]');
      if (box) box.checked = true;
    }
    if (type === 'trade') {
      form.type.value = 'trade';
      form.topic.value = 'trade';
    }
    if (topic && form.topic.querySelector('option[value="' + topic + '"]')) form.topic.value = topic;

    var validate = function () {
      var ok = true;
      ['name', 'email'].forEach(function (n) {
        var input = form[n];
        var field = input.closest('.field');
        var valid = input.value.trim() !== '' && (n !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()));
        field.classList.toggle('has-error', !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });
      return ok;
    };
    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && field.classList.contains('has-error')) field.classList.remove('has-error');
    });

    var summary = function () {
      var data = new FormData(form);
      var products = data.getAll('products').join(', ');
      var opt = function (sel) { return sel.value ? sel.options[sel.selectedIndex].text : ''; };
      var lines = [
        'Name: ' + data.get('name'),
        'Company: ' + (data.get('company') || '—'),
        'Email: ' + data.get('email'),
        'Phone: ' + (data.get('phone') || '—'),
        'I am a: ' + (opt(form.type) || '—'),
        'Looking for: ' + opt(form.topic),
        'Products: ' + (products || '—'),
        'Project location: ' + (data.get('location') || '—'),
        'Timeline: ' + (opt(form.timeline) || '—'),
        '',
        'Project details:',
        data.get('message') || '—'
      ];
      return lines.join('\n');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      var endpoint = form.getAttribute('data-endpoint');
      var success = form.nextElementSibling;
      var done = function (msg) {
        if (msg) success.querySelector('[data-success-text]').innerHTML = msg;
        form.classList.add('is-sent');
        success.focus();
      };
      if (endpoint) {
        var btn = form.querySelector('[type="submit"]');
        btn.disabled = true;
        fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); done('Thanks — your request is on its way. We&rsquo;ll be in touch shortly.'); })
          .catch(function () { btn.disabled = false; window.location.href = mailto(); done(); });
      } else {
        window.location.href = mailto();
        done();
      }
    });

    var mailto = function () {
      var subject = 'Novex Exterior — ' + (form.topic.value === 'trade' ? 'Trade account request' : 'Quote request') + ' from ' + form.name.value.trim();
      return 'mailto:hello@novexexterior.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(summary());
    };
  }
})();
