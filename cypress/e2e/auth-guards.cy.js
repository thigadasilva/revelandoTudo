describe('Auth Guards', () => {

  it('Deve redirecionar usuários não autenticados da rota /admin para /login', () => {
    cy.visit('http://localhost:5173/admin')
    cy.url().should('include', '/login')
  })

  it('Deve redirecionar usuários não autenticados da rota /student para /login', () => {
    cy.visit('http://localhost:5173/student')
    cy.url().should('include', '/login')
  })

  it('Deve redirecionar usuários não autenticados da rota /dashboard para /login', () => {
    cy.visit('http://localhost:5173/dashboard')
    cy.url().should('include', '/login')
  })

  it('Deve redirecionar usuários não autenticados da rota /demandas para /login', () => {
    cy.visit('http://localhost:5173/demandas')
    cy.url().should('include', '/login')
  })

  it('Deve impedir acesso de estudante à rota /admin', () => {
    // Login com estudante
    cy.visit('http://localhost:5173/login')
    cy.get('input[type="email"]').type('lucas@estudante.com')
    cy.get('input[type="password"]').type('senha123')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/student')

    // Tentar acessar admin
    cy.visit('http://localhost:5173/admin')
    
    // O router.beforeEach redireciona para "/" caso o role não seja o da meta (role: admin)
    cy.url().should('eq', 'http://localhost:5173/')
  })

  it('Deve impedir acesso de admin à rota /student', () => {
    // Login com admin
    cy.visit('http://localhost:5173/login')
    cy.get('input[type="email"]').type('admin@alpha.edu') // Admin configurado no seeder
    cy.get('input[type="password"]').type('senha123')
    
    // Selecionar o tipo de conta Administrador
    cy.contains('label', 'Administrador').click()

    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/admin')

    // Tentar acessar student
    cy.visit('http://localhost:5173/student')
    
    // O router.beforeEach redireciona para "/" caso o role não seja o da meta (role: student)
    cy.url().should('eq', 'http://localhost:5173/')
  })

})
