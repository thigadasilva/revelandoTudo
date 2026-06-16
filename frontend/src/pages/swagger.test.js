import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import swagger from './swagger.vue';

describe('swagger.vue', () => {
  it('renderiza o iframe corretamente', () => {
    const wrapper = mount(swagger);

    expect(wrapper.text()).toContain('Documentacao da API');
    
    const iframe = wrapper.find('iframe');
    expect(iframe.exists()).toBe(true);
    expect(iframe.attributes('src')).toBe('http://localhost:3000/docs');
  });
});
