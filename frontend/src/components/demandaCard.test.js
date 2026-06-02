import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Navbar from './demandaCard.vue'

describe('DemandaCard.vue', () => {

  test('deve renderizar o título DemandaCard', () => {

    const wrapper = mount(Navbar, {
      global: {
        stubs: {
          Navbar: true
        }
      }
    })

    expect(wrapper.text()).toContain('Dashboard')

  })

  test('deve renderizar o componente Navbar', () => {

    const wrapper = mount(Navbar, {
      global: {
        stubs: {
          Navbar: true
        }
      }
    })

    expect(wrapper.findComponent({ name: 'Navbar' }).exists()).toBe(true)

  })

})