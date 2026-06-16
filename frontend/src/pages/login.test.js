import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import login from './login.vue';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn()
  }
}));

describe('login.vue', () => {
  let mockRouter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter = { push: vi.fn() };
    const store = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value + ''; });
  });

  it('lida com login student bem-sucedido', async () => {
    api.post.mockResolvedValue({
      data: { token: 'token123', user: { role: 'student' } }
    });
    const wrapper = mount(login, {
      global: { stubs: ['router-link'], mocks: { $router: mockRouter } }
    });

    await wrapper.setData({ roleSelecionado: 'student', email: 'a@a.com', senha: '123' });
    await wrapper.find('form').trigger('submit.prevent');

    await new Promise(r => setTimeout(r, 0));

    expect(localStorage.getItem('token')).toBe('token123');
    expect(mockRouter.push).toHaveBeenCalledWith('/student');
  });

  it('lida com login admin bem-sucedido', async () => {
    api.post.mockResolvedValue({
      data: { token: 'token123', user: { role: 'admin' } }
    });
    const wrapper = mount(login, {
      global: { stubs: ['router-link'], mocks: { $router: mockRouter } }
    });

    await wrapper.setData({ roleSelecionado: 'admin', email: 'a@a.com', senha: '123' });
    await wrapper.find('form').trigger('submit.prevent');

    await new Promise(r => setTimeout(r, 0));

    expect(mockRouter.push).toHaveBeenCalledWith('/admin');
  });

  it('bloqueia se a role selecionada for diferente da retornada', async () => {
    api.post.mockResolvedValue({
      data: { token: 'token123', user: { role: 'admin' } }
    });
    const wrapper = mount(login, {
      global: { stubs: ['router-link'], mocks: { $router: mockRouter } }
    });

    await wrapper.setData({ roleSelecionado: 'student', email: 'a@a.com', senha: '123' });
    await wrapper.find('form').trigger('submit.prevent');

    await new Promise(r => setTimeout(r, 0));

    expect(wrapper.vm.erro).toBe('Essa conta pertence à área Institucional.');
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('lida com erro da API', async () => {
    api.post.mockRejectedValue({ response: { data: { error: 'Credenciais inválidas' } } });
    const wrapper = mount(login, {
      global: { stubs: ['router-link'], mocks: { $router: mockRouter } }
    });

    await wrapper.find('form').trigger('submit.prevent');
    await new Promise(r => setTimeout(r, 0));

    expect(wrapper.vm.erro).toBe('Credenciais inválidas');
  });
});
