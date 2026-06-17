import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import adminDashboard from './adminDashboard.vue';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn()
  }
}));

vi.mock('../components/Navbar.vue', () => ({ default: { template: '<nav>Navbar</nav>' } }));
vi.mock('../components/StatusBadge.vue', () => ({ default: { template: '<span>Badge</span>' } }));
vi.mock('../components/DemandaForm.vue', () => ({ default: { template: '<div>Form</div>' } }));
vi.mock('../components/DemandaDetalhe.vue', () => ({ default: { template: '<div>Detalhe</div>' } }));

describe('adminDashboard.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega dados ao montar', async () => {
    api.get
      .mockResolvedValueOnce({ data: [{ id: 1, titulo: 'Demanda 1', status: 'Em análise' }] }) // demandas
      .mockResolvedValueOnce({ data: [{ id: 1, nome: 'Pendente 1' }] }) // pendentes
      .mockResolvedValueOnce({ data: [{ id: 1, nome: 'Turma 1', codigo: 'ABC' }] }); // turmas

    const wrapper = mount(adminDashboard);
    await new Promise(r => setTimeout(r, 0));

    expect(api.get).toHaveBeenCalledWith('/demandas');
    expect(api.get).toHaveBeenCalledWith('/auth/pendentes');
    expect(api.get).toHaveBeenCalledWith('/turmas');

    expect(wrapper.text()).toContain('Demanda 1');
    expect(wrapper.text()).toContain('Pendente 1');
    expect(wrapper.text()).toContain('Turma 1');
    expect(wrapper.text()).toContain('ABC');
  });

  it('calcula stats corretamente', async () => {
    api.get
      .mockResolvedValueOnce({ data: [
        { id: 1, status: 'Em análise' },
        { id: 2, status: 'Em andamento' },
        { id: 3, status: 'Concluída' },
        { id: 4, status: 'Recusada' }
      ]})
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] });

    const wrapper = mount(adminDashboard);
    await new Promise(r => setTimeout(r, 0));

    expect(wrapper.vm.stats).toEqual({
      total: 4,
      analise: 1,
      andamento: 1,
      concluida: 1,
      recusada: 1
    });
  });

  it('permite aprovar usuario e recarrega pendentes', async () => {
    api.get.mockImplementation(url => {
      if (url === '/demandas') return Promise.resolve({ data: [] });
      if (url === '/auth/pendentes') return Promise.resolve({ data: [{ id: 1, nome: 'Pendente 1' }] });
      if (url === '/turmas') return Promise.resolve({ data: [] });
    });

    api.put.mockResolvedValue({});
    window.confirm = vi.fn().mockReturnValue(true);

    const wrapper = mount(adminDashboard);
    await new Promise(r => setTimeout(r, 0));

    // Clica em aprovar o primeiro pendente
    await wrapper.find('.btn-icon-success').trigger('click');

    expect(window.confirm).toHaveBeenCalled();
    expect(api.put).toHaveBeenCalledWith('/auth/aprovar/1');
    expect(api.get).toHaveBeenCalledTimes(4); // 3 (mount) + 1 (recarregar)
  });

  it('permite recusar usuario e recarrega pendentes', async () => {
    api.get.mockImplementation(url => {
      if (url === '/demandas') return Promise.resolve({ data: [] });
      if (url === '/auth/pendentes') return Promise.resolve({ data: [{ id: 1, nome: 'Pendente 1' }] });
      if (url === '/turmas') return Promise.resolve({ data: [] });
    });

    api.put.mockResolvedValue({});
    window.confirm = vi.fn().mockReturnValue(true);

    const wrapper = mount(adminDashboard);
    await new Promise(r => setTimeout(r, 0));

    await wrapper.find('.btn-icon-danger').trigger('click');

    expect(window.confirm).toHaveBeenCalled();
    expect(api.put).toHaveBeenCalledWith('/auth/rejeitar/1');
    expect(api.get).toHaveBeenCalledTimes(4); // 3 (mount) + 1 (recarregar)
  });

  it('permite criar turma e recarrega', async () => {
    api.get.mockResolvedValue({ data: [] });
    api.post.mockResolvedValue({});
    window.prompt = vi.fn().mockReturnValue('Nova Turma');

    const wrapper = mount(adminDashboard);
    await new Promise(r => setTimeout(r, 0));

    await wrapper.find('.table-header .btn-primary').trigger('click');

    expect(window.prompt).toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith('/turmas', { nome: 'Nova Turma' });
  });
});
