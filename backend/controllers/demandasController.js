const { Demanda, Categoria, AtualizacaoDemanda } = require("../models")


exports.getDemandas = async (req, res) => {
  try {
    let where = {}

    
    if (req.usuario.role === "admin") {
      where.adminId = req.usuario.id
    }

    
    if (req.usuario.role === "student") {
      where.adminId = req.usuario.adminId
    }

    const demandas = await Demanda.findAll({
      where,
      include: [{ model: Categoria, as: "Categoria" }],
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
    const { titulo, descricao, categoriaId, dataEsperada } = req.body

    
    const idDaEmpresa = req.usuario.role === "admin" ? req.usuario.id : req.usuario.adminId

    
    const demanda = await Demanda.create({
      titulo,
      descricao,
      categoriaId: categoriaId || null, 
      userId: req.usuario.id,
      adminId: idDaEmpresa,
      status: "Em análise",
      dataEsperada: dataEsperada || null,
      dataAbertura: new Date() 
    })

    
    await AtualizacaoDemanda.create({
      mensagem: "Demanda criada com sucesso",
      status: "Em análise",
      demandaId: demanda.id
    })

    res.status(201).json(demanda)

  } catch (error) {
    
    console.error("🚨 Erro fatal no createDemanda:", error) 
    res.status(500).json({ erro: "Erro ao criar demanda", detalhes: error.message })
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

    const { titulo, descricao, categoriaId, status, dataEsperada, mensagem } = req.body

    demanda.titulo = titulo
    demanda.descricao = descricao
    demanda.categoriaId = categoriaId || null
    demanda.status = status
    demanda.dataEsperada = dataEsperada || null

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