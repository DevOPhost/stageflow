import {
  clearState,
  loadState,
  resetState,
  updatePreferences,
  updateProfile
} from '../storage.js?v=16';
import {
  $,
  confirmAction,
  fillForm,
  initLayout,
  notify,
  readForm,
  refreshIcons
} from '../ui.js?v=16';

const profileForm = $('#profileForm');
const preferencesForm = $('#preferencesForm');

const renderProjectFacts = (state) => {
  $('#projectFacts').innerHTML = `
    <div class="project-fact"><span>Nome do sistema</span><strong>${state.project.name}</strong></div>
    <div class="project-fact"><span>Tipo</span><strong>${state.project.type}</strong></div>
    <div class="project-fact"><span>Instituição</span><strong>${state.project.institution}</strong></div>
    <div class="project-fact"><span>Curso</span><strong>${state.project.course}</strong></div>
    <div class="project-fact"><span>Finalidade</span><strong>${state.project.purpose}</strong></div>
    <div class="project-fact"><span>Status</span><strong>${state.project.status}</strong></div>
  `;

  $('#githubLink').href = state.project.githubUrl;
};

const renderForms = () => {
  const state = loadState();
  renderProjectFacts(state);

  fillForm(profileForm, {
    ...state.profile,
    goalHours: state.profile.goalHours
  });

  fillForm(preferencesForm, state.preferences);
  preferencesForm.elements.animations.checked = state.preferences.animations !== false;
  preferencesForm.elements.notifications.checked = Boolean(state.preferences.notifications);
};

profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readForm(profileForm);

  updateProfile({
    name: data.name.trim(),
    role: data.role.trim(),
    email: data.email.trim(),
    institution: data.institution.trim(),
    goalHours: Number(data.goalHours)
  });

  notify('Perfil do projeto atualizado.');
});

preferencesForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readForm(preferencesForm);

  updatePreferences({
    weekGoal: Number(data.weekGoal),
    density: data.density,
    cardView: data.cardView,
    animations: preferencesForm.elements.animations.checked,
    notifications: preferencesForm.elements.notifications.checked
  });

  notify('Preferências visuais salvas.');
});

$('#resetDataButton').addEventListener('click', async () => {
  const confirmed = await confirmAction({
    title: 'Restaurar registros acadêmicos iniciais',
    message: 'Todos os cadastros e lançamentos locais serão substituídos pela base de apresentação inicial do StageFlow.',
    confirmText: 'Restaurar base',
    danger: true
  });

  if (!confirmed) return;

  resetState();
  renderForms();
  notify('Base de apresentação restaurada com sucesso.');
});

$('#clearDataButton').addEventListener('click', async () => {
  const confirmed = await confirmAction({
    title: 'Limpar registros locais',
    message: 'As alterações salvas neste navegador serão removidas. A base de apresentação será recriada na próxima abertura.',
    confirmText: 'Limpar',
    danger: true
  });

  if (!confirmed) return;

  clearState();
  notify('Registros locais limpos. Recarregando a versão pública.', 'info');
  setTimeout(() => window.location.reload(), 900);
});

initLayout('configuracoes');
renderForms();
refreshIcons();
