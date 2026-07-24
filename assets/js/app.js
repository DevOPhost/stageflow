import { loadState, updatePreferences } from './storage.js?v=16';
import { initTooltips, notify, refreshIcons } from './ui.js?v=16';

const applyTheme = (theme) => {
  const safeTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = safeTheme;
  document.documentElement.dataset.bsTheme = safeTheme;
  localStorage.setItem('stageflow.theme', safeTheme);
};

const initLanding = () => {
  const state = loadState();
  applyTheme(localStorage.getItem('stageflow.theme') || state.preferences.theme);

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      updatePreferences({ theme: nextTheme });
      notify(`Tema ${nextTheme === 'dark' ? 'escuro' : 'claro'} aplicado.`);
    });
  });

  refreshIcons();
  initTooltips();

  requestAnimationFrame(() => {
    document.body.classList.add('page-ready');
  });

  document.querySelectorAll('a[data-smooth-nav]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(() => {
        window.location.href = link.href;
      }, 180);
    });
  });
};

initLanding();
