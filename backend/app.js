require("dotenv").config()

const express = require("express")
const cors = require("cors")
const swaggerUi = require("swagger-ui-express")

const { sequelize } = require("./models")
const swaggerSpec = require("./swagger")

const demandasRoutes = require("./routes/demandasRoutes")
const authRoutes = require("./routes/authRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/demandas", demandasRoutes)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get("/openapi.json", (req, res) => res.json(swaggerSpec))

const PORT = process.env.PORT || 3000

sequelize.sync().then(() => {
  console.log("Banco sincronizado")

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
})