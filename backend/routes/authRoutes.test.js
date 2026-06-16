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
jest.mock('../controllers/authController', () => ({
  registrar: jest.fn(),
  login: jest.fn(),
  listarPendentes: jest.fn(),
  aprovarUsuario: jest.fn(),
  rejeitarUsuario: jest.fn()
}));

jest.mock('../middleware/authMiddleware', () => ({
  autenticar: jest.fn(),
  apenasAdmin: jest.fn()
}));

describe('authRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar as rotas corretamente', () => {
    // Ao importar o route, os métodos do Router devem ser chamados
    require('./authRoutes');

    const controller = require('../controllers/authController');
    const { autenticar, apenasAdmin } = require('../middleware/authMiddleware');

    expect(mockPost).toHaveBeenCalledWith('/registrar', controller.registrar);
    expect(mockPost).toHaveBeenCalledWith('/login', controller.login);

    expect(mockGet).toHaveBeenCalledWith('/pendentes', autenticar, apenasAdmin, controller.listarPendentes);
    
    expect(mockPut).toHaveBeenCalledWith('/aprovar/:id', autenticar, apenasAdmin, controller.aprovarUsuario);
    expect(mockPut).toHaveBeenCalledWith('/rejeitar/:id', autenticar, apenasAdmin, controller.rejeitarUsuario);
  });
});
