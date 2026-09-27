import * as itemPedidoModel from '../models/itemPedidoModel.js';
import * as produtoModel from '../models/produtoModel.js';
import * as comandaModel from '../models/comandaModel.js';

/**
 * ADICIONAR ITEM
 * Regras: Congela o preço do produto e atualiza o valor total da comanda.
 */
export async function adicionar(req, res) {
    const { fk_comanda_id_comanda, fk_produto_id_produto, qtde_item, observacao_item } = req.body;

    if (!fk_comanda_id_comanda || !fk_produto_id_produto || !qtde_item) {
        return res.status(400).json({ error: 'IDs da comanda, do produto e quantidade são obrigatórios.' });
    }

    try {
        // 1. Busca o produto para validar a existência e obter o preço atual
        const produto = await produtoModel.buscarPorId(fk_produto_id_produto);
        
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado no cardápio.' });
        }

        // 2. Busca a comanda para validar se está aberta
        const comanda = await comandaModel.buscarPorId(fk_comanda_id_comanda);
        
        if (!comanda) {
            return res.status(404).json({ error: 'Comanda não encontrada.' });
        }
        if (comanda.status_comanda !== 'A') {
            return res.status(400).json({ error: 'Não é possível adicionar itens a uma comanda fechada.' });
        }

        // 3. Regra de Negócio: CONGELAMENTO DE PREÇO
        const preco_congelado = produto.preco_produto;

        // 4. Registo do item na base de dados
        const novoItem = await itemPedidoModel.adicionar({
            fk_comanda_id_comanda,
            fk_produto_id_produto,
            qtde_item,
            observacao_item,
            preco_congelado
        });

        // 5. Regra de Negócio: RECÁLCULO DO VALOR TOTAL DA COMANDA
        const valorAdicional = preco_congelado * qtde_item;
        const novoValorTotal = parseFloat(comanda.valor_total) + valorAdicional;
        
        await comandaModel.atualizarValorTotal(fk_comanda_id_comanda, novoValorTotal);

        // 6. Retorno de sucesso
        res.status(201).json(novoItem);

    } catch (error) {
        console.error('Erro ao adicionar item ao pedido:', error);
        res.status(500).json({ error: 'Erro interno ao adicionar o item.' });
    }
}

/**
 * ATUALIZAR STATUS DO PREPARO (Ação da Cozinha)
 */
export async function atualizarStatus(req, res) {
    const { id } = req.params;
    const { status_item } = req.body; // Ex: 'E' (Em Preparo) ou 'R' (Pronto)

    if (!status_item || !['P', 'E', 'R'].includes(status_item)) {
        return res.status(400).json({ error: 'Status inválido. Use P, E ou R.' });
    }

    try {
        const itemAtualizado = await itemPedidoModel.atualizarStatus(id, status_item);
        
        // Como o modelo ainda é um "stub", não conseguimos verificar se o item existe de facto antes de atualizar.
        // Num cenário real, se itemAtualizado for null, retornaríamos 404.
        
        res.status(200).json(itemAtualizado);

    } catch (error) {
        console.error('Erro ao atualizar status do item:', error);
        res.status(500).json({ error: 'Erro interno ao atualizar o status.' });
    }
}