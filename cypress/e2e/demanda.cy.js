describe('Relatar Demanda', () => {

  it('Deve cadastrar uma nova demanda', () => {

    // Login
    cy.visit('http://localhost:5173/login')

    cy.get('input[type="email"]')
      .type('lucas@estudante.com')

    cy.get('input[type="password"]')
      .type('senha123')

    cy.contains('Entrar no Sistema')
      .click()

    // Verifica dashboard
    cy.url()
      .should('include', '/student')

    // Abre modal
    cy.contains('Relatar Demanda')
      .click()

    // Verifica modal
    cy.contains('Nova Demanda')
      .should('exist')

    // Título
    cy.get('input[placeholder="Ex: Novo notebook"]')
      .type('Cadeira está dando choque')

    // Descrição
    cy.get('textarea')
      .type('Sinto choque na cadeira quando sento nela.')

    // Salva
    cy.contains('Cadastrar Demanda')
      .click()

    // Aguarda recarregamento
    cy.wait(1000)

    // Verifica se apareceu na lista
    cy.contains('Cadeira está dando choque')
      .should('exist')

  })

})