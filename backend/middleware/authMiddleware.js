const jwt = require("jsonwebtoken")
const { User } = require("../models") 


exports.autenticar = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido" })
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    
    
    const usuarioReal = await User.findByPk(decoded.id || decoded.userId)

    if (!usuarioReal) {
      return res.status(401).json({ erro: "Usuário não encontrado no banco" })
    }

    
    req.usuario = usuarioReal
    next()
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido ou expirado" })
  }
}


exports.apenasAdmin = (req, res, next) => {
  if (!req.usuario || req.usuario.role !== 'admin') {
    return res.status(403).json({ erro: "Acesso restrito a administradores" })
  }
  next()
}