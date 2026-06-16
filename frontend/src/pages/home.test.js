import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import home from './home.vue';

describe('home.vue', () => {
  it('renderiza corretamente a landing page', () => {
    const wrapper = mount(home, {
      global: {
        stubs: ['router-link']
      }
    });

    expect(wrapper.text()).toContain('Gerencie as demandas da sua empresa');
    expect(wrapper.text()).toContain('Projetado para Visibilidade');
    expect(wrapper.text()).toContain('Transforme a Cultura da sua Empresa');
  });
});
