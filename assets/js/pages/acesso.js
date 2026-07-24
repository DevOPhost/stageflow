import { loadState, saveDemoSession, updatePreferences } from '../storage.js?v=16';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

let mode = 'login';
let role = 'Coordenação';

const applyTheme = (theme) => {
  const safeTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = safeTheme;
  document.documentElement.dataset.bsTheme = safeTheme;
  localStorage.setItem('stageflow.theme', safeTheme);
};

const refreshIcons = () => {
  window.lucide?.createIcons({ attrs: { 'stroke-width': 1.8 } });
};

const setMode = (nextMode) => {
  mode = nextMode;
  $$('[data-auth-mode]').forEach((button) => {
    const active = button.dataset.authMode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });

  $('[data-register-field]').classList.toggle('d-none', mode !== 'register');
  $('[data-submit-label]').textContent = mode === 'register'
    ? 'Criar acesso demonstrativo'
    : 'Entrar na demonstração';
  $('#authTitle').textContent = mode === 'register'
    ? 'Criar acesso demonstrativo'
    : 'Acessar demonstração';
  $('.auth-status').textContent = '';
  $$('[data-error-for]').forEach((element) => { element.textContent = ''; });
};

const setRole = (nextRole) => {
  role = nextRole;
  $$('[data-role]').forEach((button) => {
    const active = button.dataset.role === role;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
};

const showError = (field, message) => {
  const input = $(`[name="${field}"]`);
  const error = $(`[data-error-for="${field}"]`);
  input?.setAttribute('aria-invalid', 'true');
  if (error) error.textContent = message;
};

const clearErrors = () => {
  $$('[aria-invalid="true"]').forEach((input) => input.removeAttribute('aria-invalid'));
  $$('[data-error-for]').forEach((element) => { element.textContent = ''; });
};

const enterDemo = ({ name, email, selectedRole = role }) => {
  saveDemoSession({ name, email, role: selectedRole });
  const status = $('.auth-status');
  status.textContent = `Perfil de ${selectedRole.toLowerCase()} preparado. Abrindo o painel…`;
  $('.auth-card').classList.add('is-complete');
  setTimeout(() => {
    document.body.classList.add('page-leaving');
    window.location.href = './dashboard.html?v=8';
  }, 520);
};

$('#authForm').addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  const data = Object.fromEntries(new FormData(event.currentTarget).entries());
  const email = String(data.email || '').trim();
  const password = String(data.password || '');
  const name = String(data.name || '').trim();
  let valid = true;

  if (mode === 'register' && name.length < 3) {
    showError('name', 'Informe um nome com pelo menos 3 caracteres.');
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Informe um e-mail válido.');
    valid = false;
  }
  if (password.length < 6) {
    showError('password', 'Use pelo menos 6 caracteres nesta demonstração.');
    valid = false;
  }
  if (!valid) {
    $('.auth-status').textContent = 'Revise os campos destacados para continuar.';
    $('[aria-invalid="true"]')?.focus();
    return;
  }

  const fallbackName = email.split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');

  enterDemo({ name: name || fallbackName || 'Visitante', email });
});

$$('[data-auth-mode]').forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.authMode));
});

$$('[data-role]').forEach((button) => {
  button.addEventListener('click', () => setRole(button.dataset.role));
});

$('[data-password-toggle]').addEventListener('click', (event) => {
  const input = $('#authPassword');
  const showing = input.type === 'text';
  input.type = showing ? 'password' : 'text';
  event.currentTarget.setAttribute('aria-label', showing ? 'Mostrar senha' : 'Ocultar senha');
  event.currentTarget.innerHTML = `<i data-lucide="${showing ? 'eye' : 'eye-off'}"></i>`;
  refreshIcons();
});

$$('[data-quick-role]').forEach((button) => {
  button.addEventListener('click', () => {
    const selectedRole = button.dataset.quickRole;
    enterDemo({
      name: selectedRole === 'Coordenação' ? 'Coordenação StageFlow' : 'Estudante visitante',
      email: selectedRole === 'Coordenação' ? 'coordenacao@demo.stageflow' : 'estudante@demo.stageflow',
      selectedRole
    });
  });
});

$('[data-theme-toggle]').addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  updatePreferences({ theme: nextTheme });
});

$$('a[data-smooth-nav]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add('page-leaving');
    setTimeout(() => { window.location.href = link.href; }, 180);
  });
});

applyTheme(localStorage.getItem('stageflow.theme') || loadState().preferences.theme);
refreshIcons();
requestAnimationFrame(() => document.body.classList.add('page-ready'));
