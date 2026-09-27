// 1. ADICIONAR ITEM À COMANDA
// Recebe os dados do pedido, incluindo o preço já congelado pelo controlador.
export async function adicionar({ fk_comanda_id_comanda, fk_produto_id_produto, qtde_item, observacao_item, preco_congelado }) {
    
    throw new Error('não implementado');
}

// 2. LISTAR ITENS DE UMA COMANDA (Para a conta final ou visualização na mesa)
export async function listarPorComanda(id_comanda) {
    
    throw new Error('não implementado');
}

// 3. ATUALIZAR STATUS DO ITEM (Para a ecrã da Cozinha)
// Altera o estado para 'E' (Em Preparo) ou 'R' (Pronto).
export async function atualizarStatus(id_item, status_item) {
    
    throw new Error('não implementado');
}