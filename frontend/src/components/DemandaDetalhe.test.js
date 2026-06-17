import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import DemandaDetalhe from './DemandaDetalhe.vue';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn()
  }
}));

describe('DemandaDetalhe.vue', () => {
  const mockDemanda = {
    id: 1,
    titulo: 'Problema na internet',
    descricao: 'A internet do lab caiu',
    status: 'Em análise',
    dataAbertura: '2023-10-01',
    dataEsperada: '2023-10-02',
    userId: 1
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const store = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value + ''; });
  });

  it('renderiza os dados da demanda corretamente', async () => {
    api.get.mockResolvedValue({ data: [] });

    const wrapper = mount(DemandaDetalhe, {
      props: {
        demanda: mockDemanda,
        isAdmin: false
      }
    });

    expect(wrapper.text()).toContain('Problema na internet');
    expect(wrapper.text()).toContain('A internet do lab caiu');
    // formata a data para pt-BR, mas o texto exato pode depender do timezone local
    // Vamos apenas verificar se a tag contendo a dataAbertura renderizou
    expect(wrapper.html()).toContain('Abertura:');
    expect(wrapper.html()).toContain('Previsão:');
  });

  it('carrega o histórico de atualizações ao montar', async () => {
    const atualizacoes = [
      { id: 1, mensagem: 'Criada', createdAt: '2023-10-01' }
    ];
    api.get.mockResolvedValueOnce({ data: atualizacoes });

    const wrapper = mount(DemandaDetalhe, {
      props: {
        demanda: mockDemanda,
        isAdmin: false
      }
    });

    // flushPromises
    await new Promise(r => setTimeout(r, 0));

    expect(api.get).toHaveBeenCalledWith('/demandas/1/atualizacoes');
    expect(wrapper.text()).toContain('Criada');
  });

  it('permite que o admin veja os botões de ação se status for Em análise', async () => {
    api.get.mockResolvedValue({ data: [] });

    const wrapper = mount(DemandaDetalhe, {
      props: {
        demanda: mockDemanda, // status "Em análise"
        isAdmin: true
      }
    });

    await new Promise(r => setTimeout(r, 0));

    expect(wrapper.find('.btn-success').exists()).toBe(true);
    expect(wrapper.find('.btn-danger').exists()).toBe(true);
  });

  it('emite evento close ao clicar no X', async () => {
    api.get.mockResolvedValue({ data: [] });
    const wrapper = mount(DemandaDetalhe, {
      props: { demanda: mockDemanda, isAdmin: false }
    });

    await wrapper.find('.btn-icon').trigger('click');
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('aprova a demanda e emite eventos ao confirmar', async () => {
    api.get.mockResolvedValue({ data: [] });
    api.put.mockResolvedValue({});
    window.confirm = vi.fn().mockReturnValue(true);

    const wrapper = mount(DemandaDetalhe, {
      props: { demanda: mockDemanda, isAdmin: true }
    });
    
    await new Promise(r => setTimeout(r, 0));

    await wrapper.find('.btn-success').trigger('click');

    expect(window.confirm).toHaveBeenCalled();
    expect(api.put).toHaveBeenCalledWith('/demandas/1/aprovar');
    expect(wrapper.emitted().aprovada).toBeTruthy();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('recusa a demanda e emite eventos ao confirmar', async () => {
    api.get.mockResolvedValue({ data: [] });
    api.put.mockResolvedValue({});
    window.confirm = vi.fn().mockReturnValue(true);

    const wrapper = mount(DemandaDetalhe, {
      props: { demanda: mockDemanda, isAdmin: true }
    });
    
    await new Promise(r => setTimeout(r, 0));

    await wrapper.find('.btn-danger').trigger('click');

    expect(window.confirm).toHaveBeenCalled();
    expect(api.put).toHaveBeenCalledWith('/demandas/1/recusar');
    expect(wrapper.emitted().deletada).toBeTruthy();
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('carrega comentários privados se o usuário tiver acesso', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, role: 'student' }));
    
    api.get
      .mockResolvedValueOnce({ data: [] }) // atualizacoes
      .mockResolvedValueOnce({ data: [{ id: 1, texto: 'Comentario teste', User: { role: 'admin' }, createdAt: '2023-10-01T12:00:00' }] }); // comentarios

    const wrapper = mount(DemandaDetalhe, {
      props: { demanda: mockDemanda, isAdmin: false }
    });
    
    await new Promise(r => setTimeout(r, 0));

    expect(api.get).toHaveBeenCalledWith('/demandas/1/comentarios');
    expect(wrapper.text()).toContain('Comentario teste');
  });

  it('permite enviar um comentário', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, role: 'student' }));
    
    api.get.mockResolvedValue({ data: [] });
    api.post.mockResolvedValue({ data: { id: 2, texto: 'Enviando', User: { role: 'student' }, createdAt: '2023-10-01' } });

    const wrapper = mount(DemandaDetalhe, {
      props: { demanda: mockDemanda, isAdmin: false }
    });
    
    await new Promise(r => setTimeout(r, 0));

    const textarea = wrapper.find('textarea');
    await textarea.setValue('Enviando');
    await wrapper.find('.comentario-form .btn-primary').trigger('click');

    expect(api.post).toHaveBeenCalledWith('/demandas/1/comentarios', { texto: 'Enviando' });
    
    await new Promise(r => setTimeout(r, 0));
    expect(wrapper.text()).toContain('Enviando');
  });
});
