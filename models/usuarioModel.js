import bcrypt from 'bcrypt';
import pool from '../database.js';

const camposRetorno = `
  id_usuario,
  nome_usuario,
  login_usuario,
  cargo_usuario,
  ativo,
  criado_em,
  atualizado_em
`;

export async function criar({
  nome_usuario,
  login_usuario,
  senha_usuario,
  cargo_usuario
}) {
  const senhaHash = await bcrypt.hash(senha_usuario, 10);

  const { rows } = await pool.query(
    `
      INSERT INTO usuario (
        nome_usuario,
        login_usuario,
        senha_usuario,
        cargo_usuario
      )
      VALUES ($1, $2, $3, $4)
      RETURNING ${camposRetorno}
    `,
    [
      nome_usuario,
      login_usuario,
      senhaHash,
      cargo_usuario || 'GARCOM'
    ]
  );

  return rows[0];
}

export async function listarTodos() {
  const { rows } = await pool.query(
    `SELECT ${camposRetorno} FROM usuario ORDER BY id_usuario`
  );

  return rows;
}

export async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT ${camposRetorno} FROM usuario WHERE id_usuario = $1`,
    [id]
  );

  return rows[0] || null;
}

export async function atualizar(
  id,
  { nome_usuario, login_usuario, senha_usuario, cargo_usuario }
) {
  const senhaHash = senha_usuario
    ? await bcrypt.hash(senha_usuario, 10)
    : null;

  const { rows } = await pool.query(
    `
      UPDATE usuario
      SET
        nome_usuario = COALESCE($1, nome_usuario),
        login_usuario = COALESCE($2, login_usuario),
        senha_usuario = COALESCE($3, senha_usuario),
        cargo_usuario = COALESCE($4, cargo_usuario),
        atualizado_em = CURRENT_TIMESTAMP
      WHERE id_usuario = $5
      RETURNING ${camposRetorno}
    `,
    [nome_usuario, login_usuario, senhaHash, cargo_usuario, id]
  );

  return rows[0] || null;
}

export async function excluir(id) {
  const resultado = await pool.query(
    'DELETE FROM usuario WHERE id_usuario = $1 RETURNING id_usuario',
    [id]
  );

  return resultado.rowCount > 0;
}

// Função que traz a senha encriptada do banco de dados para comparar.
export async function buscarPorLoginComSenha(login) {
  const { rows } = await pool.query(
    `SELECT * FROM usuario WHERE login_usuario = $1 AND ativo = true`,
    [login]
  );
  return rows[0] || null;
}