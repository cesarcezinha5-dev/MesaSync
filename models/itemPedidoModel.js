import pool from '../database.js';

const camposRetorno = `
  id_item_pedido,
  fk_comanda_id_comanda,
  fk_produto_id_produto,
  qtde_item,
  observacao_item,
  preco_congelado,
  status_item,
  criado_em,
  atualizado_em
`;

export async function criar({
  fk_comanda_id_comanda,
  fk_produto_id_produto,
  qtde_item,
  observacao_item
}) {
  const { rows } = await pool.query(
    `
      INSERT INTO item_pedido (
        fk_comanda_id_comanda,
        fk_produto_id_produto,
        qtde_item,
        observacao_item
      )
      VALUES ($1, $2, $3, $4)
      RETURNING ${camposRetorno}
    `,
    [
      fk_comanda_id_comanda,
      fk_produto_id_produto,
      qtde_item,
      observacao_item || null
    ]
  );

  return rows[0];
}

export async function listarPorComanda(idComanda) {
  const { rows } = await pool.query(
    `
      SELECT
        i.id_item_pedido,
        i.fk_comanda_id_comanda,
        i.fk_produto_id_produto,
        p.nome_produto,
        p.categoria_produto,
        i.qtde_item,
        i.observacao_item,
        i.preco_congelado,
        i.status_item,
        i.criado_em,
        i.atualizado_em
      FROM item_pedido i
      JOIN produto p ON p.id_produto = i.fk_produto_id_produto
      WHERE i.fk_comanda_id_comanda = $1
      ORDER BY i.id_item_pedido
    `,
    [idComanda]
  );

  return rows;
}

export async function buscarPorId(id) {
  const { rows } = await pool.query(
    `
      SELECT
        i.id_item_pedido,
        i.fk_comanda_id_comanda,
        i.fk_produto_id_produto,
        p.nome_produto,
        p.categoria_produto,
        i.qtde_item,
        i.observacao_item,
        i.preco_congelado,
        i.status_item,
        i.criado_em,
        i.atualizado_em
      FROM item_pedido i
      JOIN produto p ON p.id_produto = i.fk_produto_id_produto
      WHERE i.id_item_pedido = $1
    `,
    [id]
  );

  return rows[0] || null;
}

export async function atualizar(
  id,
  { qtde_item, observacao_item }
) {
  const { rows } = await pool.query(
    `
      UPDATE item_pedido
      SET
        qtde_item = COALESCE($1, qtde_item),
        observacao_item = COALESCE($2, observacao_item),
        atualizado_em = CURRENT_TIMESTAMP
      WHERE id_item_pedido = $3
      RETURNING ${camposRetorno}
    `,
    [qtde_item, observacao_item, id]
  );

  return rows[0] || null;
}

export async function alterarStatus(id, status_item) {
  const { rows } = await pool.query(
    `
      UPDATE item_pedido
      SET
        status_item = $1,
        atualizado_em = CURRENT_TIMESTAMP
      WHERE id_item_pedido = $2
      RETURNING ${camposRetorno}
    `,
    [status_item, id]
  );

  return rows[0] || null;
}