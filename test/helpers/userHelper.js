import request from 'supertest';
import app from '../../src/app.js';

export async function loginUsuario(email, senha) {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send({
      email,
      senha
    });

  if (resposta.status !== 200) {
    throw new Error(
      `Falha no login do usuário. Status: ${resposta.status}`
    );
  }

  return resposta.body.token;
}