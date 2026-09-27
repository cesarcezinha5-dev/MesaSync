import * as mesaModel from '../models/mesaModel.js';

const STATUS_VALIDOS = ['LIVRE', 'OCUPADA', 'AGUARDANDO_FECHAMENTO'];

export async function criar(req, res) {
    const { numero_mesa } = req.body;

    if (!numero_mesa) {
        return res.status(400).json({ error: 'numero_mesa é obrigatório' });
    }

    try {
        const mesa = await mesaModel.criar({ numero_mesa, status_mesa: 'LIVRE' });
        res.status(201).json(mesa);
    } catch (error) {
        console.error('Erro ao criar mesa:', error);
        res.status(500).json({ error: 'Erro ao criar mesa' });
    }
}

export async function listar(req, res) {
    try {
        const mesas = await mesaModel.listarTodas();
        res.status(200).json(mesas);
    } catch (error) {
        console.error('Erro ao listar mesas:', error);
        res.status(500).json({ error: 'Erro ao listar mesas' });
    }
}

export async function buscarPorId(req, res) {
    const { id } = req.params;
    try {
        const mesa = await mesaModel.buscarPorId(id);
        if (!mesa) return res.status(404).json({ error: 'Mesa não encontrada' });
        res.status(200).json(mesa);
    } catch (error) {
        console.error('Erro ao buscar mesa:', error);
        res.status(500).json({ error: 'Erro ao buscar mesa' });
    }
}

export async function atualizarStatus(req, res) {
    const { id } = req.params;
    const { status_mesa } = req.body;

    if (!STATUS_VALIDOS.includes(status_mesa)) {
        return res.status(400).json({ error: `status_mesa deve ser um de: ${STATUS_VALIDOS.join(', ')}` });
    }

    try {
        const mesa = await mesaModel.atualizarStatus(id, status_mesa);
        if (!mesa) return res.status(404).json({ error: 'Mesa não encontrada' });
        res.status(200).json(mesa);
    } catch (error) {
        console.error('Erro ao atualizar status da mesa:', error);
        res.status(500).json({ error: 'Erro ao atualizar status da mesa' });
    }
}

export async function excluir(req, res) {
    const { id } = req.params;
    try {
        const excluida = await mesaModel.excluir(id);
        if (!excluida) return res.status(404).json({ error: 'Mesa não encontrada' });
        res.status(200).json({ mensagem: 'Mesa excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir mesa:', error);
        res.status(500).json({ error: 'Erro ao excluir mesa' });
    }
}