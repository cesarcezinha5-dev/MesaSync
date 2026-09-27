import pool from '../database.js';

const camposRetorno = `
  id_comanda,
  fk_mesa_id_mesa,
  fk_usuario_id_usuario,
  status_comanda,
  valor_total,
  aberta_em,
  fechada_em,
  criado_em,
  atualizado_em
`;

export async function criar({
  fk_mesa_id_mesa,
  fk_usuario_id_usuario
}) {
  const { rows } = await pool.query(
    `
      INSERT INTO comanda (
        fk_mesa_id_mesa,
        fk_usuario_id_usuario
      )
      VALUES ($1, $2)
      RETURNING ${camposRetorno}
    `,
    [fk_mesa_id_mesa, fk_usuario_id_usuario]
  );

  return rows[0];
}

export async function listarTodas() {
  const { rows } = await pool.query(
    `
      SELECT
        c.id_comanda,
        c.fk_mesa_id_mesa,
        m.numero_mesa,
        c.fk_usuario_id_usuario,
        u.nome_usuario,
        c.status_comanda,
        c.valor_total,
        c.aberta_em,
        c.fechada_em,
        c.criado_em,
        c.atualizado_em
      FROM comanda c
      JOIN mesa m ON m.id_mesa = c.fk_mesa_id_mesa
      JOIN usuario u ON u.id_usuario = c.fk_usuario_id_usuario
      ORDER BY c.aberta_em DESC
    `
  );

  return rows;
}

export async function buscarPorId(id) {
  const { rows } = await pool.query(
    `
      SELECT
        c.id_comanda,
        c.fk_mesa_id_mesa,
        m.numero_mesa,
        c.fk_usuario_id_usuario,
        u.nome_usuario,
        c.status_comanda,
        c.valor_total,
        c.aberta_em,
        c.fechada_em,
        c.criado_em,
        c.atualizado_em
      FROM comanda c
      JOIN mesa m ON m.id_mesa = c.fk_mesa_id_mesa
      JOIN usuario u ON u.id_usuario = c.fk_usuario_id_usuario
      WHERE c.id_comanda = $1
    `,
    [id]
  );

  return rows[0] || null;
}

export async function alterarStatus(id, status_comanda) {
  const { rows } = await pool.query(
    `
      UPDATE comanda
      SET status_comanda = $1
      WHERE id_comanda = $2
      RETURNING ${camposRetorno}
    `,
    [status_comanda, id]
  );

  return rows[0] || null;
}