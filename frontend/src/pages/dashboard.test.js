import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import dashboard from './dashboard.vue';

// Mock child components
vi.mock('../components/Navbar.vue', () => ({ default: { template: '<nav>Navbar</nav>' } }));
vi.mock('../components/statCard.vue', () => ({ 
  default: { 
    props: ['titulo', 'valor'], 
    template: '<div class="stat-card">{{ titulo }}: {{ valor }}</div>' 
  } 
}));

describe('dashboard.vue', () => {
  it('renderiza os cards com os valores corretos', () => {
    const wrapper = mount(dashboard, {
      global: {
        stubs: ['Navbar', 'StatCard']
      }
    });

    const html = wrapper.html();
    expect(html).toContain('Demandas Abertas');
    expect(html).toContain('Em Andamento');
    expect(html).toContain('Concluídas');
  });
});
