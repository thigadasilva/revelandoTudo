const sequelize = require("../config/database")

const User = require("./userModel")
const Demanda = require("./demandaModel")
const AtualizacaoDemanda = require("./atualizacaoDemandaModel")


User.hasMany(Demanda, {
  foreignKey: "userId",
  as: "Demandas"
})

Demanda.belongsTo(User, {
  foreignKey: "userId",
  as: "User"
})


User.hasMany(User, {
  foreignKey: "adminId",
  as: "Students"
})

User.belongsTo(User, {
  foreignKey: "adminId",
  as: "Admin"
})


Demanda.hasMany(AtualizacaoDemanda, {
  foreignKey: "demandaId",
  as: "Atualizacoes"
})

AtualizacaoDemanda.belongsTo(Demanda, {
  foreignKey: "demandaId",
  as: "Demanda"
})

module.exports = {
  sequelize,
  User,
  Demanda,
  AtualizacaoDemanda
}