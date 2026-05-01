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

module.exports = router