import * as usuarioModel from '../models/usuarioModel.js';

export async function criar(req, res) {
    const { nome_usuario, login_usuario, senha_usuario, cargo_usuario } = req.body;

    try {
        const usuario = await usuarioModel.criar({ nome_usuario, login_usuario, senha_usuario, cargo_usuario });
        res.status(201).json(usuario);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
}

export async function listar(req, res) {
    try {
        const usuarios = await usuarioModel.listarTodos();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
}

export async function buscarPorId(req, res) {
    const { id } = req.params;

    try {
        const usuario = await usuarioModel.buscarPorId(id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
}

export async function atualizar(req, res) {
    const { id } = req.params;
    const { nome_usuario, login_usuario, senha_usuario, cargo_usuario } = req.body;

    try {
        const usuario = await usuarioModel.atualizar(id, { nome_usuario, login_usuario, senha_usuario, cargo_usuario });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
}

export async function excluir(req, res) {
    const { id } = req.params;

    try {
        const excluido = await usuarioModel.excluir(id);
        if (!excluido) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
}