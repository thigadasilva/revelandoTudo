const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const User = sequelize.define("User", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },

  cargo: {
    type: DataTypes.STRING,
    allowNull: false
  },

  empresa: {
    type: DataTypes.STRING
  },

  cnpj: {
    type: DataTypes.STRING
  },

  telefone: {
    type: DataTypes.STRING
  },

  role: {
  type: DataTypes.ENUM("admin", "student"),
  allowNull: false
},

codigoInstitucional: {
  type: DataTypes.STRING,
  allowNull: true
},

adminId: {
  type: DataTypes.INTEGER,
  allowNull: true
},

statusAcesso: {
  type: DataTypes.STRING,
  defaultValue: "pendente"
}

})

module.exports = User