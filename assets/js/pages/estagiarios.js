import {
  createRecord,
  deleteRecord,
  getCollection,
  updateRecord
} from '../storage.js?v=16';
import { validateStudentInput } from '../studentValidation.js?v=16';
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
} from '../ui.js?v=16';

const tableWrap = $('#studentsTableWrap');
const form = $('#studentForm');
const modal = createModal($('#studentModal'));
const submitButton = $('#studentSubmitButton');
const submitButtonLabel = submitButton.textContent;

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

const clearValidity = () => {
  [...form.elements].forEach((field) => field.setCustomValidity?.(''));
};

const applyValidationErrors = (errors) => {
  clearValidity();

  Object.entries(errors).forEach(([fieldName, message]) => {
    form.elements[fieldName]?.setCustomValidity(message);
  });
};

const setSaving = (isSaving) => {
  form.setAttribute('aria-busy', String(isSaving));
  submitButton.disabled = isSaving;
  submitButton.textContent = isSaving ? 'Salvando...' : submitButtonLabel;
};

const renderStudents = () => {
  let students;

  try {
    students = getFilteredStudents();
  } catch (error) {
    console.error('StageFlow: não foi possível carregar os estagiários.', error);
    renderEmptyState(tableWrap, {
      title: 'Não foi possível carregar os cadastros',
      text: 'Verifique se o armazenamento local está disponível e recarregue a página.',
      icon: 'triangle-alert'
    });
    tableWrap.setAttribute('aria-busy', 'false');
    notify('Erro ao carregar os cadastros de estagiários.', 'danger');
    return;
  }

  if (!students.length) {
    renderEmptyState(tableWrap, {
      title: 'Nenhum estagiário localizado',
      text: 'Revise a pesquisa ou cadastre um estudante para iniciar o acompanhamento.',
      icon: 'graduation-cap'
    });
    tableWrap.setAttribute('aria-busy', 'false');
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
  tableWrap.setAttribute('aria-busy', 'false');
};

const openCreateModal = () => {
  form.reset();
  clearValidity();
  form.elements.id.value = '';
  $('#studentModalTitle').textContent = 'Novo estagiário';
  modal.show();
};

const openEditModal = (id) => {
  let student;

  try {
    student = getCollection('estagiarios').find((item) => item.id === id);
  } catch (error) {
    console.error('StageFlow: não foi possível abrir o cadastro para edição.', error);
    notify('Não foi possível acessar o cadastro. Verifique o navegador e tente novamente.', 'danger');
    return;
  }

  if (!student) return;

  form.reset();
  clearValidity();
  fillForm(form, student);
  $('#studentModalTitle').textContent = 'Editar estagiário';
  modal.show();
};

const deleteStudent = async (id) => {
  let student;

  try {
    student = getCollection('estagiarios').find((item) => item.id === id);
  } catch (error) {
    console.error('StageFlow: não foi possível acessar o cadastro para exclusão.', error);
    notify('Não foi possível acessar o cadastro. Verifique o navegador e tente novamente.', 'danger');
    return;
  }

  const confirmed = await confirmAction({
    title: 'Excluir estagiário',
    message: `Remover ${student?.nome ?? 'este estagiário'} do cadastro? As atividades lançadas continuarão preservadas.`,
    confirmText: 'Excluir',
    danger: true
  });

  if (!confirmed) return;

  try {
    deleteRecord('estagiarios', id);
    notify('Estagiário removido do cadastro.', 'success');
    renderStudents();
  } catch (error) {
    console.error('StageFlow: não foi possível excluir o estagiário.', error);
    notify('Não foi possível excluir o estagiário. Tente novamente.', 'danger');
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = readForm(form);
  let students;

  try {
    students = getCollection('estagiarios');
  } catch (error) {
    console.error('StageFlow: não foi possível acessar os cadastros.', error);
    notify('Não foi possível acessar os dados locais. Verifique o navegador e tente novamente.', 'danger');
    return;
  }

  const validation = validateStudentInput(data, students, data.id);
  applyValidationErrors(validation.errors);

  if (!validation.isValid || !form.checkValidity()) {
    form.reportValidity();
    form.querySelector(':invalid')?.focus();
    return;
  }

  setSaving(true);
  await new Promise((resolve) => window.requestAnimationFrame(resolve));

  try {
    if (data.id) {
      updateRecord('estagiarios', data.id, validation.value);
      notify('Cadastro do estagiário atualizado.', 'success');
    } else {
      createRecord('estagiarios', validation.value, 'est');
      notify('Estagiário cadastrado.', 'success');
    }

    modal.hide();
    renderStudents();
  } catch (error) {
    console.error('StageFlow: não foi possível salvar o estagiário.', error);
    notify('Não foi possível salvar o cadastro. Verifique o navegador e tente novamente.', 'danger');
  } finally {
    setSaving(false);
  }
});

[...form.elements].forEach((field) => {
  field.addEventListener('input', () => field.setCustomValidity(''));
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
