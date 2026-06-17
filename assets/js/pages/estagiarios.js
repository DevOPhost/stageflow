import {
  createRecord,
  deleteRecord,
  getCollection,
  updateRecord
} from '../storage.js?v=14';
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
  sortByField,
  statusClass
} from '../ui.js?v=13';

const tableWrap = $('#studentsTableWrap');
const form = $('#studentForm');
const modal = createModal($('#studentModal'));

let query = '';
let statusFilter = '';
let sortField = 'nome';

const getFilteredStudents = () => {
  let students = getCollection('estagiarios');
  students = filterByQuery(students, query, ['nome', 'matricula', 'curso', 'email', 'telefone']);

  if (statusFilter) {
    students = students.filter((student) => student.status === statusFilter);
  }

  return sortByField(students, sortField);
};

const renderStudents = () => {
  const students = getFilteredStudents();

  if (!students.length) {
    renderEmptyState(tableWrap, {
      title: 'Nenhum estagiário localizado',
      text: 'Revise a pesquisa ou cadastre um estudante para iniciar o acompanhamento.',
      icon: 'graduation-cap'
    });
    return;
  }

  tableWrap.innerHTML = `
    <table class="table table-hover align-middle">
      <thead>
        <tr>
          <th>Estagiário</th>
          <th>Curso</th>
          <th>Contato</th>
          <th>Status</th>
          <th class="text-end">Ações</th>
        </tr>
      </thead>
      <tbody>
        ${students.map((student) => `
          <tr>
            <td>
              <div class="entity-title">
                <strong>${escapeHtml(student.nome)}</strong>
                <small>Matrícula ${escapeHtml(student.matricula)}</small>
              </div>
            </td>
            <td>${escapeHtml(student.curso)}</td>
            <td>
              <div class="entity-title">
                <span>${escapeHtml(student.email)}</span>
                <small>${escapeHtml(student.telefone)}</small>
              </div>
            </td>
            <td><span class="status-pill ${statusClass(student.status)}">${escapeHtml(student.status)}</span></td>
            <td>
              <div class="table-actions">
                <button class="icon-button" type="button" data-action="edit" data-id="${student.id}" data-bs-toggle="tooltip" title="Editar">
                  <i data-lucide="pencil"></i>
                </button>
                <button class="icon-button danger" type="button" data-action="delete" data-id="${student.id}" data-bs-toggle="tooltip" title="Excluir">
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
  $('#studentModalTitle').textContent = 'Novo estagiário';
  modal.show();
};

const openEditModal = (id) => {
  const student = getCollection('estagiarios').find((item) => item.id === id);
  if (!student) return;

  form.reset();
  fillForm(form, student);
  $('#studentModalTitle').textContent = 'Editar estagiário';
  modal.show();
};

const deleteStudent = async (id) => {
  const student = getCollection('estagiarios').find((item) => item.id === id);
  const confirmed = await confirmAction({
    title: 'Excluir estagiário',
    message: `Remover ${student?.nome ?? 'este estagiário'} do cadastro? As atividades lançadas continuarão preservadas.`,
    confirmText: 'Excluir',
    danger: true
  });

  if (!confirmed) return;

  deleteRecord('estagiarios', id);
  notify('Estagiário removido do cadastro.', 'success');
  renderStudents();
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readForm(form);
  const payload = {
    nome: data.nome.trim(),
    matricula: data.matricula.trim(),
    curso: data.curso.trim(),
    email: data.email.trim(),
    telefone: data.telefone.trim(),
    status: data.status
  };

  if (data.id) {
    updateRecord('estagiarios', data.id, payload);
    notify('Cadastro do estagiário atualizado.');
  } else {
    createRecord('estagiarios', payload, 'est');
    notify('Estagiário cadastrado.');
  }

  modal.hide();
  renderStudents();
});

tableWrap.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === 'edit') openEditModal(id);
  if (action === 'delete') deleteStudent(id);
});

$('#newStudentButton').addEventListener('click', openCreateModal);
$('#studentSearch').addEventListener('input', debounce((event) => {
  query = event.target.value;
  renderStudents();
}));
$('#studentStatusFilter').addEventListener('change', (event) => {
  statusFilter = event.target.value;
  renderStudents();
});
$('#studentSort').addEventListener('change', (event) => {
  sortField = event.target.value;
  renderStudents();
});

initLayout('estagiarios');
renderStudents();
