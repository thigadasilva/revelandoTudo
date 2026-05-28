const express = require("express")
const router = express.Router()
const turmasController = require("../controllers/turmasController")
const { autenticar } = require("../middleware/authMiddleware")

router.use(autenticar)

router.get("/", turmasController.getTurmas)
router.post("/", turmasController.createTurma)

module.exports = router
