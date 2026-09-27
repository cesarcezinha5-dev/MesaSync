import * as produtoModel from '../models/produtoModel.js';

export async function criar(req, res) {
  const {
    nome_produto,
    descricao_produto,
    preco_produto,
    categoria_produto
  } = req.body;

  const preco = Number(preco_produto);

  if (typeof nome_produto !== 'string' || !nome_produto.trim()) {
    return res.status(400).json({
      error: 'nome_produto é obrigatório.'
    });
  }

  if (
    preco_produto === undefined ||
    preco_produto === '' ||
    !Number.isFinite(preco) ||
    preco < 0
  ) {
    return res.status(400).json({
      error: 'preco_produto deve ser um número maior ou igual a zero.'
    });
  }

  try {
    const produto = await produtoModel.criar({
      nome_produto: nome_produto.trim(),
      descricao_produto,
      preco_produto: preco,
      categoria_produto
    });

    return res.status(201).json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({
      error: 'Erro ao criar produto.'
    });
  }
}

export async function listar(req, res) {
  try {
    const produtos = await produtoModel.listarTodos();
    return res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({
      error: 'Erro ao listar produtos.'
    });
  }
}

export async function buscarPorId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  try {
    const produto = await produtoModel.buscarPorId(id);

    if (!produto) {
      return res.status(404).json({
        error: 'Produto não encontrado.'
      });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({
      error: 'Erro ao buscar produto.'
    });
  }
}

export async function atualizar(req, res) {
  const id = Number(req.params.id);
  const {
    nome_produto,
    descricao_produto,
    preco_produto,
    categoria_produto,
    disponivel
  } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  const dados = {};

  if (nome_produto !== undefined) {
    if (typeof nome_produto !== 'string' || !nome_produto.trim()) {
      return res.status(400).json({
        error: 'nome_produto não pode ser vazio.'
      });
    }

    dados.nome_produto = nome_produto.trim();
  }

  if (preco_produto !== undefined) {
    const preco = Number(preco_produto);

    if (
      preco_produto === '' ||
      !Number.isFinite(preco) ||
      preco < 0
    ) {
      return res.status(400).json({
        error: 'preco_produto deve ser um número maior ou igual a zero.'
      });
    }

    dados.preco_produto = preco;
  }

  if (descricao_produto !== undefined) {
    dados.descricao_produto = descricao_produto;
  }

  if (categoria_produto !== undefined) {
    dados.categoria_produto = categoria_produto;
  }

  if (disponivel !== undefined) {
    if (typeof disponivel !== 'boolean') {
      return res.status(400).json({
        error: 'disponivel deve ser true ou false.'
      });
    }

    dados.disponivel = disponivel;
  }

  if (Object.keys(dados).length === 0) {
    return res.status(400).json({
      error: 'Informe ao menos um campo para atualizar.'
    });
  }

  try {
    const produto = await produtoModel.atualizar(id, dados);

    if (!produto) {
      return res.status(404).json({
        error: 'Produto não encontrado.'
      });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({
      error: 'Erro ao atualizar produto.'
    });
  }
}

export async function excluir(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  try {
    const excluido = await produtoModel.excluir(id);

    if (!excluido) {
      return res.status(404).json({
        error: 'Produto não encontrado.'
      });
    }

    return res.status(200).json({
      mensagem: 'Produto excluído com sucesso.'
    });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({
        error: 'Não é possível excluir um produto vinculado a pedidos.'
      });
    }

    console.error('Erro ao excluir produto:', error);
    return res.status(500).json({
      error: 'Erro ao excluir produto.'
    });
  }
}