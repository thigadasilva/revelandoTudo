const bcrypt = require("bcryptjs")
require("dotenv").config()

const sequelize = require("./config/database")
const { User } = require("./models")

async function seed() {
  try {
    // Recria todas as tabelas com a estrutura atual (apaga dados antigos)
    await sequelize.sync({ force: true })

    // Apaga todos os usuários existentes
    await User.destroy({ where: {}, truncate: true })
    console.log("✅ Todos os usuários foram apagados.")

    const senhaHash = await bcrypt.hash("Teste@123", 10)

    // Cria o usuário administrador
    const admin = await User.create({
      nome: "Administrador",
      email: "admin@teste.com",
      senha: senhaHash,
      cargo: "Gestor",
      role: "admin",
      empresa: "Empresa Teste",
      cnpj: "00.000.000/0001-00",
      telefone: "(11) 99999-0001",
      codigoInstitucional: "INST001",
      adminId: null,
      statusAcesso: "aprovado"
    })
    console.log("✅ Admin criado:", admin.email)

    // Cria o usuário comum (student) já aprovado, vinculado ao admin
    const student = await User.create({
      nome: "Usuário Comum",
      email: "usuario@teste.com",
      senha: senhaHash,
      cargo: "Analista",
      role: "student",
      empresa: "Empresa Teste",
      cnpj: null,
      telefone: "(11) 99999-0002",
      codigoInstitucional: "INST001",
      adminId: admin.id,
      statusAcesso: "aprovado"
    })
    console.log("✅ Usuário comum criado:", student.email)

    // Cria o SEGUNDO usuário comum (student) para testar visibilidade
    const student2 = await User.create({
      nome: "Outro Usuário",
      email: "outro@teste.com",
      senha: senhaHash,
      cargo: "Operador",
      role: "student",
      empresa: "Empresa Teste",
      cnpj: null,
      telefone: "(11) 99999-0003",
      codigoInstitucional: "INST001",
      adminId: admin.id,
      statusAcesso: "aprovado"
    })
    console.log("✅ Segundo usuário comum criado:", student2.email)

    console.log("\n========================================")
    console.log("🔑 CREDENCIAIS DE TESTE:")
    console.log("----------------------------------------")
    console.log("👑 ADMINISTRADOR")
    console.log("   Email : admin@teste.com")
    console.log("   Senha : Teste@123")
    console.log("----------------------------------------")
    console.log("👤 USUÁRIO 1")
    console.log("   Email : usuario@teste.com")
    console.log("   Senha : Teste@123")
    console.log("----------------------------------------")
    console.log("👤 USUÁRIO 2")
    console.log("   Email : outro@teste.com")
    console.log("   Senha : Teste@123")
    console.log("========================================\n")

    process.exit(0)
  } catch (error) {
    console.error("❌ Erro ao executar o seed:", error)
    process.exit(1)
  }
}

seed()
