// O arquvivo serve para ver se o usuário tem o token e para ver se o cargo dele permite acesso à rota.
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'chave_secreta_mesasync_2024'; // Tem que ser a mesma chave do controller

// 1. VERIFICAR O CRACHÁ (Token)
export function autenticar(req, res, next) {
    // O React vai mandar o token no cabeçalho como: "Bearer eyJhbGciOiJIUz..."
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
    }

    // Separa a palavra "Bearer" do código do token
    const [, token] = authHeader.split(' ');

    try {
        // Verifica se o token é válido e não está expirado
        const payload = jwt.verify(token, JWT_SECRET);

        // Gruda as informações do usuário (id e cargo) na requisição
        req.usuario = payload;

        // Permite que a requisição siga para o Controller
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}

// 2. VERIFICAR PERMISSÃO DO CARGO
// Exemplo de uso: router.post('/', autenticar, autorizar(['GERENCIA']), usuarioController.criar)
export function autorizar(cargosPermitidos) {
    return (req, res, next) => {
        const { cargo_usuario } = req.usuario;

        // Se o cargo do crachá não estiver na lista permitida, bloqueia (403 Forbidden)
        if (!cargosPermitidos.includes(cargo_usuario)) {
            return res.status(403).json({ error: 'Acesso negado. Seu cargo não permite esta ação.' });
        }

        // Se tiver permissão, segue o fluxo
        next();
    };
}