const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const AtualizacaoDemanda = sequelize.define("atualizacaoDemandaModel", {

 mensagem: {
  type: DataTypes.TEXT,
  allowNull: false
 },

 status: {
  type: DataTypes.STRING,
  allowNull: false
 }

})

module.exports = AtualizacaoDemanda