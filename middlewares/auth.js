import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_mesasync_2024';

export function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}

export function autorizar(cargosPermitidos) {
    return (req, res, next) => {
        const { cargo_usuario } = req.usuario;

        if (!cargosPermitidos.includes(cargo_usuario)) {
            return res.status(403).json({ error: 'Acesso negado. Seu cargo não permite esta ação.' });
        }
        next();
    };
}