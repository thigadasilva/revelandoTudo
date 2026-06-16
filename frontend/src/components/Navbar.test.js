import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Navbar from './Navbar.vue';

describe('Navbar.vue', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      push: vi.fn()
    };
    vi.restoreAllMocks();
  });

  it('renderiza corretamente para um administrador', async () => {
    const wrapper = mount(Navbar, {
      global: { mocks: { $router: mockRouter } }
    });
    
    await wrapper.setData({
      user: {
        nome: 'Admin User',
        role: 'admin'
      }
    });

    expect(wrapper.text()).toContain('Dashboard Empresa');
    expect(wrapper.text()).toContain('Admin');
    expect(wrapper.text()).toContain('Administrador');
  });

  it('renderiza corretamente para um estudante com turma', async () => {
    const wrapper = mount(Navbar, {
      global: { mocks: { $router: mockRouter } }
    });

    await wrapper.setData({
      user: {
        nome: 'Student User',
        role: 'student',
        Turma: {
          nome: 'Turma A',
          codigo: '12345'
        }
      }
    });

    expect(wrapper.text()).toContain('Área do Usuário');
    expect(wrapper.text()).toContain('Student');
    expect(wrapper.text()).toContain('Turma A');
    expect(wrapper.text()).toContain('12345');
  });

  it('calcula as iniciais corretamente', async () => {
    const wrapper = mount(Navbar, {
      global: { mocks: { $router: mockRouter } }
    });

    await wrapper.setData({
      user: {
        nome: 'Joao Silva Souza',
        role: 'student'
      }
    });

    // J de Joao e S de Souza
    expect(wrapper.find('.avatar').text()).toBe('JS');
  });

  it('calcula iniciais se o nome for apenas um', async () => {
    const wrapper = mount(Navbar, {
      global: { mocks: { $router: mockRouter } }
    });

    await wrapper.setData({
      user: {
        nome: 'Joao',
        role: 'student'
      }
    });

    expect(wrapper.find('.avatar').text()).toBe('JO');
  });

  it('abre e fecha o dropdown ao clicar', async () => {
    const wrapper = mount(Navbar, {
      global: { mocks: { $router: mockRouter } }
    });

    await wrapper.setData({
      user: { nome: 'Teste' }
    });

    const profileMenu = wrapper.find('.profile-menu');
    await profileMenu.trigger('click');
    expect(wrapper.find('.dropdown-content').exists()).toBe(true);

    await profileMenu.trigger('click');
    expect(wrapper.find('.dropdown-content').exists()).toBe(false);
  });

  it('faz logout corretamente', async () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');
    
    const wrapper = mount(Navbar, {
      global: { mocks: { $router: mockRouter } }
    });

    await wrapper.setData({
      user: { nome: 'Teste' }
    });

    // Abrir menu
    await wrapper.find('.profile-menu').trigger('click');
    
    // Clicar em logout
    await wrapper.find('.logout-btn').trigger('click');

    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(removeItemSpy).toHaveBeenCalledWith('user');
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('fecha o dropdown se clicar fora', async () => {
    const wrapper = mount(Navbar, {
      global: { mocks: { $router: mockRouter } }
    });
    
    await wrapper.setData({
      user: { nome: 'Teste' }
    });

    // Abre dropdown
    await wrapper.find('.profile-menu').trigger('click');
    expect(wrapper.vm.showDropdown).toBe(true);

    // Simula click fora
    const clickEvent = new Event('click');
    Object.defineProperty(clickEvent, 'target', { value: document.body });
    document.dispatchEvent(clickEvent);

    expect(wrapper.vm.showDropdown).toBe(false);
  });
});
