const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Demanda = sequelize.define("Demanda", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "Em análise"
  },

  dataAbertura: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },

  dataEsperada: {
    type: DataTypes.DATEONLY
  },

  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  solicitante: {
    type: DataTypes.STRING,
    allowNull: true
  }

})

module.exports = Demanda