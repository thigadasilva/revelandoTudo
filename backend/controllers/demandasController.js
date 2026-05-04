const { Demanda, AtualizacaoDemanda } = require("../models")


exports.getDemandas = async (req, res) => {
  try {
    const { Op } = require("sequelize")
    let where = {}

    if (req.usuario.role === "admin") {
      where.adminId = req.usuario.id
      // No dashboard admin, não mostrar recusadas no controle (o usuário disse para não aparecer na tabela de controle)
      where.status = { [Op.ne]: "Recusada" }
    }

    if (req.usuario.role === "student") {
      where.adminId = req.usuario.adminId
      // Aluno vê todas não recusadas OU as recusadas que ele mesmo criou
      where[Op.or] = [
        { status: { [Op.ne]: "Recusada" } },
        { userId: req.usuario.id, status: "Recusada" }
      ]
    }

    const demandas = await Demanda.findAll({
      where,
      order: [['createdAt', 'DESC']] 
    })

    res.json(demandas)

  } catch (error) {
    console.error("Erro no getDemandas:", error)
    res.status(500).json({ erro: "Erro ao buscar demandas" })
  }
}


exports.createDemanda = async (req, res) => {
  try {
    const { titulo, descricao, dataEsperada } = req.body

    if (!titulo || !descricao) {
      return res.status(400).json({ erro: "Título e descrição são obrigatórios." })
    }

    const idDaEmpresa = req.usuario.role === "admin" ? req.usuario.id : req.usuario.adminId

    if (!idDaEmpresa) {
      return res.status(400).json({ erro: "Instituição não identificada para este usuário." })
    }

    const demanda = await Demanda.create({
      titulo,
      descricao,
      userId: req.usuario.id,
      adminId: idDaEmpresa,
      status: "Em análise",
      dataEsperada: (dataEsperada && dataEsperada.trim() !== "") ? dataEsperada : null
    })

    
    await AtualizacaoDemanda.create({
      mensagem: "Demanda criada com sucesso",
      status: "Em análise",
      demandaId: demanda.id
    })

    res.status(201).json(demanda)

  } catch (error) {
    console.error("🚨 ERRO NO CREATE DEMANDA:")
    console.error("Mensagem:", error.message)
    console.error("Stack:", error.stack)
    if (error.errors) {
      console.error("Validation Errors:", error.errors.map(e => e.message))
    }
    res.status(500).json({ 
      erro: "Erro ao criar demanda", 
      detalhes: error.message,
      validacoes: error.errors ? error.errors.map(e => e.message) : []
    })
  }
}


exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, mensagem } = req.body

    const demanda = await Demanda.findOne({
      where: {
        id,
        adminId: req.usuario.role === "admin" ? req.usuario.id : req.usuario.adminId
      }
    })

    if (!demanda) {
      return res.status(404).json({ erro: "Demanda não encontrada" })
    }

    demanda.status = status
    await demanda.save()

    await AtualizacaoDemanda.create({
      mensagem: mensagem || `Status alterado para ${status}`,
      status,
      demandaId: id
    })

    res.json(demanda)

  } catch (error) {
    console.error("Erro no updateStatus:", error)
    res.status(500).json({ erro: "Erro ao atualizar status" })
  }
}


exports.updateDemanda = async (req, res) => {
  try {
    const { id } = req.params

    const demanda = await Demanda.findOne({
      where: {
        id,
        adminId: req.usuario.role === "admin" ? req.usuario.id : req.usuario.adminId
      }
    })

    if (!demanda) {
      return res.status(404).json({ erro: "Demanda não encontrada" })
    }

    const { titulo, descricao, status, dataEsperada, mensagem } = req.body

    demanda.titulo = titulo
    demanda.descricao = descricao
    demanda.status = status
    demanda.dataEsperada = (dataEsperada && dataEsperada.trim() !== "") ? dataEsperada : null

    await demanda.save()

    
    if (mensagem) {
      await AtualizacaoDemanda.create({
        mensagem: mensagem,
        status: status,
        demandaId: id
      })
    }

    res.json(demanda)

  } catch (error) {
    console.error("Erro no updateDemanda:", error)
    res.status(500).json({ erro: "Erro ao editar demanda" })
  }
}


exports.getAtualizacoesDemanda = async (req, res) => {
  try {
    const { id } = req.params

    const atualizacoes = await AtualizacaoDemanda.findAll({
      where: { demandaId: id },
      order: [["createdAt", "ASC"]]
    })

    res.json(atualizacoes)

  } catch (error) {
    console.error("Erro no getAtualizacoesDemanda:", error)
    res.status(500).json({ erro: "Erro ao buscar histórico" })
  }
}


exports.aprovarDemanda = async (req, res) => {
  try {
    const { id } = req.params

    const demanda = await Demanda.findOne({
      where: { id, adminId: req.usuario.id }
    })

    if (!demanda) {
      return res.status(404).json({ erro: "Demanda não encontrada" })
    }

    demanda.status = "Em andamento"
    await demanda.save()

    await AtualizacaoDemanda.create({
      mensagem: "Demanda aprovada e em andamento.",
      status: "Em andamento",
      demandaId: id
    })

    res.json(demanda)

  } catch (error) {
    console.error("Erro no aprovarDemanda:", error)
    res.status(500).json({ erro: "Erro ao aprovar demanda" })
  }
}


exports.recusarDemanda = async (req, res) => {
  try {
    const { id } = req.params

    const demanda = await Demanda.findOne({
      where: { id, adminId: req.usuario.id }
    })

    if (!demanda) {
      return res.status(404).json({ erro: "Demanda não encontrada" })
    }

    demanda.status = "Recusada"
    await demanda.save()

    await AtualizacaoDemanda.create({
      mensagem: "Demanda recusada pelo administrador.",
      status: "Recusada",
      demandaId: id
    })

    res.json({ mensagem: "Demanda recusada com sucesso", demanda })

  } catch (error) {
    console.error("Erro no recusarDemanda:", error)
    res.status(500).json({ erro: "Erro ao recusar demanda" })
  }
}