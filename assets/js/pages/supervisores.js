import {
  createRecord,
  deleteRecord,
  getCollection,
  updateRecord
} from '../storage.js?v=16';
import {
  $,
  confirmAction,
  createModal,
  debounce,
  escapeHtml,
  fillForm,
  filterByQuery,
  initLayout,
  initTooltips,
  notify,
  readForm,
  refreshIcons,
  renderEmptyState,
  sortByField
} from '../ui.js?v=16';

const tableWrap = $('#supervisorsTableWrap');
const form = $('#supervisorForm');
const modal = createModal($('#supervisorModal'));

let query = '';
let sortField = 'nome';

const getFilteredSupervisors = () => {
  const supervisors = filterByQuery(getCollection('supervisores'), query, ['nome', 'cargo', 'empresa', 'email', 'telefone']);
  return sortByField(supervisors, sortField);
};

const renderSupervisors = () => {
  const supervisors = getFilteredSupervisors();

  if (!supervisors.length) {
    renderEmptyState(tableWrap, {
      title: 'Nenhum supervisor localizado',
      text: 'Ajuste a busca ou registre um novo contato de acompanhamento.',
      icon: 'briefcase-business'
    });
    return;
  }

  tableWrap.innerHTML = `
    <table class="table table-hover align-middle">
      <thead>
        <tr>
          <th>Supervisor</th>
          <th>Cargo</th>
          <th>Empresa</th>
          <th>Contato</th>
          <th class="text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        ${supervisors.map((supervisor) => `
          <tr>
            <td>
              <div class="entity-title">
                <strong>${escapeHtml(supervisor.nome)}</strong>
                <small>${escapeHtml(supervisor.email)}</small>
              </div>
            </td>
            <td>${escapeHtml(supervisor.cargo)}</td>
            <td>${escapeHtml(supervisor.empresa)}</td>
            <td>${escapeHtml(supervisor.telefone)}</td>
            <td>
              <div class="table-actions">
                <button class="icon-button" type="button" data-action="edit" data-id="${supervisor.id}" data-bs-toggle="tooltip" title="Editar">
                  <i data-lucide="pencil"></i>
                </button>
                <button class="icon-button danger" type="button" data-action="delete" data-id="${supervisor.id}" data-bs-toggle="tooltip" title="Excluir">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  refreshIcons();
  initTooltips();
};

const openCreateModal = () => {
  form.reset();
  form.elements.id.value = '';
  $('#supervisorModalTitle').textContent = 'Novo supervisor';
  modal.show();
};

const openEditModal = (id) => {
  const supervisor = getCollection('supervisores').find((item) => item.id === id);
  if (!supervisor) return;

  form.reset();
  fillForm(form, supervisor);
  $('#supervisorModalTitle').textContent = 'Editar supervisor';
  modal.show();
};

const deleteSupervisor = async (id) => {
  const supervisor = getCollection('supervisores').find((item) => item.id === id);
  const confirmed = await confirmAction({
    title: 'Excluir supervisor',
    message: `Remover ${supervisor?.nome ?? 'este supervisor'} da base de acompanhamento?`,
    confirmText: 'Excluir',
    danger: true
  });

  if (!confirmed) return;

  deleteRecord('supervisores', id);
  notify('Supervisor removido.');
  renderSupervisors();
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readForm(form);
  const payload = {
    nome: data.nome.trim(),
    cargo: data.cargo.trim(),
    email: data.email.trim(),
    empresa: data.empresa.trim(),
    telefone: data.telefone.trim()
  };

  if (data.id) {
    updateRecord('supervisores', data.id, payload);
    notify('Supervisor atualizado.');
  } else {
    createRecord('supervisores', payload, 'sup');
    notify('Supervisor cadastrado.');
  }

  modal.hide();
  renderSupervisors();
});

tableWrap.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === 'edit') openEditModal(id);
  if (action === 'delete') deleteSupervisor(id);
});

$('#newSupervisorButton').addEventListener('click', openCreateModal);
$('#supervisorSearch').addEventListener('input', debounce((event) => {
  query = event.target.value;
  renderSupervisors();
}));
$('#supervisorSort').addEventListener('change', (event) => {
  sortField = event.target.value;
  renderSupervisors();
});

initLayout('supervisores');
renderSupervisors();
