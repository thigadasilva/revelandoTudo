const { registrar, login, listarPendentes, aprovarUsuario, rejeitarUsuario } = require('./authController');
const { User, Turma } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
  Turma: {
    findOne: jest.fn(),
    create: jest.fn(),
  }
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registrar', () => {
    it('deve retornar 400 se o email já estiver cadastrado', async () => {
      User.findOne.mockResolvedValue({ id: 1, email: 'test@test.com' });
      const req = { body: { email: 'test@test.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await registrar(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'E-mail já cadastrado' });
    });

    it('deve registrar um admin e criar uma turma padrão', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.create.mockResolvedValue({ id: 1, role: 'admin' });
      Turma.create.mockResolvedValue({ id: 1 });

      const req = { body: { nome: 'Admin', email: 'admin@test.com', senha: '123', role: 'admin' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await registrar(req, res);

      expect(User.create).toHaveBeenCalled();
      expect(Turma.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Conta criada com sucesso.',
        user: { id: 1, role: 'admin' }
      });
    });

    it('deve retornar 400 se student não enviar código da turma', async () => {
      User.findOne.mockResolvedValue(null);
      const req = { body: { nome: 'Student', email: 'student@test.com', senha: '123', role: 'student', codigoInstitucional: '' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await registrar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Informe o código da turma.' });
    });

    it('deve retornar 400 se o código da turma for inválido', async () => {
      User.findOne.mockResolvedValue(null);
      Turma.findOne.mockResolvedValue(null);
      const req = { body: { nome: 'Student', email: 'student@test.com', senha: '123', role: 'student', codigoInstitucional: 'INVALID' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await registrar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Código da turma inválido.' });
    });

    it('deve registrar um student e vinculá-lo à turma como pendente', async () => {
      User.findOne.mockResolvedValue(null);
      Turma.findOne.mockResolvedValue({ id: 1, adminId: 2, codigo: 'VALID' });
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.create.mockResolvedValue({ id: 3, role: 'student' });

      const req = { body: { nome: 'Student', email: 'student@test.com', senha: '123', role: 'student', codigoInstitucional: 'VALID' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await registrar(req, res);

      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        role: 'student',
        statusAcesso: 'pendente',
        adminId: 2,
        turmaId: 1
      }));
      expect(res.json).toHaveBeenCalledWith({
        message: 'Solicitação enviada ao administrador.',
        user: { id: 3, role: 'student' }
      });
    });

    it('deve retornar 500 em caso de erro', async () => {
      User.findOne.mockRejectedValue(new Error('DB Error'));
      const req = { body: { email: 'test@test.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await registrar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar usuário' });
    });
  });

  describe('login', () => {
    it('deve retornar 401 se usuário não for encontrado', async () => {
      User.findOne.mockResolvedValue(null);
      const req = { body: { email: 'test@test.com', senha: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('deve retornar 401 se a senha for inválida', async () => {
      User.findOne.mockResolvedValue({ id: 1, senha: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);
      const req = { body: { email: 'test@test.com', senha: 'wrong' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Senha inválida' });
    });

    it('deve retornar 403 se o status do student for pendente', async () => {
      User.findOne.mockResolvedValue({ id: 1, senha: 'hashedPassword', role: 'student', statusAcesso: 'pendente' });
      bcrypt.compare.mockResolvedValue(true);
      const req = { body: { email: 'test@test.com', senha: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Seu cadastro está aguardando aprovação do administrador.' });
    });

    it('deve retornar 403 se o status do student for rejeitado', async () => {
      User.findOne.mockResolvedValue({ id: 1, senha: 'hashedPassword', role: 'student', statusAcesso: 'rejeitado' });
      bcrypt.compare.mockResolvedValue(true);
      const req = { body: { email: 'test@test.com', senha: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Seu acesso foi recusado pela instituição.' });
    });

    it('deve fazer login com sucesso', async () => {
      const mockUser = { id: 1, senha: 'hashedPassword', role: 'admin', adminId: null };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockedToken');
      
      const req = { body: { email: 'test@test.com', senha: '123' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ token: 'mockedToken', user: mockUser });
    });

    it('deve retornar 500 em caso de erro', async () => {
      User.findOne.mockRejectedValue(new Error('DB Error'));
      const req = { body: { email: 'test@test.com', senha: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Erro no login' }));
    });
  });

  describe('listarPendentes', () => {
    it('deve listar usuários pendentes', async () => {
      const mockUsers = [{ id: 1, nome: 'Test' }];
      User.findAll.mockResolvedValue(mockUsers);
      const req = { usuario: { id: 2 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await listarPendentes(req, res);

      expect(User.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { adminId: 2, role: 'student', statusAcesso: 'pendente' }
      }));
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('deve retornar 500 em caso de erro', async () => {
      User.findAll.mockRejectedValue(new Error('DB Error'));
      const req = { usuario: { id: 2 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await listarPendentes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('aprovarUsuario', () => {
    it('deve aprovar usuário', async () => {
      const mockUser = { id: 1, statusAcesso: 'pendente', save: jest.fn() };
      User.findOne.mockResolvedValue(mockUser);
      const req = { params: { id: 1 }, usuario: { id: 2 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await aprovarUsuario(req, res);

      expect(mockUser.statusAcesso).toBe('aprovado');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário aprovado com sucesso' });
    });

    it('deve retornar 404 se usuário não for encontrado', async () => {
      User.findOne.mockResolvedValue(null);
      const req = { params: { id: 1 }, usuario: { id: 2 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await aprovarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 500 em caso de erro', async () => {
      User.findOne.mockRejectedValue(new Error('DB Error'));
      const req = { params: { id: 1 }, usuario: { id: 2 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await aprovarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('rejeitarUsuario', () => {
    it('deve rejeitar usuário', async () => {
      const mockUser = { id: 1, statusAcesso: 'pendente', save: jest.fn() };
      User.findOne.mockResolvedValue(mockUser);
      const req = { params: { id: 1 }, usuario: { id: 2 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await rejeitarUsuario(req, res);

      expect(mockUser.statusAcesso).toBe('rejeitado');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Usuário rejeitado' });
    });

    it('deve retornar 404 se usuário não for encontrado', async () => {
      User.findOne.mockResolvedValue(null);
      const req = { params: { id: 1 }, usuario: { id: 2 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await rejeitarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 500 em caso de erro', async () => {
      User.findOne.mockRejectedValue(new Error('DB Error'));
      const req = { params: { id: 1 }, usuario: { id: 2 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await rejeitarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
