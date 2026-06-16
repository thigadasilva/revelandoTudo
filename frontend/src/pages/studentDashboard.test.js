import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import studentDashboard from './studentDashboard.vue';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn()
  }
}));

vi.mock('../components/Navbar.vue', () => ({ default: { template: '<nav>Navbar</nav>' } }));
vi.mock('../components/StatusBadge.vue', () => ({ default: { template: '<span>Badge</span>' } }));
vi.mock('../components/ProgressBar.vue', () => ({ default: { template: '<span>Progress</span>' } }));
vi.mock('../components/DemandaForm.vue', () => ({ default: { template: '<div>Form</div>' } }));
vi.mock('../components/DemandaDetalhe.vue', () => ({ default: { template: '<div>Detalhe</div>' } }));

describe('studentDashboard.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const store = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify({ id: 1, role: 'student' }));
  });

  it('carrega demandas ao montar e filtra recusadas em "all"', async () => {
    api.get.mockResolvedValueOnce({ data: [
      { id: 1, titulo: 'Demanda 1', status: 'Em análise', userId: 2 },
      { id: 2, titulo: 'Demanda 2', status: 'Recusada', userId: 1 },
      { id: 3, titulo: 'Demanda 3', status: 'Em andamento', userId: 1 }
    ]});

    const wrapper = mount(studentDashboard);
    await new Promise(r => setTimeout(r, 0));

    expect(api.get).toHaveBeenCalledWith('/demandas');
    
    // Tab 'all' -> filtra recusadas
    expect(wrapper.vm.demandasFiltradas.length).toBe(2);
    expect(wrapper.text()).toContain('Demanda 1');
    expect(wrapper.text()).toContain('Demanda 3');
  });

  it('aplica o filtro da aba "Minhas Relatadas"', async () => {
    api.get.mockResolvedValueOnce({ data: [
      { id: 1, titulo: 'Outro', status: 'Em análise', userId: 2 },
      { id: 2, titulo: 'Minha', status: 'Em andamento', userId: 1 }
    ]});

    const wrapper = mount(studentDashboard);
    await new Promise(r => setTimeout(r, 0));

    // Mudar tab para 'mine'
    await wrapper.findAll('.tab-btn')[1].trigger('click');
    expect(wrapper.vm.currentTab).toBe('mine');

    expect(wrapper.vm.demandasFiltradas.length).toBe(1);
    expect(wrapper.text()).toContain('Minha');
    expect(wrapper.text()).not.toContain('Outro');
  });

  it('aplica filtro de texto e status', async () => {
    api.get.mockResolvedValueOnce({ data: [
      { id: 1, titulo: 'Demanda A', status: 'Em análise', userId: 1, descricao: '' },
      { id: 2, titulo: 'Demanda B', status: 'Em andamento', userId: 1, descricao: 'Teste legal' }
    ]});

    const wrapper = mount(studentDashboard);
    await new Promise(r => setTimeout(r, 0));

    // Filtro por texto
    const inputBusca = wrapper.find('.input-busca');
    await inputBusca.setValue('legal');

    expect(wrapper.vm.demandasFiltradas.length).toBe(1);
    expect(wrapper.text()).toContain('Demanda B');

    // Limpar texto e filtrar por status
    await inputBusca.setValue('');
    const selectFiltro = wrapper.find('.select-filtro');
    await selectFiltro.setValue('Em análise');

    expect(wrapper.vm.demandasFiltradas.length).toBe(1);
    expect(wrapper.text()).toContain('Demanda A');
  });

  it('abre o form de nova demanda', async () => {
    api.get.mockResolvedValue({ data: [] });
    const wrapper = mount(studentDashboard);
    await new Promise(r => setTimeout(r, 0));

    expect(wrapper.vm.mostrarForm).toBe(false);
    await wrapper.find('.btn-primary').trigger('click');
    expect(wrapper.vm.mostrarForm).toBe(true);
  });
});
