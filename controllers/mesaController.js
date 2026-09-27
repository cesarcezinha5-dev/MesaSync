import * as mesaModel from '../models/mesaModel.js';

const statusPermitidos = [
  'LIVRE',
  'OCUPADA',
  'AGUARDANDO_FECHAMENTO'
];

export async function criar(req, res) {
  const { numero_mesa, capacidade } = req.body;

  if (!Number.isInteger(numero_mesa) || numero_mesa <= 0) {
    return res.status(400).json({
      error: 'numero_mesa deve ser um número inteiro maior que zero.'
    });
  }

  if (
    capacidade !== undefined &&
    (!Number.isInteger(capacidade) || capacidade <= 0)
  ) {
    return res.status(400).json({
      error: 'capacidade deve ser um número inteiro maior que zero.'
    });
  }

  try {
    const mesa = await mesaModel.criar({ numero_mesa, capacidade });
    return res.status(201).json(mesa);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Já existe uma mesa com esse número.'
      });
    }

    console.error('Erro ao criar mesa:', error);
    return res.status(500).json({ error: 'Erro ao criar mesa.' });
  }
}

export async function listar(req, res) {
  try {
    const mesas = await mesaModel.listarTodas();
    return res.status(200).json(mesas);
  } catch (error) {
    console.error('Erro ao listar mesas:', error);
    return res.status(500).json({ error: 'Erro ao listar mesas.' });
  }
}

export async function buscarPorId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  try {
    const mesa = await mesaModel.buscarPorId(id);

    if (!mesa) {
      return res.status(404).json({ error: 'Mesa não encontrada.' });
    }

    return res.status(200).json(mesa);
  } catch (error) {
    console.error('Erro ao buscar mesa:', error);
    return res.status(500).json({ error: 'Erro ao buscar mesa.' });
  }
}

export async function atualizarStatus(req, res) {
  const id = Number(req.params.id);
  const { status_mesa } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  if (!statusPermitidos.includes(status_mesa)) {
    return res.status(400).json({
      error: 'Status inválido.'
    });
  }

  try {
    const mesa = await mesaModel.atualizarStatus(id, status_mesa);

    if (!mesa) {
      return res.status(404).json({ error: 'Mesa não encontrada.' });
    }

    return res.status(200).json(mesa);
  } catch (error) {
    console.error('Erro ao atualizar status da mesa:', error);
    return res.status(500).json({
      error: 'Erro ao atualizar status da mesa.'
    });
  }
}

export async function excluir(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  try {
    const excluida = await mesaModel.excluir(id);

    if (!excluida) {
      return res.status(404).json({ error: 'Mesa não encontrada.' });
    }

    return res.status(200).json({
      mensagem: 'Mesa excluída com sucesso.'
    });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({
        error: 'Não é possível excluir uma mesa com comandas vinculadas.'
      });
    }

    console.error('Erro ao excluir mesa:', error);
    return res.status(500).json({ error: 'Erro ao excluir mesa.' });
  }
}