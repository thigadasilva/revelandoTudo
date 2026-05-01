
const { Categoria } = require("../models");

const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      order: [['nome', 'ASC']]
    });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
};


const criarCategoria = async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "O nome da categoria é obrigatório." });
    }

    
    const novaCategoria = await Categoria.create({ nome });
    
    return res.status(201).json(novaCategoria);
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return res.status(500).json({ error: "Erro interno ao criar categoria." });
  }
};


const deletarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    
    const deletados = await Categoria.destroy({
      where: { id: id }
    });

    if (deletados === 0) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    return res.json({ message: "Categoria excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return res.status(400).json({ error: "Não foi possível excluir a categoria." });
  }
};


module.exports = {
  getCategorias,
  criarCategoria,
  deletarCategoria
};