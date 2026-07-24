import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const cdpPort = process.env.STAGEFLOW_CDP_PORT || '9222';
const baseUrl = process.env.STAGEFLOW_BASE_URL || 'http://127.0.0.1:5500';
const target = await fetch(
  `http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent(`${baseUrl}/pages/acesso.html`)}`,
  { method: 'PUT' }
).then((response) => {
  if (!response.ok) throw new Error(`CDP indisponível: HTTP ${response.status}`);
  return response.json();
});

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const browserErrors = [];
let commandId = 0;

await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }

  if (message.method === 'Runtime.exceptionThrown') {
    browserErrors.push(message.params.exceptionDetails.text);
  }
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
    browserErrors.push(message.params.entry.text);
  }
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) {
    browserErrors.push(`HTTP ${message.params.response.status}: ${message.params.response.url}`);
  }
  if (
    message.method === 'Network.loadingFailed'
    && !message.params.canceled
    && !message.params.errorText.includes('ERR_ABORTED')
  ) {
    browserErrors.push(`${message.params.errorText}: ${message.params.type}`);
  }
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++commandId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });

  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

const waitFor = async (expression, timeout = 7000) => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    try {
      if (await evaluate(expression)) return;
    } catch {
      // The execution context is briefly unavailable during navigation.
    }
    await new Promise((resolve) => setTimeout(resolve, 80));
  }
  throw new Error(`Tempo esgotado aguardando: ${expression}`);
};

const navigate = async (path) => {
  await send('Page.navigate', { url: `${baseUrl}${path}` });
  await waitFor("document.readyState === 'complete' && document.body.classList.contains('page-ready')");
};

try {
  await Promise.all([
    send('Page.enable'),
    send('Runtime.enable'),
    send('Network.enable'),
    send('Log.enable')
  ]);

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });
  await navigate('/pages/acesso.html');

  assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true);
  assert.equal(await evaluate("document.querySelectorAll('[data-auth-mode]').length"), 2);
  assert.equal(await evaluate("document.querySelectorAll('[data-quick-role]').length"), 2);

  if (process.env.STAGEFLOW_SCREENSHOT) {
    const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    await writeFile(process.env.STAGEFLOW_SCREENSHOT, Buffer.from(screenshot.data, 'base64'));
  }

  await evaluate(`(() => {
    document.querySelector('[data-auth-mode="register"]').click();
    document.querySelector('#authForm').requestSubmit();
    return true;
  })()`);
  assert.equal(await evaluate("document.querySelectorAll('.auth-error:not(:empty)').length"), 3);

  await evaluate("document.querySelector('[data-quick-role=\"Coordenação\"]').click()");
  await waitFor("location.pathname.endsWith('/pages/dashboard.html')");
  await waitFor("document.querySelector('#topbarUserName')?.textContent === 'Coordenação StageFlow'");

  const session = await evaluate("JSON.parse(localStorage.getItem('stageflow.demo-session.v1'))");
  assert.equal(session.role, 'Coordenação');
  assert.equal('password' in session, false);

  await evaluate("document.querySelector('[data-demo-logout]').click()");
  await waitFor("location.pathname.endsWith('/pages/acesso.html')");
  assert.equal(await evaluate("localStorage.getItem('stageflow.demo-session.v1')"), null);

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });

  const pages = [
    '/',
    '/pages/dashboard.html',
    '/pages/estagiarios.html',
    '/pages/supervisores.html',
    '/pages/atividades.html',
    '/pages/frequencia.html',
    '/pages/relatorios.html',
    '/pages/configuracoes.html',
    '/pages/projeto.html'
  ];

  for (const page of pages) {
    await navigate(page);
    assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true, page);
  }

  assert.deepEqual([...new Set(browserErrors)], []);
  console.log(`Browser smoke: ${pages.length + 1} telas, fluxo de acesso e logout validados sem erros.`);
} finally {
  socket.close();
}
