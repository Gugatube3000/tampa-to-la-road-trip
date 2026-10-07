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

  /* ---------------------------------------------------------- anatomy */
  var anatomy = doc.querySelector('[data-anatomy]');
  if (anatomy) {
    var partItems = anatomy.querySelectorAll('.part');
    var spots = anatomy.querySelectorAll('[data-part-btn]');

    var activate = function (key) {
      var current = anatomy.getAttribute('data-active');
      if (key && key === current) key = null;
      if (key) anatomy.setAttribute('data-active', key); else anatomy.removeAttribute('data-active');
      partItems.forEach(function (li) {
        var on = li.getAttribute('data-key') === key;
        li.classList.toggle('is-active', on);
        li.querySelector('.part__btn').setAttribute('aria-expanded', String(on));
      });
      spots.forEach(function (s) {
        var on = s.getAttribute('data-part-btn') === key;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-pressed', String(on));
      });
    };
    partItems.forEach(function (li) {
      li.querySelector('.part__btn').addEventListener('click', function () { activate(li.getAttribute('data-key')); });
    });
    spots.forEach(function (s) {
      s.addEventListener('click', function () { activate(s.getAttribute('data-part-btn')); });
    });
  }

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
