import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressBar from './ProgressBar.vue'

describe('ProgressBar.vue', () => {

  // =====================================================
  // EM ANÁLISE
  // =====================================================

  test('deve renderizar 20% para Em análise', () => {

    const wrapper = mount(ProgressBar, {
      props: {
        status: 'Em análise'
      }
    })

    const fill = wrapper.find('.progress-bar-fill')

    expect(fill.attributes('style')).toContain('20%')

  })

  // =====================================================
  // EM ANDAMENTO
  // =====================================================

  test('deve renderizar 60% para Em andamento', () => {

    const wrapper = mount(ProgressBar, {
      props: {
        status: 'Em andamento'
      }
    })

    const fill = wrapper.find('.progress-bar-fill')

    expect(fill.attributes('style')).toContain('60%')

  })

  // =====================================================
  // CONCLUÍDA
  // =====================================================

  test('deve renderizar 100% para Concluída', () => {

    const wrapper = mount(ProgressBar, {
      props: {
        status: 'Concluída'
      }
    })

    const fill = wrapper.find('.progress-bar-fill')

    expect(fill.attributes('style')).toContain('100%')

  })

  // =====================================================
  // RECUSADA
  // =====================================================

  test('deve aplicar classe fill-recusada', () => {

    const wrapper = mount(ProgressBar, {
      props: {
        status: 'Recusada'
      }
    })

    const fill = wrapper.find('.progress-bar-fill')

    expect(fill.classes()).toContain('fill-recusada')

  })

  // =====================================================
  // STATUS INVÁLIDO
  // =====================================================

  test('deve renderizar 0% para status inválido', () => {

    const wrapper = mount(ProgressBar, {
      props: {
        status: 'Qualquer coisa'
      }
    })

    const fill = wrapper.find('.progress-bar-fill')

    expect(fill.attributes('style')).toContain('0%')

  })

})