require("dotenv").config();
const { sequelize, User, Demanda, Turma } = require("./models");

function generateRandomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function migrate() {
  try {
    console.log("Sincronizando tabelas com alter: true...");
    await sequelize.sync({ alter: true });
    console.log("Tabelas sincronizadas.");

    console.log("Buscando administradores...");
    const admins = await User.findAll({ where: { role: "admin" } });
    
    for (const admin of admins) {
      // Check if admin already has a Turma
      const existingTurma = await Turma.findOne({ where: { adminId: admin.id } });
      if (!existingTurma) {
        const codigo = admin.codigoInstitucional || generateRandomCode();
        console.log(`Criando turma Lab 01 para Admin ID ${admin.id} com código ${codigo}`);
        await Turma.create({
          nome: "Lab 01",
          codigo: codigo,
          adminId: admin.id
        });
      }
    }

    console.log("Atualizando estudantes com turmaId...");
    const students = await User.findAll({ where: { role: "student" } });
    for (const student of students) {
      if (!student.turmaId && student.adminId) {
        const turma = await Turma.findOne({ where: { adminId: student.adminId } });
        if (turma) {
          console.log(`Associando estudante ${student.id} à turma ${turma.id}`);
          student.turmaId = turma.id;
          await student.save();
        }
      }
    }

    console.log("Migração concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("Erro na migração:", error);
    process.exit(1);
  }
}

migrate();
