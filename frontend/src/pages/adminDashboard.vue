<template>
<div class="page dark-theme">
  <Navbar />

  <main class="container z-index-content">
    <div class="page-header">
      <h1><span>Dashboard</span> Administrativo</h1>
      <p>Visão geral e controle de demandas da empresa</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card glass-panel">
        <div class="stat-icon stat-total">📋</div>
        <div>
          <p class="stat-value">{{ stats.total }}</p>
          <p class="stat-label">Total de Demandas</p>
        </div>
      </div>

      <div class="stat-card glass-panel">
        <div class="stat-icon stat-analise">⚠️</div>
        <div>
          <p class="stat-value">{{ stats.analise }}</p>
          <p class="stat-label">Em análise</p>
        </div>
      </div>

      <div class="stat-card glass-panel">
        <div class="stat-icon stat-andamento">🕐</div>
        <div>
          <p class="stat-value">{{ stats.andamento }}</p>
          <p class="stat-label">Em andamento</p>
        </div>
      </div>

      <div class="stat-card glass-panel">
        <div class="stat-icon stat-concluida">✅</div>
        <div>
          <p class="stat-value">{{ stats.concluida }}</p>
          <p class="stat-label">Concluídas</p>
        </div>
      </div>
    </div>

    <div class="bloco">
      <div class="table-header">
        <h2><span>Solicitações</span> de Acesso</h2>
      </div>

      <div class="table-wrap glass-panel">
        <table class="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th class="text-right">Ação</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="u in usuariosPendentes" :key="u.id">
              <td class="td-titulo">{{ u.nome }}</td>
              <td class="td-muted">{{ u.email }}</td>
              <td class="text-right">
                <button class="btn-primary" @click="aprovarUsuario(u.id)">
                  Aprovar
                </button>
              </td>
            </tr>

            <tr v-if="usuariosPendentes.length === 0">
              <td colspan="3" class="sem-dados">
                Nenhuma solicitação pendente no momento.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bloco">
      <div class="table-header">
        <h2><span>Controle</span> de Demandas</h2>
        <button class="btn-primary" @click="abrirFormNovo">
          + Nova Demanda
        </button>
      </div>

      <div class="table-wrap glass-panel">
        <table class="tabela">
          <thead>
            <tr>
              <th>Título</th>
              <th class="hide-sm">Categoria</th>
              <th>Status</th>
              <th class="hide-md">Abertura</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="d in demandas" :key="d.id">
              <td class="td-titulo">{{ d.titulo }}</td>
              <td class="hide-sm td-muted">
                {{ d.Categoria?.nome || "—" }}
              </td>
              <td>
                <StatusBadge :status="d.status" />
              </td>
              <td class="hide-md td-muted">
                {{ d.dataAbertura }}
              </td>
              <td class="text-right td-actions">
                <button class="btn-icon" title="Visualizar" @click="verDetalhe(d)">
                  👁
                </button>
                <button class="btn-icon" title="Editar" @click="editarDemanda(d)">
                  ✏️
                </button>
              </td>
            </tr>

            <tr v-if="demandas.length === 0">
              <td colspan="5" class="sem-dados">
                Nenhuma demanda encontrada.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <DemandaForm
    v-if="mostrarForm"
    :demanda="demandaEditando"
    :categorias="categorias"
    @close="mostrarForm = false"
    @saved="carregarDemandas"
  />

  <DemandaDetalhe
    v-if="demandaDetalhe"
    :demanda="demandaDetalhe"
    @close="demandaDetalhe = null"
  />
</div>
</template>

<script>
import api from "../services/api"
import Navbar from "../components/Navbar.vue"
import StatusBadge from "../components/StatusBadge.vue"
import DemandaForm from "../components/DemandaForm.vue"
import DemandaDetalhe from "../components/DemandaDetalhe.vue"

