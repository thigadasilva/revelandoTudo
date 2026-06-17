import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import demandas from './demandas.vue';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn()
  }
}));

vi.mock('../components/Navbar.vue', () => ({ default: { template: '<nav>Navbar</nav>' } }));

describe('demandas.vue', () => {
  it('carrega e renderiza as demandas corretamente', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, titulo: 'Cadeira quebrada', status: 'Em análise' },
        { id: 2, titulo: 'Lâmpada queimada', status: 'Em andamento' }
      ]
    });

    const wrapper = mount(demandas);
    await new Promise(r => setTimeout(r, 0));

    expect(api.get).toHaveBeenCalledWith('/demandas');
    expect(wrapper.text()).toContain('Cadeira quebrada');
    expect(wrapper.text()).toContain('Em análise');
    expect(wrapper.text()).toContain('Lâmpada queimada');
    expect(wrapper.text()).toContain('Em andamento');
  });
});
