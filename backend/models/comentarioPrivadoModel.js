const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const ComentarioPrivado = sequelize.define("ComentarioPrivado", {
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  demandaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

module.exports = ComentarioPrivado
