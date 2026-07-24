import {
  getAtividadesComEstagiario,
  getHorasPorEstagiario,
  getResumo,
  loadState
} from '../storage.js?v=16';
import { exportReportPdf } from '../pdf.js?v=12';
import {
  $,
  escapeHtml,
  formatDate,
  formatHours,
  initLayout,
  notify,
  readForm,
  refreshIcons
} from '../ui.js?v=16';

let currentReport = null;

const isWithinPeriod = (date, start, end) => {
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

const populateStudents = () => {
  const students = loadState().estagiarios;
  $('#reportStudent').innerHTML = students.map((student) => `
    <option value="${student.id}">${escapeHtml(student.nome)}</option>
  `).join('');
};

const getFilteredActivities = (state, start, end) => (
  getAtividadesComEstagiario(state)
    .filter((activity) => isWithinPeriod(activity.data, start, end))
    .sort((a, b) => b.data.localeCompare(a.data))
);

const getFilteredAttendance = (state, start, end) => (
  state.frequencias
    .filter((record) => isWithinPeriod(record.data, start, end))
    .sort((a, b) => b.data.localeCompare(a.data))
);

const buildGeneralReport = (state, filters) => {
  const summary = getResumo(state);
  const hoursByStudent = getHorasPorEstagiario(state);
  const activities = getFilteredActivities(state, filters.start, filters.end);

  return {
    title: 'Relatório Geral de Estágios',
    subtitle: state.project.institution,
    lines: [
      ['Estagiários cadastrados', summary.totalEstagiarios],
      ['Estagiários ativos', summary.ativos],
      ['Supervisores cadastrados', summary.totalSupervisores],
      ['Atividades no período', activities.length],
      ['Horas em atividades', formatHours(summary.totalHoras)],
      ['Horas em frequência', formatHours(summary.horasFrequencia)]
    ],
    sections: [
      {
        title: 'Horas por estagiário',
        items: hoursByStudent.map((student) => `${student.nome}: ${formatHours(student.horas)} (${student.status})`)
      },
      {
        title: 'Atividades recentes',
        items: activities.slice(0, 8).map((activity) => `${formatDate(activity.data)} - ${activity.estagiario}: ${activity.descricao}`)
      }
    ]
  };
};

const buildIndividualReport = (state, filters) => {
  const student = state.estagiarios.find((item) => item.id === filters.student) ?? state.estagiarios[0];
  const activities = getFilteredActivities(state, filters.start, filters.end)
    .filter((activity) => activity.estagiarioId === student?.id);
  const frequencias = getFilteredAttendance(state, filters.start, filters.end)
    .filter((record) => record.estagiarioId === student?.id);
  const totalHoras = activities.reduce((total, activity) => total + Number(activity.horas || 0), 0);
  const presencas = frequencias.filter((record) => record.status === 'presente').length;
  const ausencias = frequencias.filter((record) => record.status === 'ausente').length;

  return {
    title: 'Relatório Individual de Estágio',
    subtitle: student?.nome ?? 'Estagiário',
    lines: [
      ['Matrícula', student?.matricula ?? '-'],
      ['Curso', student?.curso ?? '-'],
      ['Email', student?.email ?? '-'],
      ['Status', student?.status ?? '-'],
      ['Horas no período', formatHours(totalHoras)],
      ['Presenças', presencas],
      ['Ausências', ausencias]
    ],
    sections: [
      {
        title: 'Atividades realizadas',
        items: activities.length
          ? activities.map((activity) => `${formatDate(activity.data)} - ${activity.tipo}: ${activity.descricao} (${formatHours(activity.horas)})`)
          : ['Nenhuma atividade encontrada para os filtros aplicados.']
      }
    ]
  };
};

const buildActivitiesReport = (state, filters) => {
  const activities = getFilteredActivities(state, filters.start, filters.end);
  const totalHoras = activities.reduce((total, activity) => total + Number(activity.horas || 0), 0);
  const types = activities.reduce((acc, activity) => {
    acc[activity.tipo] = (acc[activity.tipo] || 0) + 1;
    return acc;
  }, {});

  return {
    title: 'Relatório de Atividades',
    subtitle: 'Registros acadêmicos de acompanhamento',
    lines: [
      ['Atividades filtradas', activities.length],
      ['Horas relacionadas', formatHours(totalHoras)],
      ['Tipos identificados', Object.keys(types).length],
      ['Período', filters.start || filters.end ? `${filters.start || 'início'} a ${filters.end || 'fim'}` : 'Todos os registros']
    ],
    sections: [
      {
        title: 'Distribuição por tipo',
        items: Object.entries(types).map(([tipo, total]) => `${tipo}: ${total} registro(s)`)
      },
      {
        title: 'Lista de atividades',
        items: activities.map((activity) => `${formatDate(activity.data)} - ${activity.estagiario} - ${activity.tipo}: ${activity.descricao}`)
      }
    ]
  };
};

const buildAttendanceReport = (state, filters) => {
  const records = getFilteredAttendance(state, filters.start, filters.end);
  const totalHoras = records.reduce((total, record) => total + Number(record.horas || 0), 0);
  const presencas = records.filter((record) => record.status === 'presente').length;
  const ausencias = records.filter((record) => record.status === 'ausente').length;

  return {
    title: 'Relatório de Frequência',
    subtitle: 'Controle visual de presença e horas',
    lines: [
      ['Registros filtrados', records.length],
      ['Presenças', presencas],
      ['Ausências', ausencias],
      ['Horas acumuladas', formatHours(totalHoras)]
    ],
    sections: [
      {
        title: 'Lançamentos de frequência',
        items: records.map((record) => {
          const student = state.estagiarios.find((item) => item.id === record.estagiarioId);
          return `${formatDate(record.data)} - ${student?.nome ?? 'Estagiário'} - ${record.status} (${formatHours(record.horas)})`;
        })
      }
    ]
  };
};

const renderReport = (report, state) => {
  currentReport = report;

  $('#reportPreview').innerHTML = `
    <div>
      <p style="color:#667085;">StageFlow · ${escapeHtml(state.project.status)}</p>
      <h2>${escapeHtml(report.title)}</h2>
      <p>${escapeHtml(report.subtitle)}</p>
    </div>
    <div>
      ${report.lines.map(([label, value]) => `
        <div class="report-line">
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(value)}</span>
        </div>
      `).join('')}
    </div>
    ${report.sections.map((section) => `
      <section>
        <h3>${escapeHtml(section.title)}</h3>
        <ul class="mt-2 mb-0">
          ${(section.items.length ? section.items : ['Nenhum registro encontrado para os filtros aplicados.'])
            .map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </section>
    `).join('')}
    <p class="report-disclaimer">${escapeHtml(state.project.privacyNotice)}</p>
  `;
};

const buildReport = () => {
  const state = loadState();
  const data = readForm($('#reportForm'));
  const filters = {
    type: data.type,
    student: data.student,
    start: data.start,
    end: data.end
  };

  const builders = {
    geral: buildGeneralReport,
    individual: buildIndividualReport,
    atividades: buildActivitiesReport,
    frequencia: buildAttendanceReport
  };
  const report = builders[filters.type](state, filters);

  renderReport(report, state);
  return { report, state };
};

const generateReport = () => {
  buildReport();
  notify('Relatório preparado para exportação.', 'success');
};

const exportPdf = () => {
  const { report, state } = buildReport();

  try {
    exportReportPdf(report, state);
    notify('PDF exportado com aparência de relatório acadêmico.');
  } catch (error) {
    notify(error.message, 'danger');
  }
};

$('#reportForm').addEventListener('submit', (event) => {
  event.preventDefault();
  generateReport();
});

$('#reportType').addEventListener('change', (event) => {
  $('#reportStudent').disabled = event.target.value !== 'individual';
});

$('#exportPdfButton').addEventListener('click', exportPdf);

initLayout('relatorios');
populateStudents();
$('#reportStudent').disabled = true;
renderReport(buildGeneralReport(loadState(), {}), loadState());
refreshIcons();
