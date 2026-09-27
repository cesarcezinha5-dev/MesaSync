import * as produtoModel from '../models/produtoModel.js';

export async function criar(req, res) {
    const { nome_produto, preco_produto, categoria_produto } = req.body;

    if (!nome_produto || preco_produto === undefined || !categoria_produto) {
        return res.status(400).json({ error: 'nome_produto, preco_produto e categoria_produto são obrigatórios' });
    }

    try {
        const produto = await produtoModel.criar({ nome_produto, preco_produto, categoria_produto });
        res.status(201).json(produto);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
}

export async function listar(req, res) {
    try {
        const produtos = await produtoModel.listarTodos();
        res.status(200).json(produtos);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
}

export async function buscarPorId(req, res) {
    const { id } = req.params;
    try {
        const produto = await produtoModel.buscarPorId(id);
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
        res.status(200).json(produto);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
}

export async function atualizar(req, res) {
    const { id } = req.params;
    try {
        const produto = await produtoModel.atualizar(id, req.body);
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
        res.status(200).json(produto);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
}

export async function excluir(req, res) {
    const { id } = req.params;
    try {
        const excluido = await produtoModel.excluir(id);
        if (!excluido) return res.status(404).json({ error: 'Produto não encontrado' });
        res.status(200).json({ mensagem: 'Produto excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ error: 'Erro ao excluir produto' });
    }
}