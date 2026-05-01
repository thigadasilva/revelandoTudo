const express = require("express");
const router = express.Router();


const controller = require("../controllers/categoriasController");


router.get("/", controller.getCategorias);
router.post('/', controller.criarCategoria);
router.delete('/:id', controller.deletarCategoria);

module.exports = router;