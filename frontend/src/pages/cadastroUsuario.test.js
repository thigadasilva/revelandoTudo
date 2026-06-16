import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import cadastroUsuario from './cadastroUsuario.vue';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('cadastroUsuario.vue', () => {
  let mockRouter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter = { push: vi.fn() };
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('valida codigo institucional curto', async () => {
    const wrapper = mount(cadastroUsuario, {
      global: { stubs: ['router-link'] }
    });

    await wrapper.setData({ senha: 'password', confirmarSenha: 'password', codigoInstitucional: 'ABC' });
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.vm.erro).toBe('Informe um código de turma válido.');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('cadastra com sucesso e redireciona', async () => {
    api.post.mockResolvedValue({});
    const wrapper = mount(cadastroUsuario, {
      global: { stubs: ['router-link'], mocks: { $router: mockRouter } }
    });

    await wrapper.setData({
      nome: 'Aluno',
      email: 'aluno@empresa.com',
      codigoInstitucional: 'ABCD',
      senha: 'password',
      confirmarSenha: 'password'
    });
    
    await wrapper.find('form').trigger('submit.prevent');

    expect(api.post).toHaveBeenCalledWith('/auth/registrar', {
      nome: 'Aluno',
      email: 'aluno@empresa.com',
      codigoInstitucional: 'ABCD',
      senha: 'password',
      role: 'student'
    });
    
    expect(wrapper.vm.sucesso).toBe('Solicitação enviada com sucesso! Aguarde aprovação.');
    
    vi.runAllTimers();
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });
});
