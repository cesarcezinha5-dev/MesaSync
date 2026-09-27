import * as itemPedidoModel from '../models/itempedidoModel.js';

const statusPermitidos = [
  'PENDENTE',
  'EM_PREPARO',
  'PRONTO',
  'ENTREGUE',
  'CANCELADO'
];

export async function criar(req, res) {
  const {
    fk_comanda_id_comanda,
    fk_produto_id_produto,
    qtde_item,
    observacao_item
  } = req.body;

  const idComanda = Number(fk_comanda_id_comanda);
  const idProduto = Number(fk_produto_id_produto);
  const quantidade = Number(qtde_item);

  if (!Number.isInteger(idComanda) || idComanda <= 0) {
    return res.status(400).json({
      error: 'fk_comanda_id_comanda deve ser um ID válido.'
    });
  }

  if (!Number.isInteger(idProduto) || idProduto <= 0) {
    return res.status(400).json({
      error: 'fk_produto_id_produto deve ser um ID válido.'
    });
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    return res.status(400).json({
      error: 'qtde_item deve ser um número inteiro maior que zero.'
    });
  }

  try {
    const item = await itemPedidoModel.criar({
      fk_comanda_id_comanda: idComanda,
      fk_produto_id_produto: idProduto,
      qtde_item: quantidade,
      observacao_item
    });

    return res.status(201).json(item);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(404).json({
        error: 'Comanda ou produto não encontrado.'
      });
    }

    if (error.code === 'P0001') {
      return res.status(409).json({
        error: error.message
      });
    }

    console.error('Erro ao criar item do pedido:', error);
    return res.status(500).json({
      error: 'Erro ao criar item do pedido.'
    });
  }
}

export async function listarPorComanda(req, res) {
  const idComanda = Number(req.params.comandaId);

  if (!Number.isInteger(idComanda) || idComanda <= 0) {
    return res.status(400).json({
      error: 'ID da comanda inválido.'
    });
  }

  try {
    const itens = await itemPedidoModel.listarPorComanda(idComanda);
    return res.status(200).json(itens);
  } catch (error) {
    console.error('Erro ao listar itens do pedido:', error);
    return res.status(500).json({
      error: 'Erro ao listar itens do pedido.'
    });
  }
}

export async function buscarPorId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  try {
    const item = await itemPedidoModel.buscarPorId(id);

    if (!item) {
      return res.status(404).json({
        error: 'Item do pedido não encontrado.'
      });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error('Erro ao buscar item do pedido:', error);
    return res.status(500).json({
      error: 'Erro ao buscar item do pedido.'
    });
  }
}

export async function atualizar(req, res) {
  const id = Number(req.params.id);
  const { qtde_item, observacao_item } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  const dados = {};

  if (qtde_item !== undefined) {
    const quantidade = Number(qtde_item);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return res.status(400).json({
        error: 'qtde_item deve ser um número inteiro maior que zero.'
      });
    }

    dados.qtde_item = quantidade;
  }

  if (observacao_item !== undefined) {
    if (typeof observacao_item !== 'string') {
      return res.status(400).json({
        error: 'observacao_item deve ser um texto.'
      });
    }

    dados.observacao_item = observacao_item;
  }

  if (Object.keys(dados).length === 0) {
    return res.status(400).json({
      error: 'Informe qtde_item ou observacao_item para atualizar.'
    });
  }

  try {
    const item = await itemPedidoModel.atualizar(id, dados);

    if (!item) {
      return res.status(404).json({
        error: 'Item do pedido não encontrado.'
      });
    }

    return res.status(200).json(item);
  } catch (error) {
    if (error.code === 'P0001') {
      return res.status(409).json({
        error: error.message
      });
    }

    console.error('Erro ao atualizar item do pedido:', error);
    return res.status(500).json({
      error: 'Erro ao atualizar item do pedido.'
    });
  }
}

export async function alterarStatus(req, res) {
  const id = Number(req.params.id);
  const { status_item } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  if (!statusPermitidos.includes(status_item)) {
    return res.status(400).json({
      error: 'status_item inválido.'
    });
  }

  try {
    const itemAtual = await itemPedidoModel.buscarPorId(id);

    if (!itemAtual) {
      return res.status(404).json({
        error: 'Item do pedido não encontrado.'
      });
    }

    if (itemAtual.status_item === 'CANCELADO') {
      return res.status(409).json({
        error: 'Um item cancelado não pode ser alterado.'
      });
    }

    const item = await itemPedidoModel.alterarStatus(id, status_item);

    return res.status(200).json(item);
  } catch (error) {
    if (error.code === 'P0001') {
      return res.status(409).json({
        error: error.message
      });
    }

    console.error('Erro ao alterar status do item:', error);
    return res.status(500).json({
      error: 'Erro ao alterar status do item.'
    });
  }
}