(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var storageKey = 'vision2030-theme';
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function readStoredTheme() {
    try {
      var stored = localStorage.getItem(storageKey);
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch (error) {
      return null;
    }
  }

  function systemTheme() {
    return darkQuery && darkQuery.matches ? 'dark' : 'light';
  }

  function activeTheme() {
    return root.dataset.theme || systemTheme();
  }

  function updateToggle(theme) {
    var isDark = theme === 'dark';
    var nextLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', nextLabel);
    toggle.setAttribute('title', nextLabel);
    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#071f18' : '#0b3b2e');
    }
  }

  function applyTheme(theme, shouldSave) {
    root.dataset.theme = theme;
    updateToggle(theme);

    if (shouldSave) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        // A storage restriction should never interrupt the theme switch.
      }
    }
  }

  if (!toggle) {
    return;
  }

  updateToggle(activeTheme());

  toggle.addEventListener('click', function () {
    applyTheme(activeTheme() === 'dark' ? 'light' : 'dark', true);
  });

  if (darkQuery) {
    var followSystem = function () {
      if (!readStoredTheme()) {
        updateToggle(systemTheme());
      }
    };

    if (typeof darkQuery.addEventListener === 'function') {
      darkQuery.addEventListener('change', followSystem);
    } else if (typeof darkQuery.addListener === 'function') {
      darkQuery.addListener(followSystem);
    }
  }
}());
