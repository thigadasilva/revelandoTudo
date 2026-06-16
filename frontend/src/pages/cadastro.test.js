import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import cadastro from './cadastro.vue';

describe('cadastro.vue', () => {
  it('renderiza os links de cadastro', () => {
    const wrapper = mount(cadastro, {
      global: {
        stubs: ['router-link']
      }
    });

    expect(wrapper.text()).toContain('Cadastro Admin');
    expect(wrapper.text()).toContain('Cadastro Usuário');
  });
});
