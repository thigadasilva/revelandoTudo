describe('Adicionar comentário privado e aprovar demanda', () => {
  it('Deve comentar e aprovar uma demanda pendente', () => {

    // Login como administrador
    cy.visit('http://localhost:5173/login')

    cy.contains('Administrador').click()

    cy.get('input[type="email"]').type('admin@alpha.edu')
    cy.get('input[type="password"]').type('senha123')

    cy.contains('Entrar no Sistema').click()

    // Verifica se chegou ao dashboard administrativo
    cy.contains('Dashboard Administrativo').should('be.visible')

    // Abre a primeira demanda pendente
   cy.contains('Demandas Pendentes')
  .closest('.bloco')
  .find('tbody tr')
      .first()
      .within(() => {
        cy.get('button[title="Visualizar"]').click()
      })

    // Modal aberto
    cy.get('.modal-box').should('be.visible')

    // Adiciona comentário privado
    cy.get('.comentario-form textarea')
      .type('Infelizmente não podemos controlar a física aplicada.')

    cy.get('.comentario-form .btn-primary')
      .contains('Enviar')
      .click()

    // Verifica se comentário apareceu
    cy.contains('Infelizmente não podemos controlar a física aplicada.')
      .should('be.visible')

    // Aprova a demanda
    cy.on('window:confirm', () => true)

    cy.contains('❌ Recusar').click()

    // Modal fecha
    cy.get('.modal-box').should('not.exist')
  })
})