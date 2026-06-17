const { Turma } = require("../models")

function generateRandomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

exports.getTurmas = async (req, res) => {
  try {
    if (req.usuario.role !== "admin") {
      return res.status(403).json({ erro: "Acesso negado." })
    }

    const turmas = await Turma.findAll({
      where: { adminId: req.usuario.id },
      order: [["createdAt", "DESC"]]
    })

    res.json(turmas)
  } catch (error) {
    console.error("Erro ao buscar turmas:", error)
    res.status(500).json({ erro: "Erro ao buscar turmas" })
  }
}

exports.createTurma = async (req, res) => {
  try {
    if (req.usuario.role !== "admin") {
      return res.status(403).json({ erro: "Acesso negado." })
    }

    const { nome } = req.body

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ erro: "Nome da turma é obrigatório." })
    }

    let codigo
    let codigoExiste = true
    while (codigoExiste) {
      codigo = generateRandomCode()
      const existe = await Turma.findOne({ where: { codigo } })
      if (!existe) codigoExiste = false
    }

    const turma = await Turma.create({
      nome,
      codigo,
      adminId: req.usuario.id
    })

    res.status(201).json(turma)
  } catch (error) {
    console.error("Erro ao criar turma:", error)
    res.status(500).json({ erro: "Erro ao criar turma" })
  }
}
