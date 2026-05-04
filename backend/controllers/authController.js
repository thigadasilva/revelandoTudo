const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { User } = require("../models")




exports.registrar = async (req, res) => {
  try {
    const {
      nome,
      email,
      cargo,
      senha,
      role,
      empresa,
      cnpj,
      telefone,
      codigoInstitucional
    } = req.body

    const usuarioExistente = await User.findOne({
      where: { email }
    })

    if (usuarioExistente) {
      return res.status(400).json({
        error: "E-mail já cadastrado"
      })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    let adminId = null
    let statusAcesso = "aprovado"

    
    
    
    if (role === "admin") {

      if (!codigoInstitucional || codigoInstitucional.trim() === "") {
        return res.status(400).json({
          error: "Informe um código institucional."
        })
      }

      const codigoExiste = await User.findOne({
        where: {
          codigoInstitucional,
          role: "admin"
        }
      })

      if (codigoExiste) {
        return res.status(400).json({
          error: "Esse código institucional já está em uso."
        })
      }

      statusAcesso = "aprovado"
    }

    
    
    
    if (role === "student") {

      if (!codigoInstitucional || codigoInstitucional.trim() === "") {
        return res.status(400).json({
          error: "Informe o código institucional."
        })
      }

      const admin = await User.findOne({
        where: {
          codigoInstitucional,
          role: "admin"
        }
      })

      if (!admin) {
        return res.status(400).json({
          error: "Código institucional inválido."
        })
      }

      adminId = admin.id
      statusAcesso = "pendente"
    }

    const user = await User.create({
      nome,
      email,
      senha: senhaHash,
      cargo,
      role,
      empresa,
      cnpj,
      telefone,
      codigoInstitucional,
      adminId,
      statusAcesso
    })

    res.json({
      message:
        role === "student"
          ? "Solicitação enviada ao administrador."
          : "Conta criada com sucesso.",
      user
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao criar usuário"
    })
  }
}




exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body

    const user = await User.findOne({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        error: "Usuário não encontrado"
      })
    }

    const senhaValida = await bcrypt.compare(
      senha,
      user.senha
    )

    if (!senhaValida) {
      return res.status(401).json({
        error: "Senha inválida"
      })
    }

    
    if (
      user.role === "student" &&
      user.statusAcesso === "pendente"
    ) {
      return res.status(403).json({
        error:
          "Seu cadastro está aguardando aprovação do administrador."
      })
    }

    
    if (
      user.role === "student" &&
      user.statusAcesso === "rejeitado"
    ) {
      return res.status(403).json({
        error:
          "Seu acesso foi recusado pela instituição."
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        adminId: user.adminId
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    )

    res.json({
      token,
      user
    })

  } catch (error) {
    console.error("🚨 ERRO NO LOGIN:")
    console.error("Mensagem:", error.message)
    console.error("Stack:", error.stack)
    res.status(500).json({
      error: "Erro no login",
      detalhes: error.message
    })
  }
}




exports.listarPendentes = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      where: {
        adminId: req.usuario.id,
        role: "student",
        statusAcesso: "pendente"
      },
      attributes: [
        "id",
        "nome",
        "email",
        "cargo",
        "createdAt"
      ],
      order: [["createdAt", "DESC"]]
    })

    res.json(usuarios)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao listar pendentes"
    })
  }
}




exports.aprovarUsuario = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await User.findOne({
      where: {
        id,
        adminId: req.usuario.id,
        role: "student"
      }
    })

    if (!usuario) {
      return res.status(404).json({
        error: "Usuário não encontrado"
      })
    }

    usuario.statusAcesso = "aprovado"
    await usuario.save()

    res.json({
      message: "Usuário aprovado com sucesso"
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao aprovar usuário"
    })
  }
}




exports.rejeitarUsuario = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await User.findOne({
      where: {
        id,
        adminId: req.usuario.id,
        role: "student"
      }
    })

    if (!usuario) {
      return res.status(404).json({
        error: "Usuário não encontrado"
      })
    }

    usuario.statusAcesso = "rejeitado"
    await usuario.save()

    res.json({
      message: "Usuário rejeitado"
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: "Erro ao rejeitar usuário"
    })
  }
}