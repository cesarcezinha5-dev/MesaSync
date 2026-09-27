import * as comandaModel from '../models/comandaModel.js';

const statusPermitidos = ['FECHADA', 'CANCELADA'];

export async function criar(req, res) {
  const {
    fk_mesa_id_mesa,
    fk_usuario_id_usuario
  } = req.body;

  const idMesa = Number(fk_mesa_id_mesa);
  const idUsuario = Number(fk_usuario_id_usuario);

  if (!Number.isInteger(idMesa) || idMesa <= 0) {
    return res.status(400).json({
      error: 'fk_mesa_id_mesa deve ser um ID válido.'
    });
  }

  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    return res.status(400).json({
      error: 'fk_usuario_id_usuario deve ser um ID válido.'
    });
  }

  try {
    const comanda = await comandaModel.criar({
      fk_mesa_id_mesa: idMesa,
      fk_usuario_id_usuario: idUsuario
    });

    return res.status(201).json(comanda);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Já existe uma comanda aberta para esta mesa.'
      });
    }

    if (error.code === '23503') {
      return res.status(404).json({
        error: 'Mesa ou usuário não encontrado.'
      });
    }

    if (error.code === 'P0001') {
      return res.status(409).json({
        error: error.message
      });
    }

    console.error('Erro ao abrir comanda:', error);
    return res.status(500).json({
      error: 'Erro ao abrir comanda.'
    });
  }
}

export async function listar(req, res) {
  try {
    const comandas = await comandaModel.listarTodas();
    return res.status(200).json(comandas);
  } catch (error) {
    console.error('Erro ao listar comandas:', error);
    return res.status(500).json({
      error: 'Erro ao listar comandas.'
    });
  }
}

export async function buscarPorId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  try {
    const comanda = await comandaModel.buscarPorId(id);

    if (!comanda) {
      return res.status(404).json({
        error: 'Comanda não encontrada.'
      });
    }

    return res.status(200).json(comanda);
  } catch (error) {
    console.error('Erro ao buscar comanda:', error);
    return res.status(500).json({
      error: 'Erro ao buscar comanda.'
    });
  }
}

export async function alterarStatus(req, res) {
  const id = Number(req.params.id);
  const { status_comanda } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  if (!statusPermitidos.includes(status_comanda)) {
    return res.status(400).json({
      error: 'status_comanda deve ser FECHADA ou CANCELADA.'
    });
  }

  try {
    const comandaAtual = await comandaModel.buscarPorId(id);

    if (!comandaAtual) {
      return res.status(404).json({
        error: 'Comanda não encontrada.'
      });
    }

    if (comandaAtual.status_comanda !== 'ABERTA') {
      return res.status(409).json({
        error: 'Esta comanda já está encerrada.'
      });
    }

    const comanda = await comandaModel.alterarStatus(
      id,
      status_comanda
    );

    return res.status(200).json(comanda);
  } catch (error) {
    console.error('Erro ao alterar status da comanda:', error);
    return res.status(500).json({
      error: 'Erro ao alterar status da comanda.'
    });
  }
}