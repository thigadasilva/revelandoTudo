describe('Logout', () => {

  it('Deve realizar o logout corretamente', () => {
    // Fazer login primeiro
    cy.visit('http://localhost:5173/login')

    cy.get('input[type="email"]').type('lucas@estudante.com')
    cy.get('input[type="password"]').type('senha123')
    cy.get('button[type="submit"]').click()

    // Aguardar estar na página protegida
    cy.url().should('include', '/student')

    // Verificar se o localStorage possui o token e user
    cy.window().then((window) => {
      expect(window.localStorage.getItem('token')).to.be.a('string')
      expect(window.localStorage.getItem('user')).to.be.a('string')
    })

    // Clicar no menu de perfil
    cy.get('.profile-menu').click()

    // Clicar no botão de sair
    cy.contains('Sair do Sistema').click()

    // Verificar redirecionamento
    cy.url().should('eq', 'http://localhost:5173/')

    // Verificar se o localStorage foi limpo
    cy.window().then((window) => {
      expect(window.localStorage.getItem('token')).to.be.null
      expect(window.localStorage.getItem('user')).to.be.null
    })
  })

})
