const express = require("express")
const router = express.Router()

const controller = require("../controllers/demandasController")


const {
  autenticar,
  apenasAdmin
} = require("../middleware/authMiddleware")






router.get("/", autenticar, controller.getDemandas)


router.post("/", autenticar, controller.createDemanda)


router.put("/:id", autenticar, controller.updateDemanda)


router.put("/:id/status", autenticar, controller.updateStatus)


router.get("/:id/atualizacoes", autenticar, controller.getAtualizacoesDemanda)

router.put("/:id/aprovar", autenticar, apenasAdmin, controller.aprovarDemanda)

router.put("/:id/recusar", autenticar, apenasAdmin, controller.recusarDemanda)

router.get("/:id/comentarios", autenticar, controller.getComentariosPrivados)
router.post("/:id/comentarios", autenticar, controller.addComentarioPrivado)

module.exports = router