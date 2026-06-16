const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Turma = sequelize.define("Turma", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

module.exports = Turma
