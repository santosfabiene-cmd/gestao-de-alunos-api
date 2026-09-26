import request from 'supertest';
import app from '../../src/app.js';

export async function loginAdmin() {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send({
      email: process.env.ADMIN_EMAIL,
      senha: process.env.ADMIN_PASSWORD
    });

  if (resposta.status !== 200) {
    throw new Error(`Falha no login do Admin. Status: ${resposta.status}`);
  }

  return resposta.body.token;
}