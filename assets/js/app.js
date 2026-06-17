import { loadState, updatePreferences } from './storage.js?v=14';
import { initTooltips, notify, refreshIcons } from './ui.js?v=13';

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
};

initLanding();