export default {
  name: "AdminDashboard",
  components: { Navbar, StatusBadge, DemandaForm, DemandaDetalhe },
  data() {
    return {
      demandas: [],
      categorias: [],
      usuariosPendentes: [],
      mostrarForm: false,
      demandaEditando: null,
      demandaDetalhe: null
    }
  },
  computed: {
    stats() {
      return {
        total: this.demandas.length,
        analise: this.demandas.filter(d => d.status === "Em análise").length,
        andamento: this.demandas.filter(d => d.status === "Em andamento").length,
        concluida: this.demandas.filter(d => d.status === "Concluída").length
      }
    }
  },
  async mounted() {
    await this.carregarDemandas()
    await this.carregarCategorias()
    await this.carregarPendentes()
  },
  methods: {
    async carregarDemandas() {
      try {
        const res = await api.get("/demandas")
        this.demandas = res.data
      } catch (err) {
        console.error("Erro ao carregar demandas:", err)
      }
    },
    async carregarCategorias() {
      try {
        const res = await api.get("/categorias")
        this.categorias = res.data
      } catch (err) {
        console.error(err)
      }
    },
    async carregarPendentes() {
      try {
        const res = await api.get("/auth/pendentes")
        this.usuariosPendentes = res.data
      } catch (err) {
        console.error("Erro ao buscar usuários:", err)
      }
    },
    async aprovarUsuario(id) {
      try {
        await api.put(`/auth/aprovar/${id}`)
        await this.carregarPendentes()
      } catch (err) {
        console.error("Erro ao aprovar usuário:", err)
      }
    },
    abrirFormNovo() {
      this.demandaEditando = null
      this.mostrarForm = true
    },
    editarDemanda(demanda) {
      this.demandaEditando = demanda
      this.mostrarForm = true
    },
    verDetalhe(demanda) {
      this.demandaDetalhe = demanda
    }
  }
}
</script>

<style scoped>

.page.dark-theme {
  min-height: 100vh;
  background: #0f1930;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: clip; 
}

.page.dark-theme::before,
.page.dark-theme::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 0;
  pointer-events: none; 
}

.page.dark-theme::before {
  width: 400px;
  height: 400px;
  background: rgba(142, 40, 238, 0.25);
  top: -100px;
  left: -100px;
}

.page.dark-theme::after {
  width: 500px;
  height: 500px;
  background: rgba(74, 102, 241, 0.2);
  bottom: -200px;
  right: -100px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.z-index-content {
  position: relative;
  z-index: 1;
}

.page-header {
  margin-bottom: 40px;
}

.page-header h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3.5rem;
  color: #ffffff;
  margin: 0 0 5px 0;
  letter-spacing: 1px;
}

.page-header h1 span {
  background: linear-gradient(to right, #c07bff, #8195fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: #939ead;
  font-size: 1rem;
  margin: 0;
}

.table-header h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.4rem;
  color: #ffffff;
  margin: 0;
}

.table-header h2 span {
  color: #c07bff;
}

.bloco {
  margin-bottom: 40px;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(192, 123, 255, 0.12);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(151, 44, 251, 0.05);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 50px;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  padding: 24px;
  display: flex;
  gap: 18px;
  align-items: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(192, 123, 255, 0.4);
  box-shadow: 0 0 25px rgba(151, 44, 251, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.stat-total { background: rgba(192, 123, 255, 0.15); border: 1px solid rgba(192, 123, 255, 0.3); }
.stat-analise { background: rgba(254, 215, 102, 0.15); border: 1px solid rgba(254, 215, 102, 0.3); }
.stat-andamento { background: rgba(74, 102, 241, 0.15); border: 1px solid rgba(74, 102, 241, 0.3); }
.stat-concluida { background: rgba(74, 222, 128, 0.15); border: 1px solid rgba(74, 222, 128, 0.3); }

.stat-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.2rem;
  color: #ffffff;
  margin: 0;
  line-height: 1;
  letter-spacing: 1px;
}

.stat-label {
  font-size: 0.85rem;
  color: #939ead;
  margin: 4px 0 0 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-wrap {
  overflow-x: auto;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
}

.tabela th,
.tabela td {
  padding: 16px 20px;
  text-align: left;
}

.tabela th {
  background: rgba(0, 0, 0, 0.3);
  color: #c07bff;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(192, 123, 255, 0.2);
}

.tabela tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s ease;
}

.tabela tbody tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.tabela tbody tr:last-child {
  border-bottom: none;
}

.td-titulo {
  font-weight: 500;
  color: #ffffff;
}

.td-muted {
  color: #939ead;
  font-size: 0.95rem;
}

.text-right {
  text-align: right !important;
}

.td-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.sem-dados {
  text-align: center !important;
  color: #6b7280;
  padding: 40px !important;
  font-style: italic;
}

/* BOTÕES */
.btn-primary {
  background-image: linear-gradient(to bottom right, #8e28ee, #4a66f1);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  box-shadow: 0 0 15px rgba(151, 44, 251, 0.5);
  transform: translateY(-2px);
}

.btn-icon {
  border: 1px solid rgba(192, 123, 255, 0.3);
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  color: #ffffff;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: rgba(192, 123, 255, 0.15);
  border-color: #c07bff;
  box-shadow: 0 0 10px rgba(151, 44, 251, 0.3);
}

/* RESPONSIVIDADE TABELA */
@media (max-width: 768px) {
  .hide-md { display: none; }
}

@media (max-width: 640px) {
  .hide-sm { display: none; }
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>