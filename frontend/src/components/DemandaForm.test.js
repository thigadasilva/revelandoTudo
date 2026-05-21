import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DemandaForm from './DemandaForm.vue'
import api from '../services/api'

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    put: vi.fn()
  }
}))

describe('DemandaForm.vue', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =====================================================
  // RENDERIZAÇÃO
  // =====================================================

  test('deve renderizar o formulário corretamente', () => {

    const wrapper = mount(DemandaForm)

    expect(wrapper.text()).toContain('Nova Demanda')

    expect(wrapper.find('input').exists()).toBe(true)

    expect(wrapper.find('textarea').exists()).toBe(true)

  })

  // =====================================================
  // CREATE DEMANDA
  // =====================================================

  test('deve cadastrar uma nova demanda', async () => {

    api.post.mockResolvedValue({})

    const wrapper = mount(DemandaForm)

    await wrapper.find('input').setValue('Notebook')

    await wrapper.find('textarea').setValue('Novo notebook')

    await wrapper.find('form').trigger('submit.prevent')

    expect(api.post).toHaveBeenCalledWith('/demandas', {
      titulo: 'Notebook',
      status: 'Em análise',
      descricao: 'Novo notebook',
      dataEsperada: '',
      mensagem: ''
    })

  })

  // =====================================================
  // EMITS
  // =====================================================

  test('deve emitir saved e close ao salvar', async () => {

    api.post.mockResolvedValue({})

    const wrapper = mount(DemandaForm)

    await wrapper.find('input').setValue('Notebook')

    await wrapper.find('textarea').setValue('Descrição')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('saved')).toBeTruthy()

    expect(wrapper.emitted('close')).toBeTruthy()

  })

  // =====================================================
  // EDIT DEMANDA
  // =====================================================

  test('deve editar uma demanda existente', async () => {

    api.put.mockResolvedValue({})

    const demanda = {
      id: 1,
      titulo: 'Notebook',
      status: 'Em andamento',
      descricao: 'Teste',
      dataEsperada: '2026-05-20'
    }

    const wrapper = mount(DemandaForm, {
      props: {
        demanda
      }
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(api.put).toHaveBeenCalled()

  })

  // =====================================================
  // STUDENT
  // =====================================================

  test('não deve mostrar campo status para estudante', () => {

    const wrapper = mount(DemandaForm, {
      props: {
        isStudent: true
      }
    })

    expect(wrapper.find('select').exists()).toBe(false)

  })

  // =====================================================
  // MODAL CLOSE
  // =====================================================

  test('deve emitir close ao clicar no botão fechar', async () => {

    const wrapper = mount(DemandaForm)

    await wrapper.find('.btn-icon').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()

  })

  // =====================================================
  // ERROR API
  // =====================================================

  test('deve tratar erro da API', async () => {

    api.post.mockRejectedValue(new Error('Erro API'))

    window.alert = vi.fn()

    const wrapper = mount(DemandaForm)

    await wrapper.find('input').setValue('Notebook')

    await wrapper.find('textarea').setValue('Descrição')

    await wrapper.find('form').trigger('submit.prevent')

    expect(window.alert).toHaveBeenCalled()

  })

})