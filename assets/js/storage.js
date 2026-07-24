import { demoRecords } from './data/demoRecords.js?v=14';

const STORAGE_KEY = 'stageflow.data.v8';
const SESSION_KEY = 'stageflow.demo-session.v1';

const clone = (value) => JSON.parse(JSON.stringify(value));

const uid = (prefix) => {
  if (window.crypto?.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
};

const mergeState = (stored) => {
  const defaults = clone(demoRecords);
  const state = stored && typeof stored === 'object' ? stored : {};
  const collectionOrDefault = (name) => (
    Array.isArray(state[name]) ? state[name] : defaults[name]
  );

  const merged = {
    ...defaults,
    ...state,
    meta: { ...defaults.meta, ...state.meta },
    project: { ...defaults.project, ...state.project },
    profile: { ...defaults.profile, ...state.profile },
    preferences: { ...defaults.preferences, ...state.preferences },
    estagiarios: collectionOrDefault('estagiarios'),
    supervisores: collectionOrDefault('supervisores'),
    atividades: collectionOrDefault('atividades'),
    frequencias: collectionOrDefault('frequencias'),
    entregas: collectionOrDefault('entregas'),
    pendencias: collectionOrDefault('pendencias')
  };

  if (!merged.project.githubUrl || merged.project.githubUrl.includes('README.md') || merged.project.githubUrl.includes('seu-usuario')) {
    merged.project.githubUrl = defaults.project.githubUrl;
  }

  if (!/simulad/i.test(merged.project.presentationNotice) || !/privad/i.test(merged.project.presentationNotice)) {
    merged.project.presentationNotice = defaults.project.presentationNotice;
  }

  if (!/simulad/i.test(merged.project.privacyNotice) || !/privad/i.test(merged.project.privacyNotice)) {
    merged.project.privacyNotice = defaults.project.privacyNotice;
  }

  return merged;
};

export const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const initialState = clone(demoRecords);
    saveState(initialState);
    return initialState;
  }

  try {
    return mergeState(JSON.parse(raw));
  } catch (error) {
    console.warn('StageFlow: registros locais inválidos, restaurando base de apresentação.', error);
    const fallback = clone(demoRecords);
    saveState(fallback);
    return fallback;
  }
};

export const saveState = (state) => {
  const nextState = mergeState(state);
  nextState.meta.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new CustomEvent('stageflow:datachange', { detail: nextState }));
  return nextState;
};

export const resetState = () => {
  const freshState = clone(demoRecords);
  saveState(freshState);
  return freshState;
};

export const clearState = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('stageflow.theme');
};

export const readDemoSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    if (!session || typeof session !== 'object' || !session.name || !session.role) return null;
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const saveDemoSession = (session) => {
  const safeSession = {
    name: String(session.name || 'Visitante').trim(),
    role: String(session.role || 'Coordenação').trim(),
    email: String(session.email || '').trim().toLowerCase(),
    mode: 'demonstracao-local',
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
  window.dispatchEvent(new CustomEvent('stageflow:sessionchange', { detail: safeSession }));
  return safeSession;
};

export const clearDemoSession = () => {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('stageflow:sessionchange', { detail: null }));
};

export const getCollection = (collectionName) => loadState()[collectionName] ?? [];

export const saveCollection = (collectionName, collection) => {
  const state = loadState();
  state[collectionName] = collection;
  return saveState(state)[collectionName];
};

export const createRecord = (collectionName, record, prefix = 'reg') => {
  const collection = getCollection(collectionName);
  const now = new Date().toISOString();
  const nextRecord = {
    id: uid(prefix),
    ...record,
    createdAt: now,
    updatedAt: now
  };

  saveCollection(collectionName, [nextRecord, ...collection]);
  return nextRecord;
};

export const updateRecord = (collectionName, id, patch) => {
  const collection = getCollection(collectionName);
  const updated = collection.map((item) => (
    item.id === id
      ? { ...item, ...patch, updatedAt: new Date().toISOString() }
      : item
  ));

  saveCollection(collectionName, updated);
  return updated.find((item) => item.id === id);
};

