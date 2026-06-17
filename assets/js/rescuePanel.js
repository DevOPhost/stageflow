(() => {
  const SETTINGS_KEY = 'stageflow.rescue.settings.v3';
  const DATA_KEY = 'stageflow.rescue.records.v3';

  const baseSettings = {
    theme: 'dark',
    density: 'comfortable',
    animations: true,
    projectName: 'StageFlow',
    institution: 'UNIC - Universidade de Cuiabá',
    defaultHours: 6
  };

  const supervisors = [
    { id: 'sup-andre', name: 'André Galvan da Silveira', role: 'Coordenador de Curso', email: 'andre.galvan@unic.br', phone: '(65) 3363-1000', sector: 'Coordenação Acadêmica', company: 'UNIC - Universidade de Cuiabá', notes: 'Responsável pela validação acadêmica do estágio supervisionado.' },
    { id: 'sup-marcos', name: 'Marcos Vinícius Alves', role: 'Supervisor Técnico', email: 'marcos.alves@parceirotech.com.br', phone: '(65) 3055-1300', sector: 'Tecnologia da Informação', company: 'Setor de TI parceiro', notes: 'Acompanha atividades técnicas, infraestrutura e suporte aos laboratórios.' },
    { id: 'sup-juliana', name: 'Juliana Prado Martins', role: 'Analista Administrativa', email: 'juliana.martins@unic.br', phone: '(65) 3028-4401', sector: 'Central de Estágios', company: 'UNIC - Universidade de Cuiabá', notes: 'Confere documentação, termos e relatórios parciais.' },
    { id: 'sup-renata', name: 'Renata Costa Almeida', role: 'Orientadora Acadêmica', email: 'renata.almeida@unic.br', phone: '(65) 99214-0872', sector: 'Orientação de Estágio', company: 'UNIC - Universidade de Cuiabá', notes: 'Acompanha frequência, evolução acadêmica e entregas finais.' },
    { id: 'sup-douglas', name: 'Douglas Henrique Barros', role: 'Analista de Sistemas', email: 'douglas.barros@unic.br', phone: '(65) 98112-6409', sector: 'Sistemas Acadêmicos', company: 'UNIC - Universidade de Cuiabá', notes: 'Apoia análise de requisitos, integração de sistemas e relatórios gerenciais.' },
    { id: 'sup-priscila', name: 'Priscila Nogueira Campos', role: 'Gestora de Projetos de TI', email: 'priscila.campos@parceirotech.com.br', phone: '(65) 99281-7740', sector: 'Projetos Digitais', company: 'Núcleo parceiro de inovação', notes: 'Acompanha organização de tarefas, entregas semanais e qualidade da documentação.' }
  ];

  const students = [
    { id: 'est-leonardo', name: 'Leonardo Farias Martins', registration: '202310452', course: 'Ciência da Computação', email: 'leonardo.farias@academico.unic.br', phone: '(65) 99214-3087', status: 'Ativo', supervisorId: 'sup-andre', requiredHours: 360, notes: 'Evolução consistente em frontend, relatórios e organização do repositório.' },
    { id: 'est-ana', name: 'Ana Clara Souza', registration: '202311087', course: 'Ciência da Computação', email: 'ana.souza@academico.unic.br', phone: '(65) 98422-7610', status: 'Ativo', supervisorId: 'sup-marcos', requiredHours: 360, notes: 'Atuação concentrada em infraestrutura, cadastro e refinamento visual.' },
    { id: 'est-rafael', name: 'Rafael Mendes Oliveira', registration: '202209744', course: 'Sistemas de Informação', email: 'rafael.oliveira@academico.unic.br', phone: '(65) 99631-4582', status: 'Em acompanhamento', supervisorId: 'sup-renata', requiredHours: 300, notes: 'Necessita manter regularidade nas entregas de documentação acadêmica.' },
    { id: 'est-bruno', name: 'Bruno Henrique Lima', registration: '202112638', course: 'Análise e Desenvolvimento de Sistemas', email: 'bruno.lima@academico.unic.br', phone: '(65) 98135-7744', status: 'Finalizado', supervisorId: 'sup-juliana', requiredHours: 240, notes: 'Participou da validação de processos e segurança dos registros.' },
    { id: 'est-camila', name: 'Camila Fernanda Rocha', registration: '202410318', course: 'Ciência da Computação', email: 'camila.rocha@academico.unic.br', phone: '(65) 99308-1265', status: 'Pendente de validação', supervisorId: 'sup-juliana', requiredHours: 360, notes: 'Ficha de acompanhamento aguardando conferência final da central de estágios.' },
    { id: 'est-matheus', name: 'Matheus Gabriel Pereira', registration: '202310884', course: 'Ciência da Computação', email: 'matheus.pereira@academico.unic.br', phone: '(65) 99267-4418', status: 'Ativo', supervisorId: 'sup-andre', requiredHours: 360, notes: 'Boa evolução em dashboard, métricas e revisão dos indicadores.' },
    { id: 'est-larissa', name: 'Larissa Vitória Campos', registration: '202211306', course: 'Engenharia de Software', email: 'larissa.campos@academico.unic.br', phone: '(65) 99841-2206', status: 'Ativo', supervisorId: 'sup-douglas', requiredHours: 360, notes: 'Acompanha integração com sistemas acadêmicos e documentação de requisitos.' },
    { id: 'est-gustavo', name: 'Gustavo Almeida Pires', registration: '202312509', course: 'Redes de Computadores', email: 'gustavo.pires@academico.unic.br', phone: '(65) 98177-9045', status: 'Ativo', supervisorId: 'sup-marcos', requiredHours: 300, notes: 'Atuação em inventário, suporte e organização dos laboratórios de informática.' },
    { id: 'est-mariana', name: 'Mariana Oliveira Duarte', registration: '202410774', course: 'Sistemas para Internet', email: 'mariana.duarte@academico.unic.br', phone: '(65) 99205-4816', status: 'Em acompanhamento', supervisorId: 'sup-priscila', requiredHours: 300, notes: 'Participa da organização visual das telas e da experiência dos formulários.' },
    { id: 'est-felipe', name: 'Felipe Augusto Ribeiro', registration: '202209318', course: 'Banco de Dados', email: 'felipe.ribeiro@academico.unic.br', phone: '(65) 99604-7712', status: 'Ativo', supervisorId: 'sup-douglas', requiredHours: 300, notes: 'Foco em modelagem, integridade dos registros e indicadores gerenciais.' }
  ];

  const activities = [
    ['2025-08-20', 'est-leonardo', 'sup-andre', 'Integração', 'Integração ao setor de TI e alinhamento do plano de estágio supervisionado.', 'Validado'],
    ['2025-08-21', 'est-ana', 'sup-marcos', 'Infraestrutura', 'Inventário de hardware e software nos laboratórios de informática.', 'Validado'],
    ['2025-08-22', 'est-bruno', 'sup-juliana', 'Requisitos', 'Levantamento de requisitos para organização digital dos registros acadêmicos.', 'Validado'],
    ['2025-08-25', 'est-rafael', 'sup-renata', 'Processos', 'Mapeamento do fluxo de solicitação, validação e acompanhamento de atividades.', 'Validado'],
    ['2025-08-26', 'est-leonardo', 'sup-andre', 'Modelagem', 'Estruturação de entidades para estagiários, supervisores, frequência e relatórios.', 'Validado'],
    ['2025-08-27', 'est-matheus', 'sup-andre', 'Dashboard', 'Organização dos indicadores de carga horária, progresso e atividades recentes.', 'Validado'],
    ['2025-08-28', 'est-ana', 'sup-marcos', 'Frontend', 'Ajustes nas telas de cadastro e padronização dos campos obrigatórios.', 'Validado'],
    ['2025-08-29', 'est-bruno', 'sup-juliana', 'Integração', 'Revisão do fluxo entre cadastros, registros de atividades e relatórios.', 'Validado'],
    ['2025-09-01', 'est-larissa', 'sup-douglas', 'Requisitos', 'Documentação dos perfis de usuário e regras de acompanhamento acadêmico.', 'Validado'],
    ['2025-09-02', 'est-camila', 'sup-juliana', 'Dashboard', 'Implementação de indicadores de progresso e resumos administrativos.', 'Pendente de conferência'],
    ['2025-09-03', 'est-matheus', 'sup-andre', 'Documentação', 'Registro técnico dos fluxos de cadastro, frequência e emissão de relatórios.', 'Validado'],
    ['2025-09-04', 'est-gustavo', 'sup-marcos', 'Suporte', 'Organização de chamados e triagem de demandas dos laboratórios.', 'Validado'],
    ['2025-09-05', 'est-rafael', 'sup-renata', 'Ajustes', 'Revisão de contraste, responsividade e organização dos componentes da interface.', 'Em revisão'],
    ['2025-09-08', 'est-leonardo', 'sup-andre', 'Treinamento', 'Apresentação do fluxo de indicadores para usuários convidados.', 'Validado'],
    ['2025-09-09', 'est-camila', 'sup-juliana', 'Relatórios', 'Criação de prévias com resumo de horas, frequência e atividades por estudante.', 'Pendente de conferência'],
    ['2025-09-10', 'est-felipe', 'sup-douglas', 'Dados', 'Conferência de consistência dos registros acadêmicos e indicadores gerenciais.', 'Validado'],
    ['2025-09-11', 'est-ana', 'sup-marcos', 'Frontend', 'Refinamento visual dos componentes, formulários e estados de interação.', 'Validado'],
    ['2025-09-12', 'est-matheus', 'sup-andre', 'Dashboard', 'Revisão de gráficos de horas por semana, categorias e pendências acadêmicas.', 'Validado'],
    ['2025-09-15', 'est-mariana', 'sup-priscila', 'UX', 'Organização das preferências visuais e revisão dos painéis de detalhes.', 'Em revisão'],
    ['2025-09-16', 'est-rafael', 'sup-renata', 'Frequência', 'Consolidação de pendências acadêmicas e validação da frequência com supervisor.', 'Validado'],
    ['2025-09-17', 'est-leonardo', 'sup-andre', 'Entrega', 'Entrega final da versão de apresentação e coleta de feedback do supervisor.', 'Validado'],
    ['2025-09-17', 'est-larissa', 'sup-douglas', 'Relatórios', 'Conferência do relatório geral e validação dos dados institucionais.', 'Validado'],
    ['2025-09-16', 'est-gustavo', 'sup-marcos', 'Infraestrutura', 'Atualização do inventário e conferência de equipamentos em uso.', 'Validado'],
    ['2025-09-15', 'est-felipe', 'sup-douglas', 'Modelagem', 'Revisão das regras de cálculo de carga horária e frequência acumulada.', 'Validado'],
    ['2025-09-12', 'est-mariana', 'sup-priscila', 'Interface', 'Padronização das telas de consulta e revisão da legibilidade dos cards.', 'Em revisão']
  ].map((item, index) => ({
    id: `ati-${String(index + 1).padStart(3, '0')}`,
    date: item[0],
    start: '08:00',
    end: '14:00',
    hours: 6,
    studentId: item[1],
    supervisorId: item[2],
    category: item[3],
    description: item[4],
    status: item[5],
    notes: 'Registro vinculado ao acompanhamento acadêmico do Estágio Supervisionado Obrigatório.'
  }));

  const attendanceDays = [
    '2025-08-20', '2025-08-21', '2025-08-22', '2025-08-25', '2025-08-26', '2025-08-27', '2025-08-28', '2025-08-29',
    '2025-09-01', '2025-09-02', '2025-09-03', '2025-09-04', '2025-09-05', '2025-09-08', '2025-09-09', '2025-09-10',
    '2025-09-11', '2025-09-12', '2025-09-15', '2025-09-16', '2025-09-17'
  ];

  const absentMap = new Set([
    'est-rafael-2025-09-04',
    'est-camila-2025-09-05',
    'est-mariana-2025-09-10',
    'est-gustavo-2025-09-12',
    'est-felipe-2025-08-29',
    'est-larissa-2025-09-16'
  ]);

  const attendance = students.flatMap((student) => attendanceDays.map((date, index) => {
    const absent = absentMap.has(`${student.id}-${date}`);
    return {
      id: `freq-${student.id}-${date}`,
      studentId: student.id,
      date,
      start: absent ? '-' : '08:00',
      end: absent ? '-' : '14:00',
      hours: absent ? 0 : 6,
      status: absent ? 'Ausente' : 'Presente',
      activityId: activities.find((activity) => activity.studentId === student.id && activity.date === date)?.id ?? null,
      notes: absent ? 'Ausência registrada para acompanhamento acadêmico.' : 'Presença confirmada no período regular de estágio.'
    };
  }));

  const pageMeta = {
    dashboard: ['Dashboard administrativo', 'Visão consolidada do acompanhamento acadêmico de estágio.'],
    estagiarios: ['Estagiários', 'Cadastro acadêmico, acompanhamento e detalhes dos alunos.'],
    supervisores: ['Supervisores', 'Rede de orientação acadêmica e técnica vinculada ao estágio.'],
    atividades: ['Atividades', 'Registros de atividades de TI entre 20/08/2025 e 17/09/2025.'],
    frequencia: ['Frequência', 'Controle acadêmico de presenças, ausências e horas cumpridas.'],
    relatorios: ['Relatórios', 'Prévia institucional para relatórios gerenciais e acadêmicos.'],
    configuracoes: ['Configurações', 'Preferências do sistema, aparência e dados institucionais.']
  };

  let settings = loadSettings();
  let activeFilters = { query: '', student: 'all', status: 'all', attendanceStatus: 'all', report: 'geral' };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const studentById = (id) => students.find((student) => student.id === id);
  const supervisorById = (id) => supervisors.find((supervisor) => supervisor.id === id);
  const activityById = (id) => activities.find((activity) => activity.id === id);
  const currency = (value) => `${value}h`;
  const dateBR = (date) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
  const shortDate = (date) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)).replace('.', '');
  const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);

  function loadSettings() {
    try {
      return { ...baseSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
    } catch {
      return { ...baseSettings };
    }
  }

  function saveSettings(patch = {}) {
    settings = { ...settings, ...patch };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applySettings();
  }

  function resetSettings() {
    settings = { ...baseSettings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    applySettings();
    renderCurrentPage();
  }

  function restoreRecords() {
    localStorage.setItem(DATA_KEY, JSON.stringify({ restoredAt: new Date().toISOString(), students: students.length, activities: activities.length }));
    notify('Base de acompanhamento restaurada.');
    renderCurrentPage();
  }

  function clearRecords() {
    Object.keys(localStorage).filter((key) => key.startsWith('stageflow.')).forEach((key) => localStorage.removeItem(key));
    settings = { ...baseSettings };
    applySettings();
    notify('Registros acadêmicos locais foram limpos.');
    renderCurrentPage();
  }

  function themeMode() {
    if (settings.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return settings.theme === 'light' ? 'light' : 'dark';
  }

  function applySettings() {
    const theme = themeMode();
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.bsTheme = theme;
    document.documentElement.dataset.density = settings.density === 'compact' ? 'compact' : 'comfortable';
    document.documentElement.dataset.motion = settings.animations ? 'standard' : 'reduced';

    const panel = $('.stageflow-rescue');
    if (panel) {
      panel.dataset.theme = theme;
      panel.dataset.density = settings.density;
      panel.dataset.motion = settings.animations ? 'standard' : 'reduced';
      panel.style.setProperty('--sf-default-hours', settings.defaultHours);
    }
  }

  function hoursByStudent(studentId) {
    return activities.filter((activity) => activity.studentId === studentId).reduce((total, activity) => total + activity.hours, 0);
  }

  function attendanceFor(studentId) {
    return attendance.filter((record) => record.studentId === studentId);
  }

  function attendanceSummary(records = attendance) {
    const present = records.filter((record) => record.status === 'Presente').length;
    const absent = records.filter((record) => record.status === 'Ausente').length;
    const hours = records.reduce((total, record) => total + record.hours, 0);
    const percent = records.length ? Math.round((present / records.length) * 100) : 0;
    return { present, absent, hours, percent, total: records.length };
  }

  function groupedActivitiesByCategory() {
    return activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1;
      return acc;
    }, {});
  }

  function renderCurrentPage() {
    const page = document.body.dataset.page || 'dashboard';
    const root = $('.stageflow-rescue-body');
    const header = $('.stageflow-rescue-title');
    const subtitle = $('.stageflow-rescue-subtitle');
    const kicker = $('.stageflow-rescue-kicker');
    if (!root) return;

    const meta = pageMeta[page] || pageMeta.dashboard;
    header.textContent = page === 'dashboard' ? `${settings.projectName} · ${meta[0]}` : meta[0];
    subtitle.textContent = meta[1];
    kicker.textContent = settings.institution;

    const templates = {
      dashboard: renderDashboard,
      estagiarios: renderStudents,
      supervisores: renderSupervisors,
      atividades: renderActivities,
      frequencia: renderAttendance,
      relatorios: renderReports,
      configuracoes: renderSettings
    };

    root.innerHTML = templates[page]?.() ?? renderDashboard();
    bindPageEvents(page);
    applySettings();
  }

  function metric(label, value, detail, tone = '') {
    return `
      <article class="stageflow-card ${tone}">
        <span>${escape(label)}</span>
        <strong>${escape(value)}</strong>
        <small>${escape(detail)}</small>
      </article>
    `;
  }

  function progress(percent) {
    return `<div class="stageflow-progress"><span style="width:${Math.min(100, Math.max(0, percent))}%"></span></div>`;
  }

  function bar(label, value, max) {
    const width = max ? Math.round((value / max) * 100) : 0;
    return `
      <div class="stageflow-bar-row">
        <span>${escape(label)}</span>
        <div><i style="width:${width}%"></i></div>
        <strong>${escape(value)}</strong>
      </div>
    `;
  }

  function table(headers, rows) {
    return `
      <div class="stageflow-table-wrap">
        <table class="stageflow-table">
          <thead><tr>${headers.map((header) => `<th>${escape(header)}</th>`).join('')}</tr></thead>
          <tbody>${rows.join('')}</tbody>
        </table>
      </div>
    `;
  }

  function renderDashboard() {
    const totalHours = activities.reduce((total, activity) => total + activity.hours, 0);
    const activeStudents = students.filter((student) => ['Ativo', 'Em acompanhamento'].includes(student.status)).length;
    const freq = attendanceSummary();
    const categoryGroups = groupedActivitiesByCategory();
    const maxCategory = Math.max(...Object.values(categoryGroups));
    const hourRows = students.map((student) => ({ name: student.name.split(' ')[0], hours: hoursByStudent(student.id) }));
    const maxHours = Math.max(...hourRows.map((row) => row.hours));

    return `
      <section class="stageflow-grid four">
        ${metric('Estagiários ativos', activeStudents, `${students.length} cadastrados`)}
        ${metric('Supervisores', supervisors.length, 'rede acadêmica e técnica')}
        ${metric('Atividades', activities.length, '20/08/2025 a 17/09/2025')}
        ${metric('Horas registradas', currency(totalHours), `${freq.hours}h em frequência`)}
      </section>
      <section class="stageflow-grid two">
        <article class="stageflow-panel">
          <div class="stageflow-section-head">
            <div><h2>Meta geral de horas</h2><p>Progresso institucional sobre a carga de referência de ${settings.defaultHours}h por dia.</p></div>
            <span class="stageflow-pill">Semestre 2025.2</span>
          </div>
          <div class="stageflow-big">${Math.round((totalHours / 360) * 100)}%</div>
          ${progress(Math.round((totalHours / 360) * 100))}
          <div class="stageflow-inline-muted"><span>${currency(totalHours)} registradas</span><span>${currency(Math.max(0, 360 - totalHours))} restantes</span><span>360h previstas</span></div>
        </article>
        <article class="stageflow-panel">
          <div class="stageflow-section-head"><div><h2>Frequência acadêmica</h2><p>Presenças, ausências e horas acompanhadas.</p></div></div>
          <div class="stageflow-grid three compact">
            ${metric('Presenças', freq.present, `${freq.percent}% de frequência`)}
            ${metric('Ausências', freq.absent, `${freq.total} registros`)}
            ${metric('Horas', currency(freq.hours), 'cumpridas')}
          </div>
        </article>
      </section>
      <section class="stageflow-grid two">
        <article class="stageflow-panel">
          <div class="stageflow-section-head"><div><h2>Horas por estagiário</h2><p>Indicador alimentado pelos registros de atividades.</p></div></div>
          <div class="stageflow-bars">${hourRows.map((row) => bar(row.name, row.hours, maxHours)).join('')}</div>
        </article>
        <article class="stageflow-panel">
          <div class="stageflow-section-head"><div><h2>Atividades por categoria</h2><p>Distribuição do acompanhamento em TI.</p></div></div>
          <div class="stageflow-bars">${Object.entries(categoryGroups).map(([label, value]) => bar(label, value, maxCategory)).join('')}</div>
        </article>
      </section>
      <article class="stageflow-panel">
        <div class="stageflow-section-head"><div><h2>Últimas atividades</h2><p>Clique em qualquer registro para abrir os detalhes.</p></div></div>
        ${renderActivityList(activities.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8))}
      </article>
    `;
  }

  function renderStudents() {
    const rows = students.map((student) => {
      const supervisor = supervisorById(student.supervisorId);
      const hours = hoursByStudent(student.id);
      const percent = Math.round((hours / student.requiredHours) * 100);
      return `
        <tr data-detail="student" data-id="${student.id}">
          <td><strong>${escape(student.name)}</strong><small>${escape(student.registration)}</small></td>
          <td>${escape(student.course)}</td>
          <td>${escape(student.email)}<small>${escape(student.phone)}</small></td>
          <td>${escape(supervisor?.name)}</td>
          <td>${currency(hours)} ${progress(percent)}</td>
          <td><span class="stageflow-pill">${escape(student.status)}</span></td>
        </tr>
      `;
    });

    return `
      ${toolbar('Buscar nome, matrícula ou e-mail')}
      ${table(['Estagiário', 'Curso', 'Contato', 'Supervisor', 'Progresso', 'Status'], rows)}
    `;
  }

  function renderSupervisors() {
    const rows = supervisors.map((supervisor) => {
      const relatedStudents = students.filter((student) => student.supervisorId === supervisor.id);
      const relatedActivities = activities.filter((activity) => activity.supervisorId === supervisor.id);
      return `
        <tr data-detail="supervisor" data-id="${supervisor.id}">
          <td><strong>${escape(supervisor.name)}</strong><small>${escape(supervisor.email)}</small></td>
          <td>${escape(supervisor.role)}</td>
          <td>${escape(supervisor.sector)}<small>${escape(supervisor.company)}</small></td>
          <td>${escape(supervisor.phone)}</td>
          <td>${relatedStudents.length} aluno(s)</td>
          <td>${relatedActivities.length} atividade(s)</td>
        </tr>
      `;
    });

    return `
      ${toolbar('Buscar supervisor ou setor')}
      ${table(['Supervisor', 'Cargo', 'Setor', 'Telefone', 'Alunos', 'Atividades'], rows)}
    `;
  }

  function renderActivities() {
    const options = [...new Set(activities.map((activity) => activity.category))].sort();
    return `
      <div class="stageflow-toolbar">
        <input class="stageflow-input" data-filter="query" type="search" placeholder="Pesquisar atividade ou aluno">
        <select class="stageflow-input" data-filter="student">
          <option value="all">Todos os estagiários</option>
          ${students.map((student) => `<option value="${student.id}">${escape(student.name)}</option>`).join('')}
        </select>
        <select class="stageflow-input" data-filter="status">
          <option value="all">Todos os status</option>
          <option value="Validado">Validado</option>
          <option value="Em revisão">Em revisão</option>
          <option value="Pendente de conferência">Pendente de conferência</option>
        </select>
      </div>
      <div data-activity-results>${renderActivityList(filteredActivities())}</div>
    `;
  }

  function filteredActivities() {
    return activities.filter((activity) => {
      const student = studentById(activity.studentId);
      const haystack = normalize(`${activity.description} ${activity.category} ${activity.status} ${student?.name}`);
      const matchesQuery = !activeFilters.query || haystack.includes(normalize(activeFilters.query));
      const matchesStudent = activeFilters.student === 'all' || activity.studentId === activeFilters.student;
      const matchesStatus = activeFilters.status === 'all' || activity.status === activeFilters.status;
      return matchesQuery && matchesStudent && matchesStatus;
    }).sort((a, b) => `${b.date}${b.id}`.localeCompare(`${a.date}${a.id}`));
  }

  function renderActivityList(list) {
    return `
      <div class="stageflow-list">
        ${list.map((activity) => {
          const student = studentById(activity.studentId);
          return `
            <button class="stageflow-list-item" type="button" data-detail="activity" data-id="${activity.id}">
              <span class="stageflow-date">${shortDate(activity.date)}</span>
              <span><strong>${escape(activity.description)}</strong><small>${escape(student?.name)} · ${escape(activity.category)} · ${activity.start} às ${activity.end}</small></span>
              <span class="stageflow-pill">${activity.hours}h</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderAttendance() {
    const summary = attendanceSummary(filteredAttendance());
    return `
      <section class="stageflow-grid four">
        ${metric('Presenças', summary.present, `${summary.percent}% de frequência`)}
        ${metric('Ausências', summary.absent, `${summary.total} registros filtrados`)}
        ${metric('Horas cumpridas', currency(summary.hours), 'frequência acadêmica')}
        ${metric('Carga diária', `${settings.defaultHours}h`, '08:00 às 14:00')}
      </section>
      <div class="stageflow-toolbar">
        <select class="stageflow-input" data-filter="student">
          <option value="all">Todos os estagiários</option>
          ${students.map((student) => `<option value="${student.id}">${escape(student.name)}</option>`).join('')}
        </select>
        <select class="stageflow-input" data-filter="attendanceStatus">
          <option value="all">Todos os status</option>
          <option value="Presente">Presença</option>
          <option value="Ausente">Ausência</option>
        </select>
      </div>
      <div data-attendance-results>${renderAttendanceGrid(filteredAttendance())}</div>
    `;
  }

  function filteredAttendance() {
    const status = activeFilters.attendanceStatus || 'all';
    return attendance.filter((record) => {
      const matchesStudent = activeFilters.student === 'all' || record.studentId === activeFilters.student;
      const matchesStatus = status === 'all' || record.status === status;
      return matchesStudent && matchesStatus;
    });
  }

  function renderAttendanceGrid(list) {
    return `
      <div class="stageflow-calendar">
        ${list.slice(0, 84).map((record) => {
          const student = studentById(record.studentId);
          return `
            <button class="stageflow-calendar-day ${record.status === 'Ausente' ? 'danger' : ''}" type="button" data-detail="attendance" data-id="${record.id}">
              <strong>${shortDate(record.date)}</strong>
              <span>${escape(record.status)} · ${record.hours}h</span>
              <small>${escape(student?.name.split(' ').slice(0, 2).join(' '))}</small>
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderReports() {
    return `
      <div class="stageflow-toolbar">
        <select class="stageflow-input" data-filter="report">
          <option value="geral">Relatório geral</option>
          <option value="individual">Relatório por estagiário</option>
          <option value="periodo">Relatório por período</option>
          <option value="frequencia">Relatório de frequência</option>
          <option value="atividades">Relatório de atividades</option>
        </select>
        <select class="stageflow-input" data-filter="student">
          <option value="all">Todos os estagiários</option>
          ${students.map((student) => `<option value="${student.id}">${escape(student.name)}</option>`).join('')}
        </select>
        <button class="stageflow-button" type="button" data-action="export-report">Exportar PDF</button>
      </div>
      <div data-report-preview>${reportPreview()}</div>
    `;
  }

  function reportPreview() {
    const selectedStudent = activeFilters.student !== 'all' ? studentById(activeFilters.student) : null;
    const records = selectedStudent ? activities.filter((activity) => activity.studentId === selectedStudent.id) : activities;
    const freq = selectedStudent ? attendanceFor(selectedStudent.id) : attendance;
    const summary = attendanceSummary(freq);
    const title = {
      geral: 'Relatório Geral de Estágios',
      individual: 'Relatório Individual de Estágio',
      periodo: 'Relatório por Período',
      frequencia: 'Relatório de Frequência',
      atividades: 'Relatório de Atividades'
    }[activeFilters.report || 'geral'];

    return `
      <article class="stageflow-report">
        <div class="stageflow-report-header">
          <div><h2>${title}</h2><p>${escape(settings.institution)} · Estágio Supervisionado Obrigatório</p></div>
          <img src="../assets/images/logo-unic-mark.png?v=1" alt="UNIC">
        </div>
        <section class="stageflow-grid four compact">
          ${metric('Estagiários', selectedStudent ? 1 : students.length, selectedStudent?.name ?? 'base completa')}
          ${metric('Atividades', records.length, 'registros filtrados')}
          ${metric('Horas', currency(records.reduce((total, item) => total + item.hours, 0)), 'em atividades')}
          ${metric('Frequência', `${summary.percent}%`, `${summary.present} presenças`)}
        </section>
        <h3>Atividades consideradas</h3>
        ${renderActivityList(records.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8))}
        <p class="stageflow-disclaimer">Documento preparado para acompanhamento acadêmico e conferência institucional.</p>
      </article>
    `;
  }

  function renderSettings() {
    const themeCards = [
      ['light', 'Tema Claro', 'Interface clara para ambientes iluminados.'],
      ['dark', 'Tema Escuro', 'Interface escura para uso contínuo.'],
      ['system', 'Preferência do navegador', 'Acompanha a configuração do dispositivo.']
    ];

    return `
      <section class="stageflow-grid two">
        <article class="stageflow-panel">
          <div class="stageflow-section-head"><div><h2>Aparência</h2><p>Escolha tema, densidade e animações da interface.</p></div></div>
          <div class="stageflow-choice-grid">
            ${themeCards.map(([value, title, text]) => `
              <button class="stageflow-choice ${settings.theme === value ? 'active' : ''}" type="button" data-setting-theme="${value}">
                <strong>${title}</strong><span>${text}</span>
              </button>
            `).join('')}
          </div>
          <div class="stageflow-form-grid">
            <label>Densidade
              <select class="stageflow-input" data-setting="density">
                <option value="comfortable" ${settings.density === 'comfortable' ? 'selected' : ''}>Confortável</option>
                <option value="compact" ${settings.density === 'compact' ? 'selected' : ''}>Compacta</option>
              </select>
            </label>
            <label class="stageflow-check">
              <input type="checkbox" data-setting="animations" ${settings.animations ? 'checked' : ''}>
              <span>Ativar animações da interface</span>
            </label>
          </div>
        </article>
        <article class="stageflow-panel">
          <div class="stageflow-section-head"><div><h2>Configurações institucionais</h2><p>Dados exibidos no painel e nos relatórios.</p></div></div>
          <div class="stageflow-form-grid">
            <label>Nome exibido do projeto
              <input class="stageflow-input" data-setting="projectName" value="${escape(settings.projectName)}">
            </label>
            <label>Instituição exibida
              <input class="stageflow-input" data-setting="institution" value="${escape(settings.institution)}">
            </label>
            <label>Carga horária padrão do estágio
              <input class="stageflow-input" data-setting="defaultHours" type="number" min="1" value="${escape(settings.defaultHours)}">
            </label>
          </div>
        </article>
      </section>
      <article class="stageflow-panel">
        <div class="stageflow-section-head"><div><h2>Base de acompanhamento</h2><p>Gerencie registros acadêmicos e preferências visuais.</p></div></div>
        <div class="stageflow-actions">
          <button class="stageflow-button" type="button" data-action="restore-records">Restaurar registros iniciais</button>
          <button class="stageflow-button" type="button" data-action="clear-records">Limpar registros locais</button>
          <button class="stageflow-button secondary" type="button" data-action="reset-preferences">Redefinir preferências visuais</button>
        </div>
      </article>
    `;
  }

  function toolbar(placeholder) {
    return `
      <div class="stageflow-toolbar">
        <input class="stageflow-input" data-filter="query" type="search" placeholder="${escape(placeholder)}">
        <span class="stageflow-help">Clique em uma linha para abrir os detalhes.</span>
      </div>
    `;
  }

  function bindPageEvents(page) {
    $$('[data-detail]').forEach((item) => item.addEventListener('click', () => openDetails(item.dataset.detail, item.dataset.id)));
    $$('[data-filter]').forEach((field) => {
      field.value = activeFilters[field.dataset.filter] ?? (field.dataset.filter === 'student' ? 'all' : '');
      field.addEventListener('input', onFilterChange);
      field.addEventListener('change', onFilterChange);
    });
    $$('[data-setting]').forEach((field) => {
      field.addEventListener('change', () => {
        const key = field.dataset.setting;
        const value = field.type === 'checkbox' ? field.checked : field.type === 'number' ? Number(field.value || 1) : field.value;
        saveSettings({ [key]: value });
        if (['projectName', 'institution', 'defaultHours'].includes(key)) renderCurrentPage();
      });
    });
    $$('[data-setting-theme]').forEach((button) => button.addEventListener('click', () => {
      saveSettings({ theme: button.dataset.settingTheme });
      renderCurrentPage();
    }));
    $$('[data-action]').forEach((button) => button.addEventListener('click', () => handleAction(button.dataset.action)));

    if (page === 'relatorios') {
      $('[data-report-preview]')?.addEventListener('click', (event) => {
        const target = event.target.closest('[data-detail]');
        if (target) openDetails(target.dataset.detail, target.dataset.id);
      });
    }
  }

  function onFilterChange(event) {
    activeFilters[event.target.dataset.filter] = event.target.value;
    const page = document.body.dataset.page;
    if (page === 'atividades') $('[data-activity-results]').innerHTML = renderActivityList(filteredActivities());
    if (page === 'frequencia') $('[data-attendance-results]').innerHTML = renderAttendanceGrid(filteredAttendance());
    if (page === 'relatorios') $('[data-report-preview]').innerHTML = reportPreview();
    if (['dashboard', 'estagiarios', 'supervisores'].includes(page)) filterTables();
    bindPageEvents(page);
  }

  function filterTables() {
    const query = normalize(activeFilters.query);
    $$('tbody tr').forEach((row) => {
      row.hidden = query && !normalize(row.textContent).includes(query);
    });
  }

  function handleAction(action) {
    if (action === 'restore-records') restoreRecords();
    if (action === 'clear-records') clearRecords();
    if (action === 'reset-preferences') resetSettings();
    if (action === 'export-report') exportReport();
  }

  function openDetails(type, id) {
    const map = {
      student: studentDetails,
      supervisor: supervisorDetails,
      activity: activityDetails,
      attendance: attendanceDetails
    };
    const detail = map[type]?.(id);
    if (!detail) return;

    closeDrawer();
    const drawer = document.createElement('aside');
    drawer.className = 'stageflow-drawer';
    drawer.innerHTML = `
      <button class="stageflow-drawer-close" type="button" aria-label="Fechar">×</button>
      <span class="stageflow-rescue-kicker">${escape(detail.kicker)}</span>
      <h2>${escape(detail.title)}</h2>
      <p>${escape(detail.subtitle)}</p>
      ${detail.body}
    `;
    const backdrop = document.createElement('div');
    backdrop.className = 'stageflow-drawer-backdrop';
    backdrop.addEventListener('click', closeDrawer);
    drawer.querySelector('button').addEventListener('click', closeDrawer);
    drawer.querySelectorAll('[data-detail]').forEach((item) => {
      item.addEventListener('click', () => openDetails(item.dataset.detail, item.dataset.id));
    });
    document.body.append(backdrop, drawer);
  }

  function closeDrawer() {
    $('.stageflow-drawer')?.remove();
    $('.stageflow-drawer-backdrop')?.remove();
  }

  function facts(items) {
    return `<div class="stageflow-facts">${items.map(([label, value]) => `<div><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join('')}</div>`;
  }

  function studentDetails(id) {
    const student = studentById(id);
    if (!student) return null;
    const supervisor = supervisorById(student.supervisorId);
    const studentActivities = activities.filter((activity) => activity.studentId === id);
    const records = attendanceFor(id);
    const freq = attendanceSummary(records);
    const hours = hoursByStudent(id);
    const percent = Math.round((hours / student.requiredHours) * 100);
    return {
      kicker: 'Detalhes do estagiário',
      title: student.name,
      subtitle: `${student.course} · matrícula ${student.registration}`,
      body: `
        ${facts([
          ['E-mail', student.email],
          ['Telefone', student.phone],
          ['Status', student.status],
          ['Supervisor vinculado', supervisor?.name],
          ['Carga horária obrigatória', currency(student.requiredHours)],
          ['Horas cumpridas em atividades', currency(hours)],
          ['Progresso', `${percent}%`],
          ['Frequência', `${freq.percent}% (${freq.present} presenças)`]
        ])}
        ${progress(percent)}
        <h3>Atividades recentes</h3>
        ${renderActivityList(studentActivities.slice(-4).reverse())}
        <h3>Observações acadêmicas</h3>
        <p>${escape(student.notes)}</p>
      `
    };
  }

  function supervisorDetails(id) {
    const supervisor = supervisorById(id);
    if (!supervisor) return null;
    const relatedStudents = students.filter((student) => student.supervisorId === id);
    const relatedActivities = activities.filter((activity) => activity.supervisorId === id);
    return {
      kicker: 'Detalhes do supervisor',
      title: supervisor.name,
      subtitle: `${supervisor.role} · ${supervisor.sector}`,
      body: `
        ${facts([
          ['E-mail', supervisor.email],
          ['Telefone', supervisor.phone],
          ['Empresa', supervisor.company],
          ['Alunos acompanhados', relatedStudents.length],
          ['Atividades relacionadas', relatedActivities.length]
        ])}
        <h3>Alunos acompanhados</h3>
        <div class="stageflow-chip-list">${relatedStudents.map((student) => `<span>${escape(student.name)}</span>`).join('')}</div>
        <h3>Observações</h3>
        <p>${escape(supervisor.notes)}</p>
      `
    };
  }

  function activityDetails(id) {
    const activity = activityById(id);
    if (!activity) return null;
    const student = studentById(activity.studentId);
    const supervisor = supervisorById(activity.supervisorId);
    return {
      kicker: 'Detalhes da atividade',
      title: activity.category,
      subtitle: activity.description,
      body: facts([
        ['Data', dateBR(activity.date)],
        ['Horário', `${activity.start} às ${activity.end}`],
        ['Estagiário', student?.name],
        ['Supervisor', supervisor?.name],
        ['Categoria', activity.category],
        ['Carga horária', currency(activity.hours)],
        ['Status', activity.status],
        ['Observações', activity.notes]
      ])
    };
  }

  function attendanceDetails(id) {
    const record = attendance.find((item) => item.id === id);
    if (!record) return null;
    const student = studentById(record.studentId);
    const activity = activityById(record.activityId);
    return {
      kicker: 'Detalhes da frequência',
      title: student?.name,
      subtitle: `${dateBR(record.date)} · ${record.status}`,
      body: facts([
        ['Aluno', student?.name],
        ['Data', dateBR(record.date)],
        ['Entrada', record.start],
        ['Saída', record.end],
        ['Total de horas', currency(record.hours)],
        ['Status', record.status],
        ['Atividade relacionada', activity?.description ?? 'Registro de frequência sem atividade vinculada'],
        ['Observação', record.notes]
      ])
    };
  }

  function notify(message) {
    const toast = document.createElement('div');
    toast.className = 'stageflow-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  function exportReport() {
    const content = $('.stageflow-report')?.innerText || 'Relatório StageFlow';
    if (window.jspdf?.jsPDF) {
      const doc = new window.jspdf.jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.text(`${settings.projectName} - Relatório Acadêmico`, 15, 18);
      doc.setFont('helvetica', 'normal');
      doc.text(doc.splitTextToSize(content, 180), 15, 30);
      doc.setFontSize(9);
      doc.text(`${settings.institution} · Estágio Supervisionado Obrigatório`, 15, 285);
      doc.save('stageflow-relatorio-academico.pdf');
      notify('Relatório exportado em PDF.');
      return;
    }
    window.print();
  }

  function installStyles() {
    if ($('#stageflow-rescue-styles')) return;
    const style = document.createElement('style');
    style.id = 'stageflow-rescue-styles';
    style.textContent = css();
    document.head.appendChild(style);
  }

  function css() {
    return `
      .stageflow-rescue {
        box-sizing: border-box;
        position: fixed;
        inset: 0 0 0 276px;
        z-index: 5000;
        display: block;
        overflow: auto;
        padding: 24px clamp(18px, 3vw, 34px) 42px;
        color: var(--sf-text);
        background: radial-gradient(circle at top left, var(--sf-glow), transparent 30%), linear-gradient(180deg, var(--sf-bg), var(--sf-bg-soft));
        --sf-bg: #101114;
        --sf-bg-soft: #15171b;
        --sf-surface: rgba(26, 29, 35, .78);
        --sf-surface-strong: #20242c;
        --sf-border: rgba(255, 255, 255, .09);
        --sf-border-strong: rgba(255, 255, 255, .16);
        --sf-text: #f5f7fb;
        --sf-muted: #a5adba;
        --sf-soft: #7f8897;
        --sf-accent: #39c7f4;
        --sf-success: #52d273;
        --sf-glow: rgba(57, 199, 244, .10);
      }
      .stageflow-rescue[data-theme="light"] {
        --sf-bg: #f6f7fb;
        --sf-bg-soft: #eef1f7;
        --sf-surface: rgba(255, 255, 255, .84);
        --sf-surface-strong: #ffffff;
        --sf-border: rgba(24, 32, 48, .10);
        --sf-border-strong: rgba(24, 32, 48, .16);
        --sf-text: #171a21;
        --sf-muted: #5f6978;
        --sf-soft: #7b8492;
        --sf-accent: #087ea4;
        --sf-success: #17803a;
        --sf-glow: rgba(8, 126, 164, .10);
      }
      .stageflow-rescue[data-density="compact"] { font-size: 14px; }
      .stageflow-rescue[data-density="compact"] .stageflow-panel,
      .stageflow-rescue[data-density="compact"] .stageflow-card { padding: 14px; }
      .stageflow-rescue[data-motion="reduced"] * { animation: none !important; transition: none !important; }
      .stageflow-rescue * { box-sizing: border-box; min-width:0; }
      .stageflow-rescue-header { display:flex; align-items:center; justify-content:space-between; gap:18px; margin-bottom:22px; padding-bottom:18px; border-bottom:1px solid var(--sf-border); }
      .stageflow-rescue-header > div { min-width:0; }
      .stageflow-rescue-kicker { display:block; margin-bottom:4px; color:var(--sf-soft); font-size:.78rem; }
      .stageflow-rescue h1 { margin:0; color:var(--sf-text); font-size:clamp(1.55rem, 3vw, 2.2rem); line-height:1.1; overflow-wrap:anywhere; }
      .stageflow-rescue h2 { margin:0; color:var(--sf-text); font-size:1.05rem; }
      .stageflow-rescue h3 { margin:20px 0 10px; color:var(--sf-text); font-size:.96rem; }
      .stageflow-rescue p, .stageflow-rescue small { color:var(--sf-muted); overflow-wrap:anywhere; }
      .stageflow-rescue-logo { width:58px; height:80px; object-fit:contain; opacity:.92; }
      .stageflow-grid { display:grid; gap:16px; margin-bottom:18px; }
      .stageflow-grid.two { grid-template-columns:repeat(2, minmax(0, 1fr)); }
      .stageflow-grid.three { grid-template-columns:repeat(3, minmax(0, 1fr)); }
      .stageflow-grid.four { grid-template-columns:repeat(4, minmax(0, 1fr)); }
      .stageflow-grid.compact { gap:10px; margin-bottom:0; }
      .stageflow-card, .stageflow-panel, .stageflow-table-wrap, .stageflow-report { border:1px solid var(--sf-border); border-radius:8px; background:var(--sf-surface); box-shadow:0 18px 50px rgba(11, 18, 32, .18); backdrop-filter:blur(18px); }
      .stageflow-card { display:grid; gap:7px; min-height:124px; padding:18px; overflow:hidden; }
      .stageflow-card span, .stageflow-card small { color:var(--sf-muted); }
      .stageflow-card strong { color:var(--sf-text); font-size:2rem; line-height:1; overflow-wrap:anywhere; }
      .stageflow-panel, .stageflow-report { padding:20px; margin-bottom:18px; }
      .stageflow-section-head { display:flex; justify-content:space-between; gap:16px; margin-bottom:14px; }
      .stageflow-inline-muted { display:flex; flex-wrap:wrap; justify-content:space-between; gap:10px; margin-top:10px; color:var(--sf-muted); font-size:.86rem; }
      .stageflow-big { margin-bottom:10px; color:var(--sf-text); font-size:3rem; font-weight:800; line-height:1; }
      .stageflow-progress { width:100%; height:9px; overflow:hidden; border-radius:99px; background:rgba(127, 136, 151, .18); }
      .stageflow-progress span { display:block; height:100%; border-radius:99px; background:linear-gradient(90deg, var(--sf-accent), var(--sf-success)); }
      .stageflow-bars { display:grid; gap:10px; }
      .stageflow-bar-row { display:grid; grid-template-columns:minmax(92px, 130px) minmax(0, 1fr) 44px; align-items:center; gap:10px; color:var(--sf-muted); }
      .stageflow-bar-row div { height:10px; overflow:hidden; border-radius:99px; background:rgba(127, 136, 151, .18); }
      .stageflow-bar-row i { display:block; height:100%; border-radius:99px; background:var(--sf-accent); }
      .stageflow-toolbar { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:16px; padding:14px; border:1px solid var(--sf-border); border-radius:8px; background:var(--sf-surface); }
      .stageflow-input { flex:1 1 220px; min-height:40px; min-width:220px; max-width:100%; color:var(--sf-text); border:1px solid var(--sf-border); border-radius:6px; background:rgba(127, 136, 151, .10); padding:8px 10px; }
      .stageflow-help { flex:1 1 220px; color:var(--sf-soft); font-size:.84rem; overflow-wrap:anywhere; }
      .stageflow-table-wrap { max-width:100%; overflow-x:auto; }
      .stageflow-table { width:100%; min-width:720px; border-collapse:collapse; }
      .stageflow-table th, .stageflow-table td { padding:13px 12px; border-bottom:1px solid var(--sf-border); color:var(--sf-text); text-align:left; vertical-align:top; overflow-wrap:anywhere; }
      .stageflow-table th { color:var(--sf-soft); font-size:.74rem; text-transform:uppercase; background:rgba(127, 136, 151, .10); }
      .stageflow-table tr { cursor:pointer; }
      .stageflow-table tr:hover td { background:rgba(127, 136, 151, .08); }
      .stageflow-table small { display:block; margin-top:3px; }
      .stageflow-pill { display:inline-flex; align-items:center; min-height:26px; padding:4px 9px; color:var(--sf-success); border:1px solid var(--sf-border); border-radius:999px; font-size:.78rem; font-weight:700; white-space:nowrap; }
      .stageflow-list { display:grid; gap:12px; }
      .stageflow-list-item { display:grid; grid-template-columns:72px minmax(0, 1fr) auto; gap:12px; align-items:center; width:100%; padding:13px; color:var(--sf-text); border:1px solid var(--sf-border); border-radius:8px; background:rgba(127, 136, 151, .08); text-align:left; }
      .stageflow-list-item:hover { border-color:var(--sf-border-strong); }
      .stageflow-list-item strong, .stageflow-list-item span { overflow-wrap:anywhere; }
      .stageflow-list-item small { display:block; margin-top:4px; }
      .stageflow-date { display:grid; min-height:48px; place-items:center; color:var(--sf-accent); border-radius:8px; background:var(--sf-surface-strong); font-weight:800; text-align:center; text-transform:capitalize; }
      .stageflow-calendar { display:grid; grid-template-columns:repeat(7, minmax(0, 1fr)); gap:10px; }
      .stageflow-calendar-day { display:grid; gap:6px; min-height:92px; padding:12px; color:var(--sf-text); border:1px solid var(--sf-border); border-radius:8px; background:var(--sf-surface); text-align:left; overflow-wrap:anywhere; }
      .stageflow-calendar-day span { color:var(--sf-success); }
      .stageflow-calendar-day.danger span { color:#ff6b82; }
      .stageflow-report-header { display:flex; justify-content:space-between; gap:16px; margin-bottom:18px; padding-bottom:16px; border-bottom:1px solid var(--sf-border); }
      .stageflow-report-header > div { min-width:0; }
      .stageflow-report-header img { width:54px; height:74px; object-fit:contain; }
      .stageflow-disclaimer { margin-top:18px; padding-top:12px; border-top:1px solid var(--sf-border); font-size:.84rem; }
      .stageflow-choice-grid { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:10px; margin-bottom:16px; }
      .stageflow-choice { display:grid; gap:4px; padding:14px; color:var(--sf-text); border:1px solid var(--sf-border); border-radius:8px; background:rgba(127,136,151,.08); text-align:left; overflow-wrap:anywhere; }
      .stageflow-choice.active { border-color:var(--sf-accent); box-shadow:0 0 0 3px color-mix(in srgb, var(--sf-accent) 18%, transparent); }
      .stageflow-form-grid { display:grid; gap:12px; }
      .stageflow-form-grid label { display:grid; gap:6px; color:var(--sf-muted); font-size:.86rem; }
      .stageflow-check { display:flex !important; grid-template-columns:auto 1fr; align-items:center; gap:8px; }
      .stageflow-actions { display:flex; flex-wrap:wrap; gap:10px; }
      .stageflow-button { min-height:40px; max-width:100%; padding:8px 12px; color:#061017; border:1px solid var(--sf-accent); border-radius:6px; background:#71e0ff; font-weight:700; overflow-wrap:anywhere; }
      .stageflow-button.secondary { color:var(--sf-text); border-color:var(--sf-border); background:rgba(127,136,151,.12); }
      .stageflow-drawer-backdrop { position:fixed; inset:0; z-index:6000; background:rgba(0,0,0,.42); }
      .stageflow-drawer { box-sizing:border-box; position:fixed; top:0; right:0; bottom:0; z-index:6001; width:min(520px, 100vw); max-width:100vw; overflow:auto; padding:24px; color:var(--sf-text, #f5f7fb); background:var(--sf-surface-strong, #20242c); border-left:1px solid var(--sf-border, rgba(255,255,255,.12)); box-shadow:-24px 0 70px rgba(0,0,0,.34); }
      .stageflow-drawer-close { position:absolute; top:14px; right:14px; width:36px; height:36px; color:var(--sf-text, #f5f7fb); border:1px solid var(--sf-border, rgba(255,255,255,.12)); border-radius:8px; background:transparent; font-size:24px; line-height:1; }
      .stageflow-drawer h2, .stageflow-drawer h3 { color:var(--sf-text, #f5f7fb); overflow-wrap:anywhere; }
      .stageflow-drawer h2, .stageflow-drawer > p { padding-right:46px; }
      .stageflow-drawer p { color:var(--sf-muted, #a5adba); overflow-wrap:anywhere; }
      .stageflow-facts { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:10px; margin:18px 0; }
      .stageflow-facts div { min-width:0; padding:12px; border:1px solid var(--sf-border, rgba(255,255,255,.12)); border-radius:8px; background:rgba(127,136,151,.10); }
      .stageflow-facts span { display:block; margin-bottom:4px; color:var(--sf-soft, #7f8897); font-size:.76rem; }
      .stageflow-facts strong { display:block; color:var(--sf-text, #f5f7fb); font-size:.92rem; line-height:1.35; overflow-wrap:anywhere; word-break:break-word; }
      .stageflow-chip-list { display:flex; flex-wrap:wrap; gap:8px; }
      .stageflow-chip-list span { max-width:100%; padding:6px 9px; border:1px solid var(--sf-border); border-radius:999px; color:var(--sf-muted); overflow-wrap:anywhere; }
      .stageflow-toast { position:fixed; right:18px; bottom:18px; z-index:7000; padding:12px 14px; color:var(--sf-text, #f5f7fb); border:1px solid var(--sf-border, rgba(255,255,255,.12)); border-radius:8px; background:var(--sf-surface-strong, #20242c); box-shadow:0 18px 50px rgba(0,0,0,.25); }
      html[data-theme="light"] .stageflow-drawer { color:#171a21; background:#ffffff; border-left-color:rgba(24,32,48,.16); box-shadow:-24px 0 70px rgba(24,32,48,.18); }
      html[data-theme="light"] .stageflow-drawer-close { color:#171a21; border-color:rgba(24,32,48,.16); }
      html[data-theme="light"] .stageflow-drawer h2,
      html[data-theme="light"] .stageflow-drawer h3,
      html[data-theme="light"] .stageflow-facts strong { color:#171a21; }
      html[data-theme="light"] .stageflow-drawer p,
      html[data-theme="light"] .stageflow-chip-list span { color:#5f6978; }
      html[data-theme="light"] .stageflow-facts div,
      html[data-theme="light"] .stageflow-chip-list span { border-color:rgba(24,32,48,.12); background:rgba(24,32,48,.05); }
      html[data-theme="light"] .stageflow-facts span { color:#7b8492; }
      html[data-theme="light"] .stageflow-toast { color:#171a21; border-color:rgba(24,32,48,.12); background:#ffffff; box-shadow:0 18px 50px rgba(24,32,48,.18); }
      @media (max-width:1040px) { .stageflow-rescue { left:0; padding-top:88px; } .stageflow-grid.four, .stageflow-grid.three, .stageflow-grid.two, .stageflow-choice-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); } }
      @media (max-width:720px) {
        .stageflow-rescue { width:100vw; max-width:100vw; overflow-x:hidden; padding-top:32px; }
        .stageflow-rescue-header { display:grid; grid-template-columns:minmax(0, 1fr); align-items:start; }
        .stageflow-toolbar { display:grid; grid-template-columns:minmax(0, 1fr); }
        .stageflow-grid.four, .stageflow-grid.three, .stageflow-grid.two, .stageflow-choice-grid, .stageflow-calendar, .stageflow-facts { grid-template-columns:1fr; }
        .stageflow-list-item { grid-template-columns:1fr; }
        .stageflow-rescue-logo { display:none; }
        .stageflow-input { width:100%; min-width:0; }
        .stageflow-report-header { flex-direction:column; }
        .stageflow-actions .stageflow-button { flex:1 1 100%; }
        .stageflow-table-wrap { overflow-x:visible; }
        .stageflow-table,
        .stageflow-table tbody,
        .stageflow-table tr,
        .stageflow-table td { display:block; width:100%; min-width:0; }
        .stageflow-table thead { display:none; }
        .stageflow-table tr { padding:12px; border-bottom:1px solid var(--sf-border); }
        .stageflow-table td { padding:8px 0; border-bottom:0; }
        .stageflow-table td + td { border-top:1px solid rgba(127, 136, 151, .14); }
      }
      @media (max-width:520px) { .stageflow-rescue { padding-left:14px; padding-right:14px; } .stageflow-rescue-header { align-items:flex-start; } .stageflow-drawer { padding:20px 16px; } .stageflow-drawer h2, .stageflow-drawer > p { padding-right:42px; } .stageflow-bar-row { grid-template-columns:1fr; gap:6px; } .stageflow-pill { white-space:normal; } }
    `;
  }

  function renderShell() {
    if ($('.stageflow-rescue')) return;
    installStyles();
    const panel = document.createElement('main');
    panel.className = 'stageflow-rescue';
    panel.innerHTML = `
      <header class="stageflow-rescue-header">
        <div>
          <span class="stageflow-rescue-kicker"></span>
          <h1 class="stageflow-rescue-title"></h1>
          <p class="stageflow-rescue-subtitle"></p>
        </div>
        <img class="stageflow-rescue-logo" src="../assets/images/logo-unic-mark.png?v=1" alt="UNIC">
      </header>
      <div class="stageflow-rescue-body"></div>
    `;
    document.body.appendChild(panel);
    applySettings();
    renderCurrentPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderShell, { once: true });
  } else {
    renderShell();
  }
})();
