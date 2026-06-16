const express = require('express');

// Mock express.Router
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();

jest.mock('express', () => {
  return {
    Router: () => ({
      get: mockGet,
      post: mockPost,
      put: mockPut
    })
  };
});

// Mocks for controllers and middleware
jest.mock('../controllers/demandasController', () => ({
  getDemandas: jest.fn(),
  createDemanda: jest.fn(),
  updateDemanda: jest.fn(),
  updateStatus: jest.fn(),
  getAtualizacoesDemanda: jest.fn(),
  aprovarDemanda: jest.fn(),
  recusarDemanda: jest.fn(),
  getComentariosPrivados: jest.fn(),
  addComentarioPrivado: jest.fn()
}));

jest.mock('../middleware/authMiddleware', () => ({
  autenticar: jest.fn(),
  apenasAdmin: jest.fn()
}));

describe('demandasRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar as rotas corretamente', () => {
    require('./demandasRoutes');

    const controller = require('../controllers/demandasController');
    const { autenticar, apenasAdmin } = require('../middleware/authMiddleware');

    expect(mockGet).toHaveBeenCalledWith('/', autenticar, controller.getDemandas);
    expect(mockPost).toHaveBeenCalledWith('/', autenticar, controller.createDemanda);
    expect(mockPut).toHaveBeenCalledWith('/:id', autenticar, controller.updateDemanda);
    expect(mockPut).toHaveBeenCalledWith('/:id/status', autenticar, controller.updateStatus);
    expect(mockGet).toHaveBeenCalledWith('/:id/atualizacoes', autenticar, controller.getAtualizacoesDemanda);
    expect(mockPut).toHaveBeenCalledWith('/:id/aprovar', autenticar, apenasAdmin, controller.aprovarDemanda);
    expect(mockPut).toHaveBeenCalledWith('/:id/recusar', autenticar, apenasAdmin, controller.recusarDemanda);
    expect(mockGet).toHaveBeenCalledWith('/:id/comentarios', autenticar, controller.getComentariosPrivados);
    expect(mockPost).toHaveBeenCalledWith('/:id/comentarios', autenticar, controller.addComentarioPrivado);
  });
});
