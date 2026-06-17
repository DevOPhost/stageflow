import {
  getAtividadesComEstagiario,
  getAtividadesPorTipo,
  getEstagiarioNome,
  getHorasPorEstagiario,
  getHorasPorSemana,
  getResumo,
  loadState
} from '../storage.js?v=14';
import {
  $,
  escapeHtml,
  formatDate,
  formatHours,
  formatShortDate,
  initLayout,
  refreshIcons,
  statusClass
} from '../ui.js?v=13';

let hoursChart;
let statusChart;
let weeklyChart;
let typeChart;

const palette = ['#39c7f4', '#52d273', '#ffbd4a', '#8da2ff', '#ff6b82', '#b7f36b', '#a78bfa'];

const metricConfig = [
  { label: 'Estagiários ativos', icon: 'graduation-cap', key: 'ativos', foot: 'em acompanhamento' },
  { label: 'Supervisores', icon: 'briefcase-business', key: 'totalSupervisores', foot: 'rede de apoio' },
  { label: 'Atividades', icon: 'clipboard-list', key: 'totalAtividades', foot: 'registros acompanhados' },
  { label: 'Horas acompanhadas', icon: 'timer', key: 'totalHoras', foot: 'em atividades' }
];

const chartTextColor = () => getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
const chartBorderColor = () => getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
const chartSurfaceColor = () => getComputedStyle(document.documentElement).getPropertyValue('--surface-solid').trim();

const renderMetrics = (summary) => {
  $('#metricGrid').innerHTML = metricConfig.map((metric, index) => {
    const value = metric.key === 'totalHoras'
      ? formatHours(summary[metric.key])
      : summary[metric.key].toLocaleString('pt-BR');
    const trend = index === 0
      ? `${summary.totalEstagiarios} cadastrados`
      : index === 3
        ? `${Math.round((summary.totalHoras / summary.metaHoras) * 100)}% da carga`
        : 'base atualizada';

    return `
      <article class="surface-card metric-card fade-slide" style="animation-delay:${index * 40}ms">
        <div class="metric-top">
          <div><h2>${metric.label}</h2></div>
          <span class="metric-icon"><i data-lucide="${metric.icon}"></i></span>
        </div>
        <p class="metric-value">${value}</p>
        <div class="metric-foot">
          <span>${metric.foot}</span>
          <span class="mini-trend"><i data-lucide="trending-up"></i>${trend}</span>
        </div>
      </article>
    `;
  }).join('');
};

const renderGoal = (summary) => {
  const percent = Math.min(100, Math.round((summary.totalHoras / summary.metaHoras) * 100));
  const remaining = Math.max(0, summary.metaHoras - summary.totalHoras);

  $('#goalSummary').innerHTML = `
    <div class="goal-number">
      <strong>${percent}%</strong>
      <span>da carga prevista concluída</span>
    </div>
    <div class="progress" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-bar" style="width:${percent}%"></div>
    </div>
    <div class="d-flex flex-wrap justify-content-between gap-2 muted">
      <span>${formatHours(summary.totalHoras)} registradas</span>
      <span>${formatHours(remaining)} restantes</span>
      <span>${formatHours(summary.metaHoras)} previstas</span>
    </div>
  `;
};

const renderStageSummary = (state, summary) => {
  $('#stageSummary').innerHTML = `
    <div class="settings-option">
      <span class="muted">Instituição</span>
      <strong>${escapeHtml(state.project.institution)}</strong>
    </div>
    <div class="settings-option">
      <span class="muted">Curso</span>
      <strong>${escapeHtml(state.project.course)}</strong>
    </div>
    <div class="settings-option">
      <span class="muted">Status da versão</span>
      <strong>${escapeHtml(state.project.status)}</strong>
    </div>
    <div class="settings-option">
      <span class="muted">Frequência registrada</span>
      <strong>${formatHours(summary.horasFrequencia)}</strong>
    </div>
  `;
};

const renderUpcomingDeliveries = (state) => {
  $('#upcomingDeliveries').innerHTML = state.entregas
    .slice()
    .sort((a, b) => a.data.localeCompare(b.data))
    .map((delivery) => `
      <article class="recent-item">
        <div class="recent-date">${formatShortDate(delivery.data)}</div>
        <div>
          <strong>${escapeHtml(delivery.titulo)}</strong>
          <span>${escapeHtml(getEstagiarioNome(delivery.responsavelId, state))} · ${formatDate(delivery.data)}</span>
        </div>
        <span class="status-pill ${statusClass(delivery.status)}">${escapeHtml(delivery.status)}</span>
      </article>
    `).join('');
};

const renderAcademicPending = (state) => {
  $('#academicPending').innerHTML = state.pendencias
    .slice()
    .sort((a, b) => a.prazo.localeCompare(b.prazo))
    .map((item) => `
      <article class="recent-item">
        <div class="recent-date">${formatShortDate(item.prazo)}</div>
        <div>
          <strong>${escapeHtml(item.titulo)}</strong>
          <span>${escapeHtml(getEstagiarioNome(item.responsavelId, state))} · prazo ${formatDate(item.prazo)}</span>
        </div>
        <span class="chip">${escapeHtml(item.prioridade)}</span>
      </article>
    `).join('');
};

