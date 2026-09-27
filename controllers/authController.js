import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as usuarioModel from '../models/usuarioModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_mesasync_2024';

export async function login(req, res) {
    const { login_usuario, senha_usuario } = req.body;

    if (!login_usuario || !senha_usuario) {
        return res.status(400).json({ error: 'Login e senha são obrigatórios.' });
    }

    try {
        // Usa a nova função que traz a senha do banco de dados
        const usuario = await usuarioModel.buscarPorLoginComSenha(login_usuario);

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const senhaValida = await bcrypt.compare(senha_usuario, usuario.senha_usuario);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, cargo_usuario: usuario.cargo_usuario },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

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