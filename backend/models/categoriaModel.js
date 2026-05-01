const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Categoria = sequelize.define("Categoria", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Categorias',
  freezeTableName: true
})

module.exports = Categoria