import * as comandaModel from '../models/comandaModel.js';
import * as mesaModel from '../models/mesaModel.js';

/**
 * ABRIR COMANDA
 * Regra: Só abre se a mesa estiver 'L' (Livre). Ao abrir, muda a mesa para 'O' (Ocupada).
 */
export async function abrir(req, res) {
    // 1. Extrai os dados do corpo da requisição usando os nomes exatos do DER
    const { fk_mesa_id_mesa, fk_usuario_id_usuario } = req.body;

    // Validação básica
    if (!fk_mesa_id_mesa || !fk_usuario_id_usuario) {
        return res.status(400).json({ error: 'IDs da mesa e do usuário são obrigatórios.' });
    }

    try {
        // 2. Busca a mesa para verificar o status atual
        const mesa = await mesaModel.buscarPorId(fk_mesa_id_mesa);
        
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa não encontrada.' });
        }

        // 3. Verifica a regra de negócio: a mesa precisa estar Livre ('L')
        if (mesa.status_mesa !== 'L') {
            return res.status(400).json({ error: 'A mesa selecionada não está livre.' });
        }

        // 4. Cria a comanda no banco
        const novaComanda = await comandaModel.abrir({ fk_mesa_id_mesa, fk_usuario_id_usuario });

        // 5. Atualiza o status da mesa para Ocupada ('O')
        await mesaModel.atualizarStatus(fk_mesa_id_mesa, 'O');

        // 6. Retorna sucesso (201 - Criado)
        res.status(201).json(novaComanda);

    } catch (error) {
        console.error('Erro ao abrir comanda:', error);
        res.status(500).json({ error: 'Erro interno ao abrir a comanda.' });
    }
}

/**
 * BUSCAR COMANDA POR ID
 */
export async function buscarPorId(req, res) {
    const { id } = req.params;

    try {
        const comanda = await comandaModel.buscarPorId(id);
        
        if (!comanda) {
            return res.status(404).json({ error: 'Comanda não encontrada.' });
        }

        res.status(200).json(comanda);

    } catch (error) {
        console.error('Erro ao buscar comanda:', error);
        res.status(500).json({ error: 'Erro interno ao buscar a comanda.' });
    }
}

/**
 * FECHAR COMANDA
 * Regra: Muda o status da comanda para 'F' (Fechada) e libera a mesa 'L' (Livre).
 */
export async function fechar(req, res) {
    const { id } = req.params;

    try {
        // 1. Verifica se a comanda existe antes de fechar
        const comanda = await comandaModel.buscarPorId(id);
        
        if (!comanda) {
            return res.status(404).json({ error: 'Comanda não encontrada.' });
        }

        // 2. Atualiza a comanda para Fechada ('F')
        const comandaFechada = await comandaModel.fechar(id);

        // 3. Libera a mesa atrelada a esta comanda mudando para Livre ('L')
        // (Nota: assumindo que a query de buscarPorId retorna a fk_mesa_id_mesa)
        await mesaModel.atualizarStatus(comanda.fk_mesa_id_mesa, 'L');

        // 4. Retorna sucesso (200 - OK)
        res.status(200).json(comandaFechada);

    } catch (error) {
        console.error('Erro ao fechar comanda:', error);
        res.status(500).json({ error: 'Erro interno ao fechar a comanda.' });
    }
}