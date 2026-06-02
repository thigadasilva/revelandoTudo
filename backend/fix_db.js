require("dotenv").config();
const { sequelize } = require("./models");

async function fix() {
  try {
    console.log("Adicionando colunas manualmente no SQLite...");
    
    try {
      await sequelize.query("ALTER TABLE Users ADD COLUMN turmaId INTEGER REFERENCES Turmas (id) ON DELETE SET NULL ON UPDATE CASCADE;");
      console.log("Coluna turmaId adicionada em Users.");
    } catch (e) {
      console.log("Erro ao adicionar turmaId (provavelmente já existe):", e.message);
    }

    try {
      await sequelize.query("ALTER TABLE Demandas ADD COLUMN solicitante VARCHAR(255);");
      console.log("Coluna solicitante adicionada em Demandas.");
    } catch (e) {
      console.log("Erro ao adicionar solicitante (provavelmente já existe):", e.message);
    }

    console.log("Correção concluída!");
    process.exit(0);
  } catch (error) {
    console.error("Erro geral:", error);
    process.exit(1);
  }
}

fix();
