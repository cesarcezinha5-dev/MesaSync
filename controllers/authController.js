import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as usuarioModel from '../models/usuarioModel.js';

// Segredo para assinar o crachá (Em projetos reais, isso fica num arquivo .env escondido)
const JWT_SECRET = 'chave_secreta_mesasync_2024';

export async function login(req, res) {
    const { login_usuario, senha_usuario } = req.body;

    if (!login_usuario || !senha_usuario) {
        return res.status(400).json({ error: 'Login e senha são obrigatórios.' });
    }

    try {
        // 1. Busca o usuário no banco (lembre-se que o model hoje lança erro de stub)
        const usuario = await usuarioModel.buscarPorLogin(login_usuario);

        // Se o usuário não existir no banco
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciais inválidas.' }); // 401 = Não Autorizado
        }

        // 2. Compara a senha digitada com a senha criptografada que veio do banco
        const senhaValida = await bcrypt.compare(senha_usuario, usuario.senha_usuario);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // 3. Gera o Token JWT (O "Crachá")
        // Coloca o ID e o Cargo dentro do token para o sistema saber quem está logado
        const token = jwt.sign(
            { 
                id_usuario: usuario.id_usuario, 
                cargo_usuario: usuario.cargo_usuario 
            },
            JWT_SECRET,
            { expiresIn: '8h' } // O crachá vence após 8 horas de turno de trabalho
        );

        // 4. Retorna o token para o Front-end sem devolver a senha
        res.status(200).json({
            mensagem: 'Login realizado com sucesso',
            token: token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nome_usuario: usuario.nome_usuario,
                cargo_usuario: usuario.cargo_usuario
            }
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro interno ao realizar o login.' });
    }
}