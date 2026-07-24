import {
  clearDemoSession,
  loadState,
  readDemoSession,
  updatePreferences
} from './storage.js?v=16';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard', file: 'dashboard.html', icon: 'layout-dashboard' },
  { key: 'estagiarios', label: 'Estagiários', file: 'estagiarios.html', icon: 'graduation-cap' },
  { key: 'supervisores', label: 'Supervisores', file: 'supervisores.html', icon: 'briefcase-business' },
  { key: 'atividades', label: 'Atividades', file: 'atividades.html', icon: 'clipboard-list' },
  { key: 'frequencia', label: 'Frequência', file: 'frequencia.html', icon: 'calendar-check' },
  { key: 'relatorios', label: 'Relatórios', file: 'relatorios.html', icon: 'file-text' },
  { key: 'configuracoes', label: 'Configurações', file: 'configuracoes.html', icon: 'settings' }
];

export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

export const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export const formatHours = (value) => {
  const number = Number(value || 0);
  return `${number.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}h`;
};

export const formatDate = (value) => {
  if (!value) return '-';
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR').format(new Date(year, month - 1, day));
};

export const formatShortDate = (value) => {
  if (!value) return '-';
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
    .format(new Date(year, month - 1, day))
    .replace('.', '');
};

export const normalizeText = (value = '') => (
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
);

export const debounce = (callback, delay = 180) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};

export const readForm = (form) => Object.fromEntries(new FormData(form).entries());

export const fillForm = (form, values = {}) => {
  Object.entries(values).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value ?? '';
  });
};

export const statusClass = (status = '') => {
  const normalized = normalizeText(status);
  if (normalized.includes('ativo') || normalized.includes('presente') || normalized.includes('acompanhamento')) return 'success';
  if (normalized.includes('pendente')) return 'warning';
  if (normalized.includes('concluido') || normalized.includes('finalizado') || normalized.includes('agendado')) return 'info';
  if (normalized.includes('ausente')) return 'danger';
  return 'neutral';
};

const initialsFrom = (name = 'StageFlow') => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase();

const applyTheme = (theme) => {
  const safeTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = safeTheme;
  document.documentElement.dataset.bsTheme = safeTheme;
  localStorage.setItem('stageflow.theme', safeTheme);
};

const applyPreferences = () => {
  const { preferences } = loadState();
  document.documentElement.dataset.density = preferences.density === 'compact' ? 'compact' : 'comfortable';
  document.documentElement.dataset.motion = preferences.animations === false ? 'reduced' : 'standard';
  document.documentElement.dataset.cardView = preferences.cardView === 'compacta' ? 'compacta' : 'analitica';
};

const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem('stageflow.theme') || loadState().preferences.theme;
  return storedTheme === 'light' ? 'light' : 'dark';
};

const getRouteContext = () => {
  const inPages = window.location.pathname.replaceAll('\\', '/').includes('/pages/');
  return {
    assetRoot: inPages ? '../assets' : './assets',
    homeHref: inPages ? '../index.html?v=7' : './index.html?v=7',
    pageHref: (file) => (inPages ? `./${file}?v=7` : `./pages/${file}?v=7`)
  };
};

const renderSidebar = (activePage) => {
  const sidebar = $('#sidebar');
  if (!sidebar) return;
  const routes = getRouteContext();

  sidebar.innerHTML = `
    <a class="brand" href="${routes.homeHref}" aria-label="StageFlow">
      <span class="brand-mark">
        <img src="${routes.assetRoot}/images/logo-stageflow.svg?v=14" alt="" width="28" height="28">
      </span>
      <span>
        <strong>StageFlow</strong>
        <small>Versão acadêmica</small>
      </span>
    </a>
    <nav class="sidebar-nav" aria-label="Principal">
      ${menuItems.map((item) => `
        <a class="sidebar-link ${item.key === activePage ? 'active' : ''}" href="${routes.pageHref(item.file)}">
          <i data-lucide="${item.icon}" aria-hidden="true"></i>
          <span>${item.label}</span>
        </a>
      `).join('')}
    </nav>
    <div class="sidebar-status">
      <span class="signal-dot"></span>
      <span>
        <strong data-session-role>Base de apresentação</strong>
        <small>Dados fictícios neste navegador</small>
      </span>
    </div>
    <button class="sidebar-exit" type="button" data-demo-logout>
      <i data-lucide="log-out" aria-hidden="true"></i>
      <span>Sair da demonstração</span>
    </button>
  `;
};

