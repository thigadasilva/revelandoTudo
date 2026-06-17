describe('Cadastro', () => {

  const timestamp = Date.now();

  it('Deve cadastrar um novo administrador com sucesso', () => {
    cy.visit('http://localhost:5173/cadastro')

    // Escolhe cadastro admin
    cy.contains('Criar Conta Admin').click()

    cy.url().should('include', '/cadastro-admin')

    cy.get('input').eq(0).type('Admin Teste') // Nome
    cy.get('input').eq(1).type('Empresa Teste SA') // Empresa
    cy.get('input').eq(2).type('11999999999') // Telefone
    cy.get('input[type="email"]').type(`admin_${timestamp}@teste.com`) // Email
    cy.get('input[type="password"]').eq(0).type('senha123') // Senha
    cy.get('input[type="password"]').eq(1).type('senha123') // Confirmar

    cy.get('button[type="submit"]').click()

    // O alert de sucesso deve aparecer ou redirecionar
    cy.contains('Conta criada com sucesso!').should('exist')
    
    // Aguarda o redirecionamento
    cy.url({ timeout: 5000 }).should('include', '/login')
  })

  it('Deve mostrar erro se as senhas não coincidirem no admin', () => {
    cy.visit('http://localhost:5173/cadastro-admin')

    cy.get('input').eq(0).type('Admin Erro')
    cy.get('input').eq(1).type('Empresa Erro')
    cy.get('input').eq(2).type('11999999999')
    cy.get('input[type="email"]').type(`erro_${timestamp}@teste.com`)
    cy.get('input[type="password"]').eq(0).type('senha123')
    cy.get('input[type="password"]').eq(1).type('senha1234')

    cy.get('button[type="submit"]').click()

    cy.contains('As senhas não coincidem.').should('exist')
  })

  it('Deve cadastrar um novo usuário (estudante) com sucesso', () => {
    cy.visit('http://localhost:5173/cadastro')

    // Escolhe cadastro usuário
    cy.contains('Criar Conta Usuário').click()

    cy.url().should('include', '/cadastro-usuario')

    cy.get('input').eq(0).type('Usuário Teste') // Nome
    cy.get('input[type="email"]').type(`usuario_${timestamp}@teste.com`) // Email
    cy.get('input').eq(2).type('SENAI2026') // Código Turma
    cy.get('input[type="password"]').eq(0).type('senha123') // Senha
    cy.get('input[type="password"]').eq(1).type('senha123') // Confirmar

    cy.get('button[type="submit"]').click()

    cy.contains('Solicitação enviada com sucesso! Aguarde aprovação.').should('exist')
    
    // Aguarda o redirecionamento
    cy.url({ timeout: 5000 }).should('include', '/login')
  })
})
