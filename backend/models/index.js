const sequelize = require("../config/database")

const User = require("./userModel")
const Demanda = require("./demandaModel")
const AtualizacaoDemanda = require("./atualizacaoDemandaModel")
const Turma = require("./turmaModel")
const ComentarioPrivado = require("./comentarioPrivadoModel")


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

Demanda.hasMany(ComentarioPrivado, {
  foreignKey: "demandaId",
  as: "ComentariosPrivados"
})

ComentarioPrivado.belongsTo(Demanda, {
  foreignKey: "demandaId",
  as: "Demanda"
})

User.hasMany(ComentarioPrivado, {
  foreignKey: "userId",
  as: "ComentariosPrivados"
})

ComentarioPrivado.belongsTo(User, {
  foreignKey: "userId",
  as: "User"
})


User.hasMany(Turma, {
  foreignKey: "adminId",
  as: "Turmas"
})

Turma.belongsTo(User, {
  foreignKey: "adminId",
  as: "Admin"
})

Turma.hasMany(User, {
  foreignKey: "turmaId",
  as: "Students"
})

User.belongsTo(Turma, {
  foreignKey: "turmaId",
  as: "Turma"
})


module.exports = {
  sequelize,
  User,
  Demanda,
  AtualizacaoDemanda,
  Turma,
  ComentarioPrivado
}