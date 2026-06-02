describe('Comentário Privado', () => {

  it('Deve adicionar um comentário privado em uma demanda', () => {

    // Login
    cy.visit('http://localhost:5173/login')

    cy.get('input[type="email"]')
      .type('lucas@estudante.com')

    cy.get('input[type="password"]')
      .type('senha123')

    cy.contains('Entrar no Sistema')
      .click()

    cy.url()
      .should('include', '/student')

    // Abre a primeira demanda da lista
    cy.get('.card-demanda')
      .first()
      .click()

    // Verifica se abriu o modal
    cy.contains('Comentários Privados')
      .should('be.visible')

    // Digita comentário
    cy.get('.comentario-form textarea')
      .type('Tem alguma forma de resolver isso? gostaria de parar de tomar choque.')

    // Envia
    cy.contains('Enviar')
      .click()

    // Verifica se comentário apareceu
    cy.contains('Tem alguma forma de resolver isso? gostaria de parar de tomar choque.')
      .should('exist')

  })

})

