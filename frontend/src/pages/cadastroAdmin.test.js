import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import cadastroAdmin from './cadastroAdmin.vue';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('cadastroAdmin.vue', () => {
  let mockRouter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter = { push: vi.fn() };
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('valida senhas não coincidentes', async () => {
    const wrapper = mount(cadastroAdmin, {
      global: { stubs: ['router-link'] }
    });

    await wrapper.setData({ senha: '123', confirmarSenha: '321' });
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.vm.erro).toBe('As senhas não coincidem.');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('valida senha muito curta', async () => {
    const wrapper = mount(cadastroAdmin, {
      global: { stubs: ['router-link'] }
    });

    await wrapper.setData({ senha: '123', confirmarSenha: '123' });
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.vm.erro).toBe('A senha precisa ter no mínimo 6 caracteres.');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('cadastra com sucesso e redireciona', async () => {
    api.post.mockResolvedValue({});
    const wrapper = mount(cadastroAdmin, {
      global: { stubs: ['router-link'], mocks: { $router: mockRouter } }
    });

    await wrapper.setData({
      nome: 'Admin',
      empresa: 'Empresa',
      telefone: '119999',
      email: 'admin@empresa.com',
      senha: 'password',
      confirmarSenha: 'password'
    });
    
    await wrapper.find('form').trigger('submit.prevent');

    expect(api.post).toHaveBeenCalledWith('/auth/registrar', {
      nome: 'Admin',
      empresa: 'Empresa',
      telefone: '119999',
      email: 'admin@empresa.com',
      senha: 'password',
      role: 'admin'
    });
    
    expect(wrapper.vm.sucesso).toBe('Conta criada com sucesso!');
    
    vi.runAllTimers();
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('lida com erro de API no cadastro', async () => {
    vi.useRealTimers();
    api.post.mockRejectedValue({ response: { data: { error: 'E-mail em uso' } } });
    const wrapper = mount(cadastroAdmin, {
      global: { stubs: ['router-link'] }
    });

    await wrapper.setData({
      senha: 'password',
      confirmarSenha: 'password'
    });
    
    await wrapper.find('form').trigger('submit.prevent');

    // precisará de um tick para a promise ser rejeitada
    await new Promise(r => setTimeout(r, 0));

    expect(wrapper.vm.erro).toBe('E-mail em uso');
  });
});