export const deleteRecord = (collectionName, id) => {
  const collection = getCollection(collectionName);
  saveCollection(collectionName, collection.filter((item) => item.id !== id));
};

export const updateProfile = (profile) => {
  const state = loadState();
  state.profile = { ...state.profile, ...profile };
  return saveState(state).profile;
};

export const updateProject = (project) => {
  const state = loadState();
  state.project = { ...state.project, ...project };
  return saveState(state).project;
};

export const updatePreferences = (preferences) => {
  const state = loadState();
  state.preferences = { ...state.preferences, ...preferences };
  return saveState(state).preferences;
};

export const getEstagiarioById = (id, state = loadState()) => (
  state.estagiarios.find((estagiario) => estagiario.id === id)
);

export const getEstagiarioNome = (id, state = loadState()) => (
  getEstagiarioById(id, state)?.nome ?? 'Estagiario nao informado'
);

export const getAtividadesComEstagiario = (state = loadState()) => (
  state.atividades.map((atividade) => ({
    ...atividade,
    tipo: atividade.tipo ?? 'Atividade',
    estagiario: getEstagiarioNome(atividade.estagiarioId, state)
  }))
);

export const getHorasPorEstagiario = (state = loadState()) => (
  state.estagiarios.map((estagiario) => {
    const horas = state.atividades
      .filter((atividade) => atividade.estagiarioId === estagiario.id)
      .reduce((total, atividade) => total + Number(atividade.horas || 0), 0);

    return { ...estagiario, horas };
  })
);

export const getResumo = (state = loadState()) => {
  const totalHoras = state.atividades.reduce((total, atividade) => total + Number(atividade.horas || 0), 0);
  const horasFrequencia = state.frequencias
    .filter((item) => item.status === 'presente')
    .reduce((total, item) => total + Number(item.horas || 0), 0);
  const ativos = state.estagiarios.filter((item) => ['Ativo', 'Em acompanhamento'].includes(item.status)).length;

  return {
    totalEstagiarios: state.estagiarios.length,
    totalSupervisores: state.supervisores.length,
    totalAtividades: state.atividades.length,
    totalHoras,
    horasFrequencia,
    ativos,
    pendentes: state.estagiarios.filter((item) => item.status?.startsWith('Pendente')).length,
    finalizados: state.estagiarios.filter((item) => item.status === 'Finalizado').length,
    metaHoras: Number(state.profile.goalHours || 360)
  };
};

export const getHorasPorSemana = (state = loadState()) => {
  const weeks = new Map();

  state.atividades.forEach((atividade) => {
    const date = new Date(`${atividade.data}T00:00:00`);
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil((((date - firstDay) / 86400000) + firstDay.getDay() + 1) / 7);
    const key = `Sem. ${String(week).padStart(2, '0')}`;
    weeks.set(key, (weeks.get(key) || 0) + Number(atividade.horas || 0));
  });

  return [...weeks.entries()].slice(-6).map(([label, horas]) => ({ label, horas }));
};

export const getAtividadesPorTipo = (state = loadState()) => {
  const groups = state.atividades.reduce((acc, atividade) => {
    const tipo = atividade.tipo ?? 'Atividade';
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groups).map(([tipo, total]) => ({ tipo, total }));
};

export const upsertFrequencia = (record) => {
  const state = loadState();
  const now = new Date().toISOString();
  const existing = state.frequencias.find((item) => (
    item.data === record.data && item.estagiarioId === record.estagiarioId
  ));

  if (record.status === 'sem-registro') {
    state.frequencias = state.frequencias.filter((item) => item.id !== existing?.id);
    saveState(state);
    return null;
  }

  if (existing) {
    state.frequencias = state.frequencias.map((item) => (
      item.id === existing.id
        ? { ...item, ...record, updatedAt: now }
        : item
    ));
    saveState(state);
    return state.frequencias.find((item) => item.id === existing.id);
  }

  const nextRecord = {
    id: uid('freq'),
    ...record,
    createdAt: now,
    updatedAt: now
  };

  state.frequencias = [nextRecord, ...state.frequencias];
  saveState(state);
  return nextRecord;
};

export const exportState = () => clone(loadState());
