import {
  createRecord,
  deleteRecord,
  getAtividadesComEstagiario,
  getCollection,
  getEstagiarioNome,
  loadState,
  updateRecord
} from '../storage.js?v=14';
import {
  $,
  confirmAction,
  createModal,
  debounce,
  escapeHtml,
  fillForm,
  formatDate,
  formatHours,
  formatShortDate,
  initLayout,
  initTooltips,
  normalizeText,
  notify,
  readForm,
  refreshIcons,
  renderEmptyState
} from '../ui.js?v=13';

const timeline = $('#activityTimeline');
const form = $('#activityForm');
const modal = createModal($('#activityModal'));

let query = '';
let studentFilter = '';
let typeFilter = '';
let monthFilter = '';

const populateStudents = () => {
  const students = getCollection('estagiarios');
  const options = students.map((student) => `
    <option value="${student.id}">${escapeHtml(student.nome)}</option>
  `).join('');

  $('#activityStudent').innerHTML = options;
  $('#activityStudentFilter').innerHTML = `
    <option value="">Todos os estagiários</option>
    ${options}
  `;
};

const getFilteredActivities = () => {
  let activities = getAtividadesComEstagiario(loadState());
  const needle = normalizeText(query);

  if (needle) {
    activities = activities.filter((activity) => (
      normalizeText(activity.descricao).includes(needle)
      || normalizeText(activity.estagiario).includes(needle)
    ));
  }

  if (studentFilter) {
    activities = activities.filter((activity) => activity.estagiarioId === studentFilter);
  }

  if (typeFilter) {
    activities = activities.filter((activity) => activity.tipo === typeFilter);
  }

  if (monthFilter) {
    activities = activities.filter((activity) => activity.data.startsWith(monthFilter));
  }

  return activities.sort((a, b) => `${b.data} ${b.horario}`.localeCompare(`${a.data} ${a.horario}`));
};

const renderActivities = () => {
  const activities = getFilteredActivities();

  if (!activities.length) {
    renderEmptyState(timeline, {
      title: 'Nenhuma atividade encontrada',
      text: 'Os registros aparecem aqui conforme os estudantes lançam suas entregas.',
      icon: 'clipboard-list'
    });
    return;
  }

  timeline.innerHTML = activities.map((activity) => {
    const [day, month] = formatShortDate(activity.data).split(' ');

    return `
      <article class="timeline-item">
        <time class="timeline-date" datetime="${activity.data}">
          <strong>${day}</strong>
          <span>${month}</span>
        </time>
        <div class="timeline-body">
          <div class="d-flex align-items-start justify-content-between gap-3">
            <h3>${escapeHtml(activity.descricao)}</h3>
            <div class="table-actions">
              <button class="icon-button" type="button" data-action="edit" data-id="${activity.id}" data-bs-toggle="tooltip" title="Editar">
                <i data-lucide="pencil"></i>
              </button>
              <button class="icon-button danger" type="button" data-action="delete" data-id="${activity.id}" data-bs-toggle="tooltip" title="Excluir">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>
          <div class="timeline-meta">
            <span class="chip"><i data-lucide="user"></i>${escapeHtml(activity.estagiario)}</span>
            <span class="chip"><i data-lucide="tag"></i>${escapeHtml(activity.tipo ?? 'Atividade')}</span>
            <span class="chip"><i data-lucide="clock"></i>${escapeHtml(activity.horario)}</span>
            <span class="chip"><i data-lucide="timer"></i>${formatHours(activity.horas)}</span>
            <span class="chip"><i data-lucide="calendar"></i>${formatDate(activity.data)}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  refreshIcons();
  initTooltips();
};

const openCreateModal = () => {
  form.reset();
  form.elements.id.value = '';
  form.elements.data.valueAsDate = new Date();
  form.elements.horario.value = '08:00';
  form.elements.horas.value = 4;
  form.elements.tipo.value = 'Frontend';
  $('#activityModalTitle').textContent = 'Registrar atividade';
  modal.show();
};

const openEditModal = (id) => {
  const activity = getCollection('atividades').find((item) => item.id === id);
  if (!activity) return;

  form.reset();
  fillForm(form, activity);
  $('#activityModalTitle').textContent = 'Editar atividade';
  modal.show();
};

const deleteActivity = async (id) => {
  const activity = getCollection('atividades').find((item) => item.id === id);
  const confirmed = await confirmAction({
    title: 'Excluir atividade',
    message: `Remover o registro de ${getEstagiarioNome(activity?.estagiarioId)} em ${formatDate(activity?.data)}?`,
    confirmText: 'Excluir',
    danger: true
  });

  if (!confirmed) return;

  deleteRecord('atividades', id);
  notify('Atividade excluída.');
  renderActivities();
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readForm(form);
  const payload = {
    data: data.data,
    horario: data.horario,
    tipo: data.tipo,
    descricao: data.descricao.trim(),
    estagiarioId: data.estagiarioId,
    horas: Number(data.horas)
  };

  if (data.id) {
    updateRecord('atividades', data.id, payload);
    notify('Atividade atualizada.');
  } else {
    createRecord('atividades', payload, 'ati');
    notify('Atividade registrada.');
  }

  modal.hide();
  renderActivities();
});

timeline.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === 'edit') openEditModal(id);
  if (action === 'delete') deleteActivity(id);
});

$('#newActivityButton').addEventListener('click', openCreateModal);
$('#activitySearch').addEventListener('input', debounce((event) => {
  query = event.target.value;
  renderActivities();
}));
$('#activityStudentFilter').addEventListener('change', (event) => {
  studentFilter = event.target.value;
  renderActivities();
});
$('#activityTypeFilter').addEventListener('change', (event) => {
  typeFilter = event.target.value;
  renderActivities();
});
$('#activityDateFilter').addEventListener('change', (event) => {
  monthFilter = event.target.value;
  renderActivities();
});

initLayout('atividades');
populateStudents();
renderActivities();
