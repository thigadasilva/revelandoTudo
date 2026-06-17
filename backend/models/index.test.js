const Sequelize = require('sequelize');

jest.mock('../config/database', () => ({
  authenticate: jest.fn(),
  define: jest.fn()
}));

jest.mock('./userModel', () => {
  const Sequelize = require('sequelize');
  class User extends Sequelize.Model {}
  User.hasMany = jest.fn();
  User.belongsTo = jest.fn();
  return User;
});

jest.mock('./demandaModel', () => {
  const Sequelize = require('sequelize');
  class Demanda extends Sequelize.Model {}
  Demanda.hasMany = jest.fn();
  Demanda.belongsTo = jest.fn();
  return Demanda;
});

jest.mock('./atualizacaoDemandaModel', () => {
  const Sequelize = require('sequelize');
  class AtualizacaoDemanda extends Sequelize.Model {}
  AtualizacaoDemanda.hasMany = jest.fn();
  AtualizacaoDemanda.belongsTo = jest.fn();
  return AtualizacaoDemanda;
});

jest.mock('./turmaModel', () => {
  const Sequelize = require('sequelize');
  class Turma extends Sequelize.Model {}
  Turma.hasMany = jest.fn();
  Turma.belongsTo = jest.fn();
  return Turma;
});

jest.mock('./comentarioPrivadoModel', () => {
  const Sequelize = require('sequelize');
  class ComentarioPrivado extends Sequelize.Model {}
  ComentarioPrivado.hasMany = jest.fn();
  ComentarioPrivado.belongsTo = jest.fn();
  return ComentarioPrivado;
});

describe('Models Associations', () => {
  it('deve definir corretamente as associações dos models', () => {
    // Ao requerer o index.js, as associações devem ser chamadas
    const models = require('./index');

    const User = models.User;
    const Demanda = models.Demanda;
    const AtualizacaoDemanda = models.AtualizacaoDemanda;
    const Turma = models.Turma;
    const ComentarioPrivado = models.ComentarioPrivado;

    // Verificar Associações de User
    expect(User.hasMany).toHaveBeenCalledWith(Demanda, expect.any(Object));
    expect(User.hasMany).toHaveBeenCalledWith(User, expect.any(Object)); // Students
    expect(User.belongsTo).toHaveBeenCalledWith(User, expect.any(Object)); // Admin
    expect(User.hasMany).toHaveBeenCalledWith(ComentarioPrivado, expect.any(Object));
    expect(User.hasMany).toHaveBeenCalledWith(Turma, expect.any(Object));
    expect(User.belongsTo).toHaveBeenCalledWith(Turma, expect.any(Object));

    // Verificar Associações de Demanda
    expect(Demanda.belongsTo).toHaveBeenCalledWith(User, expect.any(Object));
    expect(Demanda.hasMany).toHaveBeenCalledWith(AtualizacaoDemanda, expect.any(Object));
    expect(Demanda.hasMany).toHaveBeenCalledWith(ComentarioPrivado, expect.any(Object));

    // Verificar Associações de AtualizacaoDemanda
    expect(AtualizacaoDemanda.belongsTo).toHaveBeenCalledWith(Demanda, expect.any(Object));

    // Verificar Associações de ComentarioPrivado
    expect(ComentarioPrivado.belongsTo).toHaveBeenCalledWith(Demanda, expect.any(Object));
    expect(ComentarioPrivado.belongsTo).toHaveBeenCalledWith(User, expect.any(Object));

    // Verificar Associações de Turma
    expect(Turma.belongsTo).toHaveBeenCalledWith(User, expect.any(Object));
    expect(Turma.hasMany).toHaveBeenCalledWith(User, expect.any(Object));
  });
});
