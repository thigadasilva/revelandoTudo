const { 
  getDemandas, 
  createDemanda, 
  updateStatus, 
  updateDemanda, 
  getAtualizacoesDemanda, 
  aprovarDemanda, 
  recusarDemanda, 
  getComentariosPrivados, 
  addComentarioPrivado 
} = require('./demandasController');

const { Demanda, AtualizacaoDemanda, ComentarioPrivado, User } = require('../models');

jest.mock('../models', () => ({
  Demanda: {
    findAll: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn()
  },
  AtualizacaoDemanda: {
    create: jest.fn(),
    findAll: jest.fn()
  },
  ComentarioPrivado: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  },
  User: {}
}));

describe('demandasController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDemandas', () => {
    it('deve retornar demandas para admin', async () => {
      const mockDemandas = [{ id: 1, titulo: 'Demanda 1' }];
      Demanda.findAll.mockResolvedValue(mockDemandas);
      const req = { usuario: { role: 'admin', id: 1 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await getDemandas(req, res);

      expect(Demanda.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { adminId: 1 }
      }));
      expect(res.json).toHaveBeenCalledWith(mockDemandas);
    });

    it('deve retornar demandas para student', async () => {
      const mockDemandas = [{ id: 1, titulo: 'Demanda 1' }];
      Demanda.findAll.mockResolvedValue(mockDemandas);
      const req = { usuario: { role: 'student', id: 2, adminId: 1 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await getDemandas(req, res);

      expect(Demanda.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockDemandas);
    });

    it('deve retornar 500 em erro', async () => {
      Demanda.findAll.mockRejectedValue(new Error('DB Error'));
      const req = { usuario: { role: 'admin', id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await getDemandas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('createDemanda', () => {
    it('deve retornar 400 se titulo ou descricao não forem enviados', async () => {
      const req = { body: { titulo: '', descricao: '' }, usuario: { id: 1, role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createDemanda(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Título e descrição são obrigatórios.' });
    });

    it('deve retornar 400 se instituição não for identificada', async () => {
      const req = { body: { titulo: 'Teste', descricao: 'Desc' }, usuario: { id: 1, role: 'student', adminId: null } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createDemanda(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ erro: 'Instituição não identificada para este usuário.' });
    });

    it('deve criar uma demanda com sucesso', async () => {
      const req = { body: { titulo: 'Teste', descricao: 'Desc' }, usuario: { id: 1, role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const mockDemanda = { id: 1, titulo: 'Teste' };
      Demanda.create.mockResolvedValue(mockDemanda);

      await createDemanda(req, res);

      expect(Demanda.create).toHaveBeenCalled();
      expect(AtualizacaoDemanda.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockDemanda);
    });

    it('deve retornar 500 em caso de erro', async () => {
      Demanda.create.mockRejectedValue(new Error('DB Error'));
      const req = { body: { titulo: 'Teste', descricao: 'Desc' }, usuario: { id: 1, role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createDemanda(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateStatus', () => {
    it('deve atualizar o status da demanda', async () => {
      const demandaMock = { id: 1, status: 'Em análise', save: jest.fn() };
      Demanda.findOne.mockResolvedValue(demandaMock);

      const req = { params: { id: 1 }, body: { status: 'Concluída' }, usuario: { id: 1, role: 'admin' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await updateStatus(req, res);

      expect(Demanda.findOne).toHaveBeenCalled();
      expect(demandaMock.status).toBe('Concluída');
      expect(demandaMock.save).toHaveBeenCalled();
      expect(AtualizacaoDemanda.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(demandaMock);
    });

    it('deve retornar 404 se não encontrada', async () => {
      Demanda.findOne.mockResolvedValue(null);
      const req = { params: { id: 1 }, body: { status: 'Concluída' }, usuario: { id: 1, role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 500 em erro', async () => {
      Demanda.findOne.mockRejectedValue(new Error('DB Error'));
      const req = { params: { id: 1 }, body: { status: 'Concluída' }, usuario: { id: 1, role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await updateStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateDemanda', () => {
    it('deve editar a demanda', async () => {
      const demandaMock = { id: 1, titulo: 'Antigo', save: jest.fn() };
      Demanda.findOne.mockResolvedValue(demandaMock);

      const req = { params: { id: 1 }, body: { titulo: 'Novo', mensagem: 'Editou' }, usuario: { id: 1, role: 'admin' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await updateDemanda(req, res);

      expect(Demanda.findOne).toHaveBeenCalled();
      expect(demandaMock.titulo).toBe('Novo');
      expect(demandaMock.save).toHaveBeenCalled();
      expect(AtualizacaoDemanda.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(demandaMock);
    });

    it('deve retornar 404 se não encontrada', async () => {
      Demanda.findOne.mockResolvedValue(null);
      const req = { params: { id: 1 }, body: { titulo: 'Novo' }, usuario: { id: 1, role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await updateDemanda(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 500 em erro', async () => {
      Demanda.findOne.mockRejectedValue(new Error('DB Error'));
      const req = { params: { id: 1 }, body: { titulo: 'Novo' }, usuario: { id: 1, role: 'admin' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await updateDemanda(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAtualizacoesDemanda', () => {
    it('deve retornar atualizações', async () => {
      const mockAtualizacoes = [{ id: 1, mensagem: 'Msg' }];
      AtualizacaoDemanda.findAll.mockResolvedValue(mockAtualizacoes);
      const req = { params: { id: 1 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await getAtualizacoesDemanda(req, res);

      expect(AtualizacaoDemanda.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { demandaId: 1 } }));
      expect(res.json).toHaveBeenCalledWith(mockAtualizacoes);
    });

    it('deve retornar 500 em erro', async () => {
      AtualizacaoDemanda.findAll.mockRejectedValue(new Error('DB Error'));
      const req = { params: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await getAtualizacoesDemanda(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('aprovarDemanda e recusarDemanda', () => {
    it('deve aprovar demanda', async () => {
      const demandaMock = { id: 1, status: 'Em análise', save: jest.fn() };
      Demanda.findOne.mockResolvedValue(demandaMock);

      const req = { params: { id: 1 }, usuario: { id: 1 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await aprovarDemanda(req, res);

      expect(demandaMock.status).toBe('Em andamento');
      expect(demandaMock.save).toHaveBeenCalled();
      expect(AtualizacaoDemanda.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(demandaMock);
    });

    it('deve retornar 404 em aprovarDemanda se não encontrada', async () => {
      Demanda.findOne.mockResolvedValue(null);
      const req = { params: { id: 1 }, usuario: { id: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await aprovarDemanda(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve recusar demanda', async () => {
      const demandaMock = { id: 1, status: 'Em análise', save: jest.fn() };
      Demanda.findOne.mockResolvedValue(demandaMock);

      const req = { params: { id: 1 }, usuario: { id: 1 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await recusarDemanda(req, res);

      expect(demandaMock.status).toBe('Recusada');
      expect(demandaMock.save).toHaveBeenCalled();
      expect(AtualizacaoDemanda.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getComentariosPrivados e addComentarioPrivado', () => {
    it('deve retornar comentarios privados com acesso permitido', async () => {
      const demandaMock = { id: 1, userId: 1, adminId: 2 };
      Demanda.findByPk.mockResolvedValue(demandaMock);
      const mockComentarios = [{ id: 1, texto: 'Privado' }];
      ComentarioPrivado.findAll.mockResolvedValue(mockComentarios);

      const req = { params: { id: 1 }, usuario: { id: 1, role: 'student' } }; // Criador
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      await getComentariosPrivados(req, res);

      expect(res.json).toHaveBeenCalledWith(mockComentarios);
    });

    it('deve retornar 403 se acesso for negado em comentarios', async () => {
      const demandaMock = { id: 1, userId: 2, adminId: 3 };
      Demanda.findByPk.mockResolvedValue(demandaMock);

      const req = { params: { id: 1 }, usuario: { id: 1, role: 'student' } }; // Não é criador nem admin
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await getComentariosPrivados(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deve adicionar comentario privado', async () => {
      const demandaMock = { id: 1, userId: 1, adminId: 2, status: 'Em andamento' };
      Demanda.findByPk.mockResolvedValue(demandaMock);
      
      const mockComentario = { id: 1, texto: 'Novo com' };
      ComentarioPrivado.create.mockResolvedValue(mockComentario);
      ComentarioPrivado.findByPk.mockResolvedValue(mockComentario);

      const req = { params: { id: 1 }, body: { texto: 'Novo com' }, usuario: { id: 1, role: 'student' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await addComentarioPrivado(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockComentario);
    });

    it('deve retornar 400 se texto não for fornecido', async () => {
      const req = { params: { id: 1 }, body: { texto: '' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await addComentarioPrivado(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
    
    it('deve retornar 403 se tentar comentar em demanda recusada', async () => {
      const demandaMock = { id: 1, status: 'Recusada' };
      Demanda.findByPk.mockResolvedValue(demandaMock);

      const req = { params: { id: 1 }, body: { texto: 'Texto' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await addComentarioPrivado(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});