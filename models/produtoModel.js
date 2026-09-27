import pool from '../database.js';

const camposRetorno = `
  id_produto,
  nome_produto,
  descricao_produto,
  preco_produto,
  categoria_produto,
  disponivel,
  criado_em,
  atualizado_em
`;

export async function criar({
  nome_produto,
  descricao_produto,
  preco_produto,
  categoria_produto
}) {
  const { rows } = await pool.query(
    `
      INSERT INTO produto (
        nome_produto,
        descricao_produto,
        preco_produto,
        categoria_produto
      )
      VALUES ($1, $2, $3, $4)
      RETURNING ${camposRetorno}
    `,
    [
      nome_produto,
      descricao_produto || null,
      preco_produto,
      categoria_produto || null
    ]
  );

  return rows[0];
}

export async function listarTodos() {
  const { rows } = await pool.query(
    `SELECT ${camposRetorno} FROM produto ORDER BY nome_produto`
  );

  return rows;
}

export async function buscarPorId(id) {
  const { rows } = await pool.query(
    `SELECT ${camposRetorno} FROM produto WHERE id_produto = $1`,
    [id]
  );

  return rows[0] || null;
}

export async function atualizar(
  id,
  {
    nome_produto,
    descricao_produto,
    preco_produto,
    categoria_produto,
    disponivel
  }
) {
  const { rows } = await pool.query(
    `
      UPDATE produto
      SET
        nome_produto = COALESCE($1, nome_produto),
        descricao_produto = COALESCE($2, descricao_produto),
        preco_produto = COALESCE($3, preco_produto),
        categoria_produto = COALESCE($4, categoria_produto),
        disponivel = COALESCE($5, disponivel),
        atualizado_em = CURRENT_TIMESTAMP
      WHERE id_produto = $6
      RETURNING ${camposRetorno}
    `,
    [
      nome_produto,
      descricao_produto,
      preco_produto,
      categoria_produto,
      disponivel,
      id
    ]
  );

  return rows[0] || null;
}

export async function excluir(id) {
  const resultado = await pool.query(
    'DELETE FROM produto WHERE id_produto = $1 RETURNING id_produto',
    [id]
  );

  return resultado.rowCount > 0;
}