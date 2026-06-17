import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import StatusBadge from './StatusBadge.vue';

describe('StatusBadge.vue', () => {
  it('renderiza o status Em análise com a classe correta', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'Em análise' }
    });
    expect(wrapper.text()).toBe('Em análise');
    expect(wrapper.classes()).toContain('badge');
    expect(wrapper.classes()).toContain('badge-analise');
  });

  it('renderiza o status Em andamento com a classe correta', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'Em andamento' }
    });
    expect(wrapper.text()).toBe('Em andamento');
    expect(wrapper.classes()).toContain('badge-andamento');
  });

  it('renderiza o status Concluída com a classe correta', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'Concluída' }
    });
    expect(wrapper.text()).toBe('Concluída');
    expect(wrapper.classes()).toContain('badge-concluida');
  });

  it('renderiza o status Recusada com a classe correta', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'Recusada' }
    });
    expect(wrapper.text()).toBe('Recusada');
    expect(wrapper.classes()).toContain('badge-recusada');
  });

  it('renderiza fallback caso o status não seja mapeado', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'Desconhecido' }
    });
    expect(wrapper.text()).toBe('Desconhecido');
    expect(wrapper.classes()).toEqual(['badge']);
  });
});
