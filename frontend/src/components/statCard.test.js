import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import statCard from './statCard.vue';

describe('statCard.vue', () => {
  it('renderiza titulo e valor', () => {
    const wrapper = mount(statCard, {
      props: { 
        titulo: 'Total de Demandas',
        valor: '10'
      }
    });
    expect(wrapper.find('h3').text()).toBe('Total de Demandas');
    expect(wrapper.find('.numero').text()).toBe('10');
  });
});
