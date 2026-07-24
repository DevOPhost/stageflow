import {
  getCollection,
  getEstagiarioById,
  loadState,
  upsertFrequencia
} from '../storage.js?v=16';
import {
  $,
  createModal,
  escapeHtml,
  formatDate,
  formatHours,
  initLayout,
  notify,
  readForm,
  refreshIcons,
  statusClass
} from '../ui.js?v=16';

const today = new Date();
const latestAttendanceDate = loadState().frequencias
  .map((record) => record.data)
  .sort()
  .at(-1);
const initialCalendarDate = latestAttendanceDate
  ? new Date(`${latestAttendanceDate}T00:00:00`)
  : today;

let currentYear = initialCalendarDate.getFullYear();
let currentMonth = initialCalendarDate.getMonth();
let selectedStudentId = '';

const calendarDays = $('#calendarDays');
const attendanceForm = $('#attendanceForm');
const attendanceModal = createModal($('#attendanceModal'));

const toDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const monthLabel = (year, month) => (
  new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(year, month, 1))
);

const getSelectedRecords = () => {
  const monthToken = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  return getCollection('frequencias')
    .filter((record) => record.estagiarioId === selectedStudentId && record.data.startsWith(monthToken));
};

const populateStudents = () => {
  const students = getCollection('estagiarios');
  selectedStudentId = students[0]?.id ?? '';

  $('#attendanceStudent').innerHTML = students.map((student) => `
    <option value="${student.id}">${escapeHtml(student.nome)}</option>
  `).join('');
};

const getRecordByDate = (date) => (
  getCollection('frequencias').find((record) => (
    record.estagiarioId === selectedStudentId && record.data === date
  ))
);

const renderSummary = () => {
  const state = loadState();
  const student = getEstagiarioById(selectedStudentId, state);
  const records = getSelectedRecords();
  const presentes = records.filter((record) => record.status === 'presente').length;
  const ausentes = records.filter((record) => record.status === 'ausente').length;
  const horas = records.reduce((total, record) => total + Number(record.horas || 0), 0);
  const percent = Math.min(100, Math.round((horas / Number(state.preferences.weekGoal * 4 || 80)) * 100));

  $('#attendanceStudentName').textContent = student?.nome ?? 'Sem estudante cadastrado';
  $('#attendanceSummary').innerHTML = `
    <div class="d-grid gap-3">
      <div class="settings-option">
        <span class="muted">Presenças</span>
        <strong>${presentes}</strong>
      </div>
      <div class="settings-option">
        <span class="muted">Ausências</span>
        <strong>${ausentes}</strong>
      </div>
      <div class="settings-option">
        <span class="muted">Horas no mês</span>
        <strong>${formatHours(horas)}</strong>
      </div>
      <div>
        <div class="d-flex justify-content-between mb-2">
          <span class="muted">Meta mensal estimada</span>
          <strong>${percent}%</strong>
        </div>
        <div class="progress" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width:${percent}%"></div>
        </div>
      </div>
    </div>
  `;
};

const renderCalendar = () => {
  $('#calendarTitle').textContent = monthLabel(currentYear, currentMonth);

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const offset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((offset + lastDay.getDate()) / 7) * 7;
  const todayToken = toDateInput(today);
  const cells = [];

  for (let index = 0; index < totalCells; index += 1) {
    const dayNumber = index - offset + 1;
    const date = new Date(currentYear, currentMonth, dayNumber);
    const dateToken = toDateInput(date);
    const outside = dayNumber < 1 || dayNumber > lastDay.getDate();
    const record = outside ? null : getRecordByDate(dateToken);
    const status = record?.status ?? 'sem-registro';
    const statusLabel = status === 'presente' ? 'Presença' : status === 'ausente' ? 'Ausência' : 'Sem registro';

    cells.push(`
      <button class="calendar-day ${outside ? 'outside' : ''} ${status} ${dateToken === todayToken ? 'today' : ''}" type="button" data-date="${dateToken}" ${outside ? 'tabindex="-1"' : ''}>
        <span class="day-number">${outside ? '' : dayNumber}</span>
        ${outside ? '' : `<span class="day-status ${statusClass(statusLabel)}">${statusLabel}${record?.horas ? ` · ${formatHours(record.horas)}` : ''}</span>`}
      </button>
    `);
  }

  calendarDays.innerHTML = cells.join('');
  renderSummary();
};

const openAttendanceModal = (date) => {
  if (!selectedStudentId) {
    notify('Cadastre um estagiário antes de lançar frequência.', 'warning');
    return;
  }

  const record = getRecordByDate(date);
  attendanceForm.reset();
  attendanceForm.elements.data.value = date;
  attendanceForm.elements.estagiarioId.value = selectedStudentId;
  attendanceForm.elements.status.value = record?.status ?? 'presente';
  attendanceForm.elements.horas.value = record?.horas ?? 4;
  $('#attendanceModalTitle').textContent = `Frequência de ${formatDate(date)}`;
  attendanceModal.show();
};

calendarDays.addEventListener('click', (event) => {
  const button = event.target.closest('.calendar-day:not(.outside)');
  if (!button) return;
  openAttendanceModal(button.dataset.date);
});

attendanceForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = readForm(attendanceForm);
  const status = data.status;
  const horas = status === 'ausente' || status === 'sem-registro' ? 0 : Number(data.horas || 0);

  upsertFrequencia({
    data: data.data,
    estagiarioId: data.estagiarioId,
    status,
    horas
  });

  attendanceModal.hide();
  notify('Frequência atualizada.');
  renderCalendar();
});

$('#attendanceStudent').addEventListener('change', (event) => {
  selectedStudentId = event.target.value;
  renderCalendar();
});

$('#prevMonthButton').addEventListener('click', () => {
  currentMonth -= 1;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  }
  renderCalendar();
});

$('#nextMonthButton').addEventListener('click', () => {
  currentMonth += 1;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  renderCalendar();
});

initLayout('frequencia');
populateStudents();
renderCalendar();
refreshIcons();