const renderDemoContext = () => {
  const main = $('.main-content');
  const topbar = $('.topbar');
  if (!main || !topbar || $('#demoNotice')) return;

  const state = loadState();
  const routes = getRouteContext();
  const notice = document.createElement('aside');
  notice.id = 'demoNotice';
  notice.className = 'demo-notice';
  notice.innerHTML = `
    <img src="${routes.assetRoot}/images/logo-unic-mark.png?v=1" alt="UNIC" width="64" height="76">
    <div>
      <strong>Projeto de inovação acadêmica</strong>
      <p>${escapeHtml(state.project.presentationNotice)}</p>
    </div>
  `;

  const footer = document.createElement('footer');
  footer.className = 'academic-footer';
  footer.innerHTML = `
    <span>Proposta acadêmica desenvolvida no contexto da UNIC</span>
    <span>Ambiente público de apresentação do projeto.</span>
  `;

  topbar.insertAdjacentElement('afterend', notice);
  main.appendChild(footer);
};

export const refreshIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  }
};

export const initTooltips = () => {
  if (!window.bootstrap) return;

  $$('[data-bs-toggle="tooltip"]').forEach((element) => {
    const existing = window.bootstrap.Tooltip.getInstance(element);
    if (!existing) {
      new window.bootstrap.Tooltip(element, { trigger: 'hover focus' });
    }
  });
};

export const createModal = (element) => {
  if (window.bootstrap?.Modal && element) {
    return window.bootstrap.Modal.getOrCreateInstance(element);
  }

  return {
    show() {
      if (!element) return;
      element.classList.add('show');
      element.removeAttribute('aria-hidden');
      element.style.display = 'block';
      document.body.classList.add('modal-open');
    },
    hide() {
      if (!element) return;
      element.classList.remove('show');
      element.setAttribute('aria-hidden', 'true');
      element.style.display = 'none';
      document.body.classList.remove('modal-open');
      element.dispatchEvent(new Event('hidden.bs.modal'));
    }
  };
};

const syncTopbarProfile = () => {
  const state = loadState();
  const session = readDemoSession();
  const profile = session || state.profile;
  const userName = $('#topbarUserName');
  const userRole = $('#topbarUserRole');
  const avatar = $('#topbarAvatar');
  const sessionRole = $('[data-session-role]');

  if (userName) userName.textContent = profile.name;
  if (userRole) userRole.textContent = session ? `${profile.role} · demonstração` : state.profile.role;
  if (avatar) avatar.textContent = initialsFrom(profile.name);
  if (sessionRole) sessionRole.textContent = session ? `Sessão: ${profile.role}` : 'Acesso público';
};

const setupDemoLogout = () => {
  $('[data-demo-logout]')?.addEventListener('click', () => {
    clearDemoSession();
    document.body.classList.add('page-leaving');
    setTimeout(() => {
      window.location.href = './acesso.html';
    }, 180);
  });
};

const setupPageTransitions = () => {
  $$('a.sidebar-link, a.brand, a[data-smooth-nav]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
        || link.target === '_blank'
      ) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

      event.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(() => {
        window.location.href = url.href;
      }, 180);
    });
  });
};

const setupRevealAnimations = () => {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    || document.documentElement.dataset.motion === 'reduced';
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px' });

  const observe = () => {
    $$('.surface-card, .toolbar, .data-panel, .chart-panel, .demo-notice').forEach((element, index) => {
      if (element.dataset.revealReady) return;
      element.dataset.revealReady = 'true';
      element.classList.add('reveal-item');
      element.style.setProperty('--reveal-delay', `${Math.min(index * 35, 210)}ms`);
      observer.observe(element);
    });
  };

  observe();
  setTimeout(observe, 360);
};

