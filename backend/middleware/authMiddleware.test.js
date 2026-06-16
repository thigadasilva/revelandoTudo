const { autenticar, apenasAdmin } = require('./authMiddleware');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

jest.mock('../models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('autenticar', () => {
    it('deve retornar 401 se não enviar token', async () => {
      const req = { headers: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await autenticar(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Token não fornecido' });
    });

    it('deve retornar 401 se token for inválido', async () => {
      const req = { headers: { authorization: 'Bearer invalidToken' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      jwt.verify.mockImplementation(() => { throw new Error('Inválido') });

      await autenticar(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Token inválido ou expirado' });
    });

    it('deve retornar 401 se o usuário não existir no banco', async () => {
      const req = { headers: { authorization: 'Bearer validToken' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      jwt.verify.mockReturnValue({ id: 1 });
      User.findByPk.mockResolvedValue(null);

      await autenticar(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Usuário não encontrado no banco' });
    });

    it('deve chamar next se o usuário for autenticado', async () => {
      const req = { headers: { authorization: 'Bearer validToken' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      jwt.verify.mockReturnValue({ id: 1 });
      const mockUser = { id: 1, nome: 'Test' };
      User.findByPk.mockResolvedValue(mockUser);

      await autenticar(req, res, next);

      expect(req.usuario).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('apenasAdmin', () => {
    it('deve retornar 403 se o usuário não for admin', () => {
      const req = { usuario: { role: 'student' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      apenasAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Acesso restrito a administradores' });
    });

    it('deve chamar next se o usuário for admin', () => {
      const req = { usuario: { role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      apenasAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
