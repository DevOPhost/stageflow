import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeStudentInput,
  validateStudentInput
} from '../assets/js/studentValidation.js';

const validStudent = {
  nome: 'Ana Souza',
  matricula: '202600123',
  curso: 'Ciência da Computação',
  email: 'ana.souza@example.com',
  telefone: '(65) 99999-0000',
  status: 'Ativo'
};

test('normaliza espaços e e-mail antes de persistir', () => {
  assert.deepEqual(
    normalizeStudentInput({
      ...validStudent,
      nome: '  Ana   Souza  ',
      curso: '  Ciência   da Computação ',
      email: ' ANA.SOUZA@EXAMPLE.COM '
    }),
    validStudent
  );
});

test('rejeita campos obrigatórios formados apenas por espaços', () => {
  const result = validateStudentInput({
    ...validStudent,
    nome: '   ',
    curso: '\t',
    telefone: ' '
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.nome, 'Informe o nome do estagiário.');
  assert.equal(result.errors.curso, 'Informe o curso.');
  assert.equal(result.errors.telefone, 'Informe o telefone.');
});

test('valida o formato da matrícula e do e-mail', () => {
  const result = validateStudentInput({
    ...validStudent,
    matricula: '12 34',
    email: 'email-invalido'
  });

  assert.equal(result.isValid, false);
  assert.match(result.errors.matricula, /3 a 24/);
  assert.equal(result.errors.email, 'Informe um e-mail válido.');
});

test('detecta matrícula e e-mail duplicados sem diferenciar maiúsculas', () => {
  const existingStudents = [{ id: 'est-1', ...validStudent }];
  const result = validateStudentInput(
    {
      ...validStudent,
      matricula: '202600123',
      email: 'ANA.SOUZA@EXAMPLE.COM'
    },
    existingStudents
  );

  assert.equal(result.isValid, false);
  assert.equal(result.errors.matricula, 'Esta matrícula já está cadastrada.');
  assert.equal(result.errors.email, 'Este e-mail já está cadastrado.');
});

test('permite editar o próprio cadastro sem acusar duplicidade', () => {
  const existingStudents = [{ id: 'est-1', ...validStudent }];
  const result = validateStudentInput(validStudent, existingStudents, 'est-1');

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});
