const bcrypt = require("bcryptjs")
require("dotenv").config()

const sequelize = require("./config/database")
const { User, Turma } = require("./models")

async function seed() {
  try {
    // Recria todas as tabelas com a estrutura atual (apaga dados antigos)
    await sequelize.sync({ force: true })

    // Apaga todos os usuários e turmas existentes
    await User.destroy({ where: {}, truncate: true })
    await Turma.destroy({ where: {}, truncate: true })
    console.log("✅ Todos os dados anteriores foram apagados.")

    const senhaHash = await bcrypt.hash("senha123", 10)

    // Cria as Instituições
    const admin1 = await User.create({
      nome: "Instituição Alpha",
      email: "admin@alpha.edu",
      senha: senhaHash,
      role: "admin",
      empresa: "Alpha Education",
      cnpj: "11.111.111/0001-11",
      telefone: "(11) 99999-1111",
      codigoInstitucional: null,
      adminId: null,
      statusAcesso: "aprovado"
    })
    const turmaAlpha = await Turma.create({
      nome: "Turma Alpha 2026",
      codigo: "ALPHA26",
      adminId: admin1.id
    })
    console.log("✅ Instituição 1 criada:", admin1.email)

    const admin2 = await User.create({
      nome: "Instituição Beta",
      email: "admin@beta.edu",
      senha: senhaHash,
      role: "admin",
      empresa: "Beta Institute",
      cnpj: "22.222.222/0001-22",
      telefone: "(22) 99999-2222",
      codigoInstitucional: null,
      adminId: null,
      statusAcesso: "aprovado"
    })
    const turmaBeta = await Turma.create({
      nome: "Turma Beta 2026",
      codigo: "BETA26",
      adminId: admin2.id
    })
    console.log("✅ Instituição 2 criada:", admin2.email)

    // Cria os estudantes vinculados
    const student1 = await User.create({
      nome: "Lucas Pereira",
      email: "lucas@estudante.com",
      senha: senhaHash,
      role: "student",
      telefone: "(11) 98888-1111",
      codigoInstitucional: "ALPHA26",
      turmaId: turmaAlpha.id,
      adminId: admin1.id,
      statusAcesso: "aprovado"
    })
    console.log("✅ Estudante 1 criado (Alpha):", student1.email)

    const student2 = await User.create({
      nome: "Mariana Souza",
      email: "mariana@estudante.com",
      senha: senhaHash,
      role: "student",
      telefone: "(11) 98888-2222",
      codigoInstitucional: "ALPHA26",
      turmaId: turmaAlpha.id,
      adminId: admin1.id,
      statusAcesso: "aprovado"
    })
    console.log("✅ Estudante 2 criado (Alpha):", student2.email)

    const student3 = await User.create({
      nome: "Carlos Silva",
      email: "carlos@estudante.com",
      senha: senhaHash,
      role: "student",
      telefone: "(22) 98888-3333",
      codigoInstitucional: "BETA26",
      turmaId: turmaBeta.id,
      adminId: admin2.id,
      statusAcesso: "aprovado"
    })
    console.log("✅ Estudante 3 criado (Beta):", student3.email)

    console.log("\n========================================")
    console.log("🔑 CREDENCIAIS DE ACESSO (Todas usam a mesma senha):")
    console.log("   Senha Padrão: senha123")
    console.log("----------------------------------------")
    console.log("👑 ADMIN 1 (Instituição Alpha)")
    console.log("   Email : admin@alpha.edu")
    console.log("----------------------------------------")
    console.log("👑 ADMIN 2 (Instituição Beta)")
    console.log("   Email : admin@beta.edu")
    console.log("----------------------------------------")
    console.log("👤 ESTUDANTE 1 (Alpha)")
    console.log("   Email : lucas@estudante.com")
    console.log("----------------------------------------")
    console.log("👤 ESTUDANTE 2 (Alpha)")
    console.log("   Email : mariana@estudante.com")
    console.log("----------------------------------------")
    console.log("👤 ESTUDANTE 3 (Beta)")
    console.log("   Email : carlos@estudante.com")
    console.log("========================================\n")

    process.exit(0)
  } catch (error) {
    console.error("❌ Erro ao executar o seed:", error)
    process.exit(1)
  }
}

seed()
