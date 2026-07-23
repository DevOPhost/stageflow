const VALID_STATUSES = new Set([
  'Ativo',
  'Em acompanhamento',
  'Pendente',
  'Finalizado'
]);

const REGISTRATION_PATTERN = /^[A-Za-z0-9._/-]{3,24}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const cleanText = (value) => String(value ?? '').trim();
const comparable = (value) => cleanText(value).toLocaleLowerCase('pt-BR');

export const normalizeStudentInput = (input = {}) => ({
  nome: cleanText(input.nome).replace(/\s+/g, ' '),
  matricula: cleanText(input.matricula),
  curso: cleanText(input.curso).replace(/\s+/g, ' '),
  email: comparable(input.email),
  telefone: cleanText(input.telefone),
  status: cleanText(input.status)
});

export const validateStudentInput = (
  input,
  existingStudents = [],
  currentId = ''
) => {
  const value = normalizeStudentInput(input);
  const errors = {};

  if (!value.nome) {
    errors.nome = 'Informe o nome do estagiário.';
  }

  if (!value.matricula) {
    errors.matricula = 'Informe a matrícula.';
  } else if (!REGISTRATION_PATTERN.test(value.matricula)) {
    errors.matricula = 'Use de 3 a 24 letras, números, pontos, barras, hífens ou sublinhados.';
  }

  if (!value.curso) {
    errors.curso = 'Informe o curso.';
  }

  if (!value.email) {
    errors.email = 'Informe o e-mail.';
  } else if (!EMAIL_PATTERN.test(value.email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!value.telefone) {
    errors.telefone = 'Informe o telefone.';
  }

  if (!VALID_STATUSES.has(value.status)) {
    errors.status = 'Selecione um status válido.';
  }

  const normalizedId = String(currentId ?? '');
  const otherStudents = existingStudents.filter(
    (student) => String(student.id ?? '') !== normalizedId
  );

  if (
    !errors.matricula
    && otherStudents.some((student) => comparable(student.matricula) === comparable(value.matricula))
  ) {
    errors.matricula = 'Esta matrícula já está cadastrada.';
  }

  if (
    !errors.email
    && otherStudents.some((student) => comparable(student.email) === comparable(value.email))
  ) {
    errors.email = 'Este e-mail já está cadastrado.';
  }

  return {
    value,
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