const setupSidebarToggle = () => {
  const backdrop = $('#sidebarBackdrop');

  $$('[data-sidebar-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
    });
  });

  backdrop?.addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
  });
};

const setupThemeToggle = () => {
  $$('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      updatePreferences({ theme: nextTheme });
      window.dispatchEvent(new CustomEvent('stageflow:themechange', { detail: nextTheme }));
      notify(`Tema ${nextTheme === 'dark' ? 'escuro' : 'claro'} aplicado.`, 'success');
    });
  });
};

export const initLayout = (activePage = document.body.dataset.page) => {
  applyTheme(getPreferredTheme());
  applyPreferences();
  renderSidebar(activePage);
  renderDemoContext();
  syncTopbarProfile();
  setupSidebarToggle();
  setupThemeToggle();
  setupDemoLogout();
  setupPageTransitions();
  setupRevealAnimations();
  refreshIcons();
  initTooltips();

  requestAnimationFrame(() => {
    document.body.classList.add('page-ready');
  });

  window.addEventListener('stageflow:datachange', () => {
    applyPreferences();
    syncTopbarProfile();
  });

  window.addEventListener('stageflow:sessionchange', syncTopbarProfile);
};

export const notify = (message, type = 'success') => {
  const root = $('#toastRoot');
  if (!root) return;

  try {
    if (loadState().preferences.notifications === false && type !== 'danger') return;
  } catch {
    // The landing page may initialize before the browser storage is ready.
  }

  const toast = document.createElement('div');
  toast.className = `app-toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span class="toast-indicator"></span>
    <span>${escapeHtml(message)}</span>
    <button class="toast-close" type="button" aria-label="Fechar">
      <i data-lucide="x"></i>
    </button>
  `;

  root.appendChild(toast);
  refreshIcons();

  const close = () => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 220);
  };

  toast.querySelector('button').addEventListener('click', close);
  setTimeout(close, 4200);
};

export const confirmAction = ({
  title = 'Confirmar ação',
  message = 'Deseja continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  danger = false
} = {}) => new Promise((resolve) => {
  const modal = $('#confirmModal');
  if (!modal || !window.bootstrap) {
    resolve(window.confirm(message));
    return;
  }

  $('#confirmModalTitle').textContent = title;
  $('#confirmModalMessage').textContent = message;
  const button = $('#confirmModalConfirm');
  const cancel = $('#confirmModalCancel');
  button.textContent = confirmText;
  cancel.textContent = cancelText;
  button.className = `btn ${danger ? 'btn-danger' : 'btn-primary'} px-4`;

  const instance = window.bootstrap.Modal.getOrCreateInstance(modal);

  const cleanup = () => {
    button.removeEventListener('click', onConfirm);
    modal.removeEventListener('hidden.bs.modal', onHidden);
  };

  const onConfirm = () => {
    cleanup();
    instance.hide();
    resolve(true);
  };

  const onHidden = () => {
    cleanup();
    resolve(false);
  };

  button.addEventListener('click', onConfirm, { once: true });
  modal.addEventListener('hidden.bs.modal', onHidden, { once: true });
  instance.show();
});

export const renderEmptyState = (target, {
  title = 'Nenhum registro encontrado',
  text = 'Ajuste os filtros ou cadastre um novo item.',
  icon = 'search'
} = {}) => {
  target.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon"><i data-lucide="${icon}"></i></div>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
  refreshIcons();
};

export const filterByQuery = (items, query, fields) => {
  const needle = normalizeText(query);
  if (!needle) return items;

  return items.filter((item) => (
    fields.some((field) => normalizeText(item[field]).includes(needle))
  ));
};

export const sortByField = (items, field, direction = 'asc') => {
  const sorted = [...items].sort((a, b) => (
    String(a[field] ?? '').localeCompare(String(b[field] ?? ''), 'pt-BR', { numeric: true })
  ));

  return direction === 'desc' ? sorted.reverse() : sorted;
};
