const express = require("express")
const router = express.Router()

const controller = require("../controllers/authController")

const {
  autenticar,
  apenasAdmin
} = require("../middleware/authMiddleware")

router.post("/registrar", controller.registrar)
router.post("/login", controller.login)

router.get(
  "/pendentes",
  autenticar,
  apenasAdmin,
  controller.listarPendentes
)

router.put(
  "/aprovar/:id",
  autenticar,
  apenasAdmin,
  controller.aprovarUsuario
)

module.exports = router