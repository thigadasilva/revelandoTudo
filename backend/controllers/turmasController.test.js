const { getTurmas, createTurma } = require('./turmasController');
const { Turma } = require('../models');

jest.mock('../models', () => ({
  Turma: {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  }
}));

describe('turmasController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTurmas', () => {
    it('deve retornar 403 se o usuário não for admin', async () => {
      const req = { usuario: { role: 'student' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await getTurmas(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Acesso negado.' });
    });

    it('deve retornar a lista de turmas para um admin', async () => {
      const mockTurmas = [{ id: 1, nome: 'Turma 1' }];
      Turma.findAll.mockResolvedValue(mockTurmas);
      const req = { usuario: { role: 'admin', id: 1 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await getTurmas(req, res);

      expect(Turma.findAll).toHaveBeenCalledWith({
        where: { adminId: 1 },
        order: [['createdAt', 'DESC']]
      });
      expect(res.json).toHaveBeenCalledWith(mockTurmas);
    });

    it('deve retornar 500 em caso de erro', async () => {
      Turma.findAll.mockRejectedValue(new Error('DB Error'));
      const req = { usuario: { role: 'admin', id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await getTurmas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Erro ao buscar turmas' });
    });
  });

  describe('createTurma', () => {
    it('deve retornar 403 se o usuário não for admin', async () => {
      const req = { usuario: { role: 'student' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createTurma(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Acesso negado.' });
    });

    it('deve retornar 400 se o nome da turma não for fornecido', async () => {
      const req = { usuario: { role: 'admin' }, body: { nome: '' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createTurma(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Nome da turma é obrigatório.' });
    });

    it('deve criar uma turma com sucesso gerando um código único', async () => {
      Turma.findOne.mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce(null); // O primeiro código existe, o segundo não
      const mockTurma = { id: 2, nome: 'Nova Turma', codigo: 'ABCDE' };
      Turma.create.mockResolvedValue(mockTurma);
      
      const req = { usuario: { role: 'admin', id: 1 }, body: { nome: 'Nova Turma' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createTurma(req, res);

      expect(Turma.findOne).toHaveBeenCalledTimes(2);
      expect(Turma.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTurma);
    });

    it('deve retornar 500 em caso de erro', async () => {
      Turma.findOne.mockRejectedValue(new Error('DB Error'));
      const req = { usuario: { role: 'admin', id: 1 }, body: { nome: 'Nova Turma' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createTurma(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Erro ao criar turma' });
    });
  });
});