const renderRecentActivities = (activities) => {
  const recent = activities
    .sort((a, b) => `${b.data} ${b.horario}`.localeCompare(`${a.data} ${a.horario}`))
    .slice(0, 5);

  $('#recentActivities').innerHTML = recent.map((activity) => `
    <article class="recent-item">
      <div class="recent-date">${formatShortDate(activity.data)}</div>
      <div>
        <strong title="${escapeHtml(activity.descricao)}">${escapeHtml(activity.descricao)}</strong>
        <span>${escapeHtml(activity.estagiario)} · ${escapeHtml(activity.tipo)} · ${formatDate(activity.data)} às ${escapeHtml(activity.horario)}</span>
      </div>
      <span class="chip">${formatHours(activity.horas)}</span>
    </article>
  `).join('');
};

const destroyChart = (chart) => {
  if (chart) chart.destroy();
};

const renderCharts = () => {
  const state = loadState();
  const hoursData = getHorasPorEstagiario(state);
  const weeklyData = getHorasPorSemana(state);
  const typeData = getAtividadesPorTipo(state);
  const statusGroups = state.estagiarios.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  if (!window.Chart) {
    renderChartFallback('#hoursChart', hoursData.map((item) => [item.nome.split(' ')[0], formatHours(item.horas)]));
    renderChartFallback('#statusChart', Object.entries(statusGroups));
    renderChartFallback('#weeklyChart', weeklyData.map((item) => [item.label, formatHours(item.horas)]));
    renderChartFallback('#typeChart', typeData.map((item) => [item.tipo, item.total]));
    return;
  }

  [hoursChart, statusChart, weeklyChart, typeChart].forEach(destroyChart);
  ['#hoursChart', '#statusChart', '#weeklyChart', '#typeChart'].forEach((selector) => {
    const canvas = $(selector);
    if (!canvas) return;
    canvas.style.display = '';
    canvas.parentElement.querySelectorAll('.chart-fallback').forEach((fallback) => fallback.remove());
  });

  const sharedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: chartTextColor(), boxWidth: 12, boxHeight: 12 } },
      tooltip: { backgroundColor: '#101114', padding: 12 }
    }
  };

  hoursChart = new window.Chart($('#hoursChart'), {
    type: 'bar',
    data: {
      labels: hoursData.map((item) => item.nome.split(' ')[0]),
      datasets: [{
        label: 'Horas',
        data: hoursData.map((item) => item.horas),
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#71e0ff',
        backgroundColor: palette
      }]
    },
    options: {
      ...sharedOptions,
      scales: {
        x: { ticks: { color: chartTextColor() }, grid: { color: 'transparent' } },
        y: { ticks: { color: chartTextColor() }, grid: { color: chartBorderColor() } }
      }
    }
  });

  statusChart = new window.Chart($('#statusChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusGroups),
      datasets: [{
        data: Object.values(statusGroups),
        borderColor: chartSurfaceColor(),
        backgroundColor: palette
      }]
    },
    options: { ...sharedOptions, cutout: '68%' }
  });

  weeklyChart = new window.Chart($('#weeklyChart'), {
    type: 'line',
    data: {
      labels: weeklyData.map((item) => item.label),
      datasets: [{
        label: 'Horas',
        data: weeklyData.map((item) => item.horas),
        tension: .38,
        fill: true,
        borderColor: '#71e0ff',
        backgroundColor: 'rgba(57, 199, 244, .16)',
        pointBackgroundColor: '#71e0ff'
      }]
    },
    options: {
      ...sharedOptions,
      scales: {
        x: { ticks: { color: chartTextColor() }, grid: { color: 'transparent' } },
        y: { ticks: { color: chartTextColor() }, grid: { color: chartBorderColor() } }
      }
    }
  });

  typeChart = new window.Chart($('#typeChart'), {
    type: 'polarArea',
    data: {
      labels: typeData.map((item) => item.tipo),
      datasets: [{
        data: typeData.map((item) => item.total),
        borderColor: chartSurfaceColor(),
        backgroundColor: palette
      }]
    },
    options: sharedOptions
  });
};

const renderChartFallback = (selector, items) => {
  const canvas = $(selector);
  if (!canvas) return;

  canvas.style.display = 'none';
  canvas.parentElement.querySelectorAll('.chart-fallback').forEach((fallback) => fallback.remove());

  const fallback = document.createElement('div');
  fallback.className = 'chart-fallback';
  fallback.dataset.fallbackFor = selector;
  fallback.innerHTML = items.slice(0, 7).map(([label, value]) => `
    <div class="chart-fallback-row">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join('');
  canvas.insertAdjacentElement('afterend', fallback);
};

const renderDashboard = () => {
  const state = loadState();
  const summary = getResumo(state);
  const activities = getAtividadesComEstagiario(state);

  renderMetrics(summary);
  renderGoal(summary);
  renderStageSummary(state, summary);
  renderUpcomingDeliveries(state);
  renderAcademicPending(state);
  renderRecentActivities(activities);
  renderCharts();
  refreshIcons();
};

initLayout('dashboard');
setTimeout(renderDashboard, 280);
window.addEventListener('stageflow:themechange', renderCharts);
window.addEventListener('stageflow:datachange', renderDashboard);
