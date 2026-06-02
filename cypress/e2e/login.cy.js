describe('Login', () => {

  it('Deve realizar login com sucesso', () => {

    cy.visit('http://localhost:5173/login')

    cy.get('input[type="email"]').type('lucas@estudante.com')
    cy.get('input[type="password"]').type('senha123')

    cy.get('button[type="submit"]').click()

  })

})