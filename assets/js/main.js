/* Novex Exterior — native scrolling and progressively enhanced interactions. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;
  var header = doc.querySelector('.site-header');
  var actionBar = doc.querySelector('.action-bar');
  var footer = doc.querySelector('.site-footer');
  var menuToggle = doc.querySelector('.menu-toggle');
  var menu = doc.getElementById('mobile-menu');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktopMotion = window.matchMedia('(min-width: 900px) and (pointer: fine)');
  var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var revealElements = Array.from(doc.querySelectorAll('[data-reveal]'));
  var photos = Array.from(doc.querySelectorAll('[data-parallax]'));
  var visiblePhotos = new Set();
  var revealsEnabled = false;
  var parallaxEnabled = false;
  var footerVisible = false;
  var menuOpen = false;
  var lightboxOpen = false;
  var framePending = false;
  var isolation = [];
  var menuReturnFocus = null;
  var savedOverflow = '';

  // Content starts visible. Effects are opt-in, after this deferred script is ready.
  root.classList.remove('motion', 'photo-motion', 'js');

  function canReveal() {
    var slowNetwork = connection && (connection.saveData || /^(slow-2g|2g|3g)$/.test(connection.effectiveType || ''));
    return !reducedMotion.matches && !slowNetwork && 'IntersectionObserver' in window;
  }

  function scheduleFrame() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(paintScroll);
  }

  function paintScroll() {
    framePending = false;
    var y = window.scrollY;
    var viewportHeight = window.innerHeight;
    var photoUpdates = [];
    if (parallaxEnabled && !doc.hidden) {
      visiblePhotos.forEach(function (photo) {
        var rect = photo.getBoundingClientRect();
        var center = rect.top + rect.height / 2 - viewportHeight / 2;
        photoUpdates.push({ photo: photo, drift: Math.max(-12, Math.min(12, -center * 0.025)) });
      });
    }
    // Finish every layout read before changing classes or image transforms.
    if (header) {
      header.classList.toggle('is-solid', y > 40);
      header.classList.remove('is-hidden');
    }
    if (actionBar) {
      var showActions = y > viewportHeight * 0.6 && !footerVisible && !menuOpen && !lightboxOpen;
      actionBar.classList.toggle('is-visible', showActions);
      actionBar.toggleAttribute('inert', !showActions);
    }
    photoUpdates.forEach(function (update) {
      update.photo.style.setProperty('--photo-drift', update.drift.toFixed(1) + 'px');
    });
    // No idle animation loop: a scroll, resize or visibility change requests one frame.
  }

  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    var scrollStateChanged = false;
    entries.forEach(function (entry) {
      var target = entry.target;
      if (target === footer && footerVisible !== entry.isIntersecting) {
        footerVisible = entry.isIntersecting;
        scrollStateChanged = true;
      }
      if (target.hasAttribute('data-reveal')) {
        // These rectangles are supplied by the browser's observer pass.
        // No synchronous startup layout reads, including on mobile.
        var aboveViewportBottom = !entry.rootBounds || entry.boundingClientRect.top < entry.rootBounds.bottom;
        if (!revealsEnabled || target.classList.contains('is-in') || entry.isIntersecting || aboveViewportBottom) {
          target.classList.add('is-in');
          target.classList.remove('reveal-ready');
          if (!photos.includes(target) && target !== footer) observer.unobserve(target);
        } else {
          target.classList.add('reveal-ready');
        }
      }
      if (photos.includes(target)) {
        if (entry.isIntersecting) visiblePhotos.add(target);
        else visiblePhotos.delete(target);
        if (parallaxEnabled) scrollStateChanged = true;
      }
    });
    // Reveals run as CSS transitions and need no extra scroll work.
    if (scrollStateChanged) scheduleFrame();
  }, { threshold: 0.08 }) : null;

  function configureMotion() {
    revealsEnabled = canReveal();
    parallaxEnabled = revealsEnabled && desktopMotion.matches;
    root.classList.toggle('motion', revealsEnabled);
    root.classList.toggle('photo-motion', parallaxEnabled);
    revealElements.forEach(function (element) {
      if (!revealsEnabled || element.classList.contains('is-in')) {
        element.classList.add('is-in');
        element.classList.remove('reveal-ready');
        if (observer && !photos.includes(element) && element !== footer) observer.unobserve(element);
      }
    });
    if (!parallaxEnabled) photos.forEach(function (photo) { photo.style.removeProperty('--photo-drift'); });
    scheduleFrame();
  }

  if (observer) {
    new Set(revealElements.concat(photos, footer ? [footer] : [])).forEach(function (element) { observer.observe(element); });
  }
  configureMotion();
  window.addEventListener('scroll', scheduleFrame, { passive: true });
  window.addEventListener('resize', function () {
    if (menuOpen && window.innerWidth >= 1024) setMenu(false);
    scheduleFrame();
  }, { passive: true });
  doc.addEventListener('visibilitychange', scheduleFrame);
  [reducedMotion, desktopMotion, connection].forEach(function (source) {
    if (!source) return;
    if (source.addEventListener) source.addEventListener('change', configureMotion);
    else if (source.addListener) source.addListener(configureMotion);
  });

  /* Modal focus and background isolation, shared by the menu and gallery. */
  var focusSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function visible(element) {
    return element && element.getClientRects().length > 0 && !element.closest('[inert]');
  }

  function restoreBackground() {
    isolation.forEach(function (state) {
      state.element.toggleAttribute('inert', state.inert);
      if (state.ariaHidden === null) state.element.removeAttribute('aria-hidden');
      else state.element.setAttribute('aria-hidden', state.ariaHidden);
    });
    isolation = [];
  }

  function isolateBackground(allowed) {
    restoreBackground();
    function walk(parent) {
      Array.from(parent.children).forEach(function (element) {
        if (/^(SCRIPT|STYLE|LINK)$/.test(element.tagName) || allowed.includes(element)) return;
        if (allowed.some(function (active) { return element.contains(active); })) {
          walk(element);
        } else {
          isolation.push({ element: element, inert: element.hasAttribute('inert'), ariaHidden: element.getAttribute('aria-hidden') });
          element.setAttribute('inert', '');
          element.setAttribute('aria-hidden', 'true');
        }
      });
    }
    walk(body);
  }

  function trapFocus(event, containers) {
    if (event.key !== 'Tab') return;
    var candidates = [];
    containers.forEach(function (container) {
      if (container.matches(focusSelector)) candidates.push(container);
      candidates = candidates.concat(Array.from(container.querySelectorAll(focusSelector)));
    });
    var focusable = candidates.filter(visible);
    if (!focusable.length) { event.preventDefault(); return; }
    var current = focusable.indexOf(doc.activeElement);
    if (current === -1 || (event.shiftKey && current === 0) || (!event.shiftKey && current === focusable.length - 1)) {
      event.preventDefault();
      focusable[event.shiftKey ? focusable.length - 1 : 0].focus();
    }
  }

  function setMenu(open, restoreFocus) {
    if (!menu || !menuToggle || open === menuOpen) return;
    if (open) {
      menuReturnFocus = doc.activeElement;
      menu.removeAttribute('inert');
      menu.removeAttribute('aria-hidden');
      menu.setAttribute('role', 'dialog');
      menu.setAttribute('aria-modal', 'true');
      menuOpen = true;
      body.classList.add('menu-open');
      isolateBackground([menu, menuToggle]);
      var firstControl = menu.querySelector('[data-menu-close], a[href]');
      if (firstControl) firstControl.focus();
    } else {
      menuOpen = false;
      body.classList.remove('menu-open');
      restoreBackground();
      menu.setAttribute('inert', '');
      menu.setAttribute('aria-hidden', 'true');
      menu.removeAttribute('aria-modal');
      if (restoreFocus !== false) {
        var returnTo = visible(menuReturnFocus) ? menuReturnFocus : menuToggle;
        if (visible(returnTo)) returnTo.focus();
      }
    }
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    scheduleFrame();
  }

  if (menu && menuToggle) {
    menu.setAttribute('inert', '');
    menu.setAttribute('aria-hidden', 'true');
    menuToggle.addEventListener('click', function () { setMenu(!menuOpen); });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('[data-menu-close]')) setMenu(false);
      else if (event.target.closest('a[href]')) setMenu(false, false);
    });
    doc.addEventListener('keydown', function (event) {
      if (!menuOpen) return;
      if (event.key === 'Escape') { event.preventDefault(); setMenu(false); }
      else trapFocus(event, [menu]);
    });
  }

  doc.querySelectorAll('.nav__item--mega').forEach(function (item) {
    var dropdown = item.querySelector('.mega');
    function resetDropdown() {
      item.classList.remove('is-dismissed', 'is-open');
      if (dropdown) dropdown.removeAttribute('inert');
    }
    item.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      item.classList.remove('is-open');
      var link = item.querySelector('.nav__link');
      if (link) link.focus();
      item.classList.add('is-dismissed');
      if (dropdown) dropdown.setAttribute('inert', '');
    });
    item.addEventListener('pointerenter', resetDropdown);
    item.addEventListener('mouseleave', resetDropdown);
    item.addEventListener('focusin', resetDropdown);
  });

  /* A user-paced detail explorer; every choice is also available as a text button. */
  doc.querySelectorAll('[data-detail-explorer]').forEach(function (explorer) {
    var choices = Array.from(explorer.querySelectorAll('button[data-detail]'));
    var panels = Array.from(explorer.querySelectorAll('[data-detail-panel]'));
    function selectDetail(value) {
      if (!panels.some(function (panel) { return panel.getAttribute('data-detail-panel') === value; })) return;
      choices.forEach(function (button) { button.setAttribute('aria-pressed', String(button.getAttribute('data-detail') === value)); });
      panels.forEach(function (panel) { panel.hidden = panel.getAttribute('data-detail-panel') !== value; });
      explorer.setAttribute('data-active-detail', value);
    }
    choices.forEach(function (button) { button.addEventListener('click', function () { selectDetail(button.getAttribute('data-detail')); }); });
    var selected = choices.find(function (button) { return button.getAttribute('aria-pressed') === 'true'; });
    if (selected || choices[0]) selectDetail((selected || choices[0]).getAttribute('data-detail'));
  });

  doc.querySelectorAll('[data-tabs]').forEach(function (wrap) {
    var tabs = Array.from(wrap.querySelectorAll('[role="tab"]'));
    function selectTab(tab, focus) {
      tabs.forEach(function (candidate) {
        var active = candidate === tab;
        candidate.setAttribute('aria-selected', String(active));
        candidate.tabIndex = active ? 0 : -1;
        var panel = doc.getElementById(candidate.getAttribute('aria-controls'));
        if (panel) panel.hidden = !active;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { selectTab(tab); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== null) { event.preventDefault(); selectTab(tabs[next], true); }
      });
    });
  });

  /* Gallery filtering and a keyboard / touch accessible photo viewer. */
  var gallery = doc.querySelector('[data-gallery]');
  var lightbox = doc.querySelector('[data-lightbox]');
  if (gallery) {
    var tiles = Array.from(gallery.querySelectorAll('.tile'));
    var filters = Array.from(doc.querySelectorAll('[data-filter]'));
    filters.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter');
        filters.forEach(function (candidate) { candidate.setAttribute('aria-pressed', String(candidate === button)); });
        tiles.forEach(function (tile) {
          var tags = (tile.getAttribute('data-tags') || '').split(/\s+/);
          var show = filter === 'all' || tags.includes(filter);
          tile.classList.toggle('is-hidden', !show);
          tile.hidden = !show;
          if (show) { tile.classList.add('is-in'); tile.classList.remove('reveal-ready'); }
        });
      });
    });

    if (lightbox) {
      var stage = lightbox.querySelector('[data-lb-stage]');
      var title = lightbox.querySelector('[data-lb-title]');
      var subtitle = lightbox.querySelector('[data-lb-sub]');
      var count = lightbox.querySelector('[data-lb-count]');
      var closeButton = lightbox.querySelector('[data-lb-close]');
      var previousButton = lightbox.querySelector('[data-lb-prev]');
      var nextButton = lightbox.querySelector('[data-lb-next]');
      var currentIndex = 0;
      var galleryReturnFocus = null;
      var touchX = null;
      var touchY = null;
      if (count) count.setAttribute('aria-live', 'polite');

      function visibleTiles() { return tiles.filter(function (tile) { return !tile.hidden && !tile.classList.contains('is-hidden'); }); }

      function showPhoto(index) {
        var list = visibleTiles();
        if (!list.length || !stage) return;
        currentIndex = (index + list.length) % list.length;
        var tile = list[currentIndex];
        var original = tile.querySelector('.media');
        if (!original) return;
        var figure = original.cloneNode(true);
        figure.removeAttribute('data-parallax');
        figure.removeAttribute('style');
        figure.querySelectorAll('img').forEach(function (image) {
          image.removeAttribute('loading');
          image.setAttribute('decoding', 'async');
          image.setAttribute('sizes', '(max-width: 900px) 100vw, 1200px');
          image.style.removeProperty('transform');
          var fullSource = tile.getAttribute('data-full-src');
          var fullSrcset = tile.getAttribute('data-full-srcset');
          if (fullSource) image.src = fullSource;
          if (fullSrcset) image.srcset = fullSrcset;
        });
        stage.replaceChildren(figure);
        if (title) title.textContent = tile.getAttribute('data-title') || '';
        if (subtitle) subtitle.textContent = tile.getAttribute('data-sub') || '';
        if (count) count.textContent = (currentIndex + 1) + ' / ' + list.length;
        if (previousButton) previousButton.disabled = list.length < 2;
        if (nextButton) nextButton.disabled = list.length < 2;
      }

      function openGallery(tile) {
        if (menuOpen) setMenu(false, false);
        galleryReturnFocus = doc.activeElement;
        lightbox.hidden = false;
        lightbox.classList.add('is-open');
        lightboxOpen = true;
        showPhoto(visibleTiles().indexOf(tile));
        savedOverflow = body.style.overflow;
        body.style.overflow = 'hidden';
        isolateBackground([lightbox]);
        if (closeButton) closeButton.focus();
        scheduleFrame();
      }

      function closeGallery() {
        if (!lightboxOpen) return;
        lightboxOpen = false;
        lightbox.classList.remove('is-open');
        lightbox.hidden = true;
        body.style.overflow = savedOverflow;
        restoreBackground();
        if (stage) stage.replaceChildren();
        if (visible(galleryReturnFocus)) galleryReturnFocus.focus();
        scheduleFrame();
      }

      tiles.forEach(function (tile) { tile.addEventListener('click', function (event) { event.preventDefault(); openGallery(tile); }); });
      if (closeButton) closeButton.addEventListener('click', closeGallery);
      if (previousButton) previousButton.addEventListener('click', function () { showPhoto(currentIndex - 1); });
      if (nextButton) nextButton.addEventListener('click', function () { showPhoto(currentIndex + 1); });
      if (stage) {
        stage.addEventListener('click', function (event) { if (event.target === stage) closeGallery(); });
        stage.addEventListener('touchstart', function (event) {
          if (event.touches.length !== 1) { touchX = null; return; }
          touchX = event.touches[0].clientX;
          touchY = event.touches[0].clientY;
        }, { passive: true });
        stage.addEventListener('touchend', function (event) {
          if (touchX === null || !event.changedTouches.length) return;
          var dx = event.changedTouches[0].clientX - touchX;
          var dy = event.changedTouches[0].clientY - touchY;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(currentIndex + (dx < 0 ? 1 : -1));
          touchX = null;
        }, { passive: true });
        stage.addEventListener('touchcancel', function () { touchX = null; }, { passive: true });
      }
      doc.addEventListener('keydown', function (event) {
        if (!lightboxOpen) return;
        if (event.key === 'Escape') { event.preventDefault(); closeGallery(); }
        else if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentIndex - 1); }
        else if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentIndex + 1); }
        else trapFocus(event, [lightbox]);
      });
    }
  }

  /* Contact: a mailto opens a draft; only an acknowledged POST is a sent request. */
  var form = doc.querySelector('[data-quote-form]');
  if (form) {
    var field = function (name) { return form.elements.namedItem(name); };
    var params = new URLSearchParams(window.location.search);
    var product = params.get('product');
    var topic = params.get('topic');
    var endpoint = form.getAttribute('data-endpoint');
    var submitButton = form.querySelector('[type="submit"]');
    var status = form.nextElementSibling;
    form.querySelectorAll('[data-product]').forEach(function (checkbox) {
      if (checkbox.getAttribute('data-product') === product) checkbox.checked = true;
    });
    if (params.get('type') === 'trade') { field('type').value = 'trade'; field('topic').value = 'trade'; }
    if (topic && Array.from(field('topic').options).some(function (option) { return option.value === topic; })) field('topic').value = topic;

    function labelSubmit(label) {
      if (!submitButton) return;
      var text = Array.from(submitButton.childNodes).find(function (node) { return node.nodeType === 3 && node.textContent.trim(); });
      if (text) text.textContent = label + ' ';
      else submitButton.prepend(doc.createTextNode(label + ' '));
    }
    if (!endpoint) labelSubmit('Open email draft');

    function setFieldError(input, invalid) {
      var container = input.closest('.field');
      var error = container && container.querySelector('.field__error');
      if (container) container.classList.toggle('has-error', invalid);
      input.setAttribute('aria-invalid', String(invalid));
      if (error) {
        if (!error.id) error.id = input.id + '-error';
        var describedBy = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (id) { return id && id !== error.id; });
        if (invalid) describedBy.push(error.id);
        if (describedBy.length) input.setAttribute('aria-describedby', describedBy.join(' '));
        else input.removeAttribute('aria-describedby');
      }
    }

    function validate() {
      var firstInvalid = null;
      ['name', 'email'].forEach(function (name) {
        var input = field(name);
        var valid = input.value.trim() !== '' && input.validity.valid;
        setFieldError(input, !valid);
        if (!valid && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    }
    form.addEventListener('input', function (event) {
      if (event.target.getAttribute('aria-invalid') === 'true') setFieldError(event.target, false);
    });

    function optionLabel(select) { return select && select.value ? select.options[select.selectedIndex].text : '—'; }
    function mailto() {
      var data = new FormData(form);
      var subject = 'Novex Exterior — ' + (field('topic').value === 'trade' ? 'Trade project request' : 'Project request') + ' from ' + field('name').value.trim();
      var lines = [
        'Name: ' + data.get('name'), 'Company: ' + (data.get('company') || '—'),
        'Email: ' + data.get('email'), 'Phone: ' + (data.get('phone') || '—'),
        'I am a: ' + optionLabel(field('type')), 'Looking for: ' + optionLabel(field('topic')),
        'Products: ' + (data.getAll('products').join(', ') || '—'),
        'Project location: ' + (data.get('location') || '—'), 'Timeline: ' + optionLabel(field('timeline')),
        '', 'Project details:', data.get('message') || '—'
      ];
      return 'mailto:hello@novexexterior.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    }

    function showStatus(heading, message, draftLink) {
      if (!status || !status.matches('.form-success')) return;
      var headingElement = status.querySelector('h3');
      var messageElement = status.querySelector('[data-success-text]');
      if (headingElement) headingElement.textContent = heading;
      if (messageElement) {
        messageElement.textContent = message;
        if (draftLink) {
          var link = doc.createElement('a');
          link.href = mailto();
          link.textContent = ' Open email draft';
          link.style.textDecoration = 'underline';
          messageElement.appendChild(link);
        }
      }
      status.hidden = false;
      status.style.display = 'block';
      status.focus();
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!validate()) return;
      if (!endpoint) {
        showStatus('Email draft ready', 'Your email app should open with your request ready to review. Press Send in that app to submit it. If it does not open, use this link.', true);
        window.location.href = mailto();
        return;
      }
      if (submitButton) { submitButton.disabled = true; labelSubmit('Sending…'); }
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          form.classList.add('is-sent');
          showStatus('Request received', 'Thank you. Our team will review your project and get in touch.');
        })
        .catch(function () {
          showStatus('Please try again', 'We could not submit your request. Your details are still here; try again or send an email draft.', true);
        })
        .finally(function () {
          if (submitButton) { submitButton.disabled = false; labelSubmit('Send request'); }
        });
    });
  }
})();
