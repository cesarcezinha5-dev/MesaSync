import pool from '../database.js';

const camposRetorno = `
  id_mesa,
  numero_mesa,
  capacidade,
  status_mesa,
  ativa,
  criado_em,
  atualizado_em
`;

export async function criar({ numero_mesa, capacidade }) {
  const { rows } = await pool.query(
    `
      INSERT INTO mesa (numero_mesa, capacidade, status_mesa)
      VALUES ($1, COALESCE($2, 4), 'LIVRE')
      RETURNING ${camposRetorno}
    `,
    [numero_mesa, capacidade]
  );

  return rows[0];
}

export async function listarTodas() {
  const { rows } = await pool.query(
    `SELECT ${camposRetorno} FROM mesa ORDER BY numero_mesa`
  );

  return rows;
}

export async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT ${camposRetorno} FROM mesa WHERE id_mesa = $1`,
    [id]
  );

  return rows[0] || null;
}

export async function atualizarStatus(id, status_mesa) {
  const { rows } = await pool.query(
    `
      UPDATE mesa
      SET status_mesa = $1, atualizado_em = CURRENT_TIMESTAMP
      WHERE id_mesa = $2
      RETURNING ${camposRetorno}
    `,
    [status_mesa, id]
  );

  return rows[0] || null;
}

export async function excluir(id) {
  const resultado = await pool.query(
    'DELETE FROM mesa WHERE id_mesa = $1 RETURNING id_mesa',
    [id]
  );

  return resultado.rowCount > 0;
}