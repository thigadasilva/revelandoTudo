describe('Login', () => {

  it('Deve realizar login com sucesso', () => {

    cy.visit('http://localhost:5173/login')

    cy.get('input[type="email"]').type('lucas@estudante.com')
    cy.get('input[type="password"]').type('senha123')

    cy.get('button[type="submit"]').click()

  })

  it('Deve mostrar mensagem de erro com credenciais incorretas', () => {
    cy.visit('http://localhost:5173/login')

    cy.get('input[type="email"]').type('email.inexistente@teste.com')
    cy.get('input[type="password"]').type('senhaerrada')

    cy.get('button[type="submit"]').click()

    cy.get('.erro').should('be.visible')
  })

})