import request from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../src/app.js';

import { loginAdmin } from './helpers/adminHelper.js';
import { loginUsuario } from './helpers/userHelper.js';

import testData from './data/testData.json' with { type: 'json' };

dotenv.config();

const { novoAluno, trabalho } = testData;

describe('Fluxo do aluno', () => {

  let tokenAdmin;
  let alunoId;
  let tokenAluno;
  let disciplinaId;

  before(async () => {
    tokenAdmin = await loginAdmin();
  });

  it('deve cadastrar um novo aluno usando dados do arquivo JSON', async () => {

    const alunoTeste = {
      ...novoAluno,
      email: `aluno.${Date.now()}@teste.com`,
      matricula: `${Date.now()}`
    };

    novoAluno.email = alunoTeste.email;
    novoAluno.matricula = alunoTeste.matricula;

    const resposta = await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send(alunoTeste);

    console.log('ALUNO CRIADO:', resposta.body);

    expect(resposta.status).to.equal(201);

    expect(resposta.body.nome).to.equal(alunoTeste.nome);
    expect(resposta.body.email).to.equal(alunoTeste.email);

    // A API retorna "id", e não "_id"
    alunoId = resposta.body.id;

    console.log('ID DO ALUNO:', alunoId);

    expect(alunoId).to.exist;
  });

  it('deve criar uma disciplina para o teste', async () => {

    const disciplina = {
      nome: 'Matemática - Teste Automatizado',
      codigo: `MAT-${Date.now()}`,
      cargaHoraria: 60
    };

    const resposta = await request(app)
      .post('/api/admin/disciplinas')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send(disciplina);

    console.log('DISCIPLINA CRIADA:', resposta.body);

    expect(resposta.status).to.equal(201);

    // A API retorna "id", e não "_id"
    disciplinaId = resposta.body.id;

    console.log('ID DA DISCIPLINA:', disciplinaId);

    expect(disciplinaId).to.exist;
  });

  it('deve matricular o aluno na disciplina', async () => {

    console.log('MATRICULANDO:');
    console.log('Aluno ID:', alunoId);
    console.log('Disciplina ID:', disciplinaId);

    const resposta = await request(app)
      .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        alunoId: alunoId
      });

    console.log('RESPOSTA DA MATRÍCULA:', resposta.body);

    expect(resposta.status).to.equal(201);
  });

  it('deve realizar login como aluno', async () => {

    tokenAluno = await loginUsuario(
      novoAluno.email,
      novoAluno.senha
    );

    console.log('LOGIN DO ALUNO REALIZADO COM SUCESSO');

    expect(tokenAluno).to.be.a('string');
    expect(tokenAluno).to.not.be.empty;
  });

  it('deve submeter um trabalho como aluno', async () => {

    const dadosTrabalho = {
      disciplinaId: disciplinaId,
      titulo: trabalho.titulo
    };

    console.log('DADOS DO TRABALHO:', dadosTrabalho);
    console.log('ALUNO ID UTILIZADO:', alunoId);

    const resposta = await request(app)
      .post(`/api/alunos/${alunoId}/trabalhos`)
      .set('Authorization', `Bearer ${tokenAluno}`)
      .send(dadosTrabalho);

    console.log('TRABALHO SUBMETIDO:', resposta.body);

    expect(resposta.status).to.equal(201);

    // A API também usa "id"
    expect(resposta.body).to.have.property('id');
    expect(resposta.body.titulo).to.equal(trabalho.titulo);
  });

});