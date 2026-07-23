import test from 'node:test';
import assert from 'node:assert/strict';

const persistedValues = new Map();

globalThis.localStorage = {
  getItem(key) {
    return persistedValues.get(key) ?? null;
  },
  setItem(key, value) {
    persistedValues.set(key, String(value));
  },
  removeItem(key) {
    persistedValues.delete(key);
  }
};

globalThis.CustomEvent = class CustomEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.detail = options.detail;
  }
};

globalThis.window = {
  crypto: globalThis.crypto,
  dispatchEvent() {}
};

const {
  createRecord,
  deleteRecord,
  getCollection,
  updateRecord
} = await import('../assets/js/storage.js');

test('persiste o fluxo completo de criação, edição e exclusão', () => {
  persistedValues.clear();

  const created = createRecord(
    'estagiarios',
    {
      nome: 'Ana Souza',
      matricula: '202600123',
      curso: 'Ciência da Computação',
      email: 'ana.souza@example.com',
      telefone: '(65) 99999-0000',
      status: 'Ativo'
    },
    'est'
  );

  assert.ok(created.id.startsWith('est-'));
  assert.equal(
    getCollection('estagiarios').find((student) => student.id === created.id)?.nome,
    'Ana Souza'
  );

  const updated = updateRecord('estagiarios', created.id, {
    status: 'Em acompanhamento'
  });

  assert.equal(updated.status, 'Em acompanhamento');

  deleteRecord('estagiarios', created.id);
  assert.equal(
    getCollection('estagiarios').some((student) => student.id === created.id),
    false
  );
});
