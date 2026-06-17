const express = require('express');

// Mock express.Router
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockUse = jest.fn();

jest.mock('express', () => {
  return {
    Router: () => ({
      get: mockGet,
      post: mockPost,
      use: mockUse
    })
  };
});

// Mocks for controllers and middleware
jest.mock('../controllers/turmasController', () => ({
  getTurmas: jest.fn(),
  createTurma: jest.fn()
}));

jest.mock('../middleware/authMiddleware', () => ({
  autenticar: jest.fn()
}));

describe('turmasRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve registrar as rotas e middlewares corretamente', () => {
    require('./turmasRoutes');

    const controller = require('../controllers/turmasController');
    const { autenticar } = require('../middleware/authMiddleware');

    expect(mockUse).toHaveBeenCalledWith(autenticar);
    expect(mockGet).toHaveBeenCalledWith('/', controller.getTurmas);
    expect(mockPost).toHaveBeenCalledWith('/', controller.createTurma);
  });
});
