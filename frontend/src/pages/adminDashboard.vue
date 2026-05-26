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

      <div class="stat-card glass-panel">
        <div class="stat-icon stat-recusada">❌</div>
        <div>
          <p class="stat-value">{{ stats.recusada }}</p>
          <p class="stat-label">Recusadas</p>
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
              <th>E-mail</th>
              <th class="hide-sm">Cargo</th>
              <th>Turma</th>
              <th class="hide-md">Data</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="u in usuariosPendentes" :key="u.id">
              <td class="td-titulo">{{ u.nome }}</td>
              <td>{{ u.email }}</td>
              <td class="hide-sm">{{ u.cargo }}</td>
              <td>{{ u.Turma ? u.Turma.nome + ' (' + u.Turma.codigo + ')' : '-' }}</td>
              <td class="hide-md td-muted">
                {{ formatarData(u.createdAt) }}
              </td>
              <td class="text-right td-actions">
                <button 
                  class="btn-icon btn-icon-success" 
                  title="Aprovar" 
                  @click="aprovarUsuario(u.id)"
                >
                  ✅
                </button>
                <button 
                  class="btn-icon btn-icon-danger" 
                  title="Recusar" 
                  @click="recusarUsuario(u.id)"
                >
                  ❌
                </button>
              </td>
            </tr>

            <tr v-if="usuariosPendentes.length === 0">
              <td colspan="6" class="sem-dados">
                Nenhuma solicitação de acesso pendente.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bloco">
      <div class="table-header">
        <h2><span>Demandas</span> Pendentes</h2>
      </div>

      <div class="table-wrap glass-panel">
        <table class="tabela">
          <thead>
            <tr>
              <th>Título</th>
              <th class="hide-md">Abertura</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="d in demandasPendentes" :key="d.id">
              <td class="td-titulo">
                {{ d.titulo }}
                <div v-if="d.solicitante" class="td-muted" style="font-size: 0.8rem">Solicitante: {{ d.solicitante }}</div>
              </td>
              <td class="hide-md td-muted">
                {{ formatarData(d.dataAbertura) }}
              </td>
              <td class="text-right td-actions">
                <button class="btn-icon" title="Visualizar" @click="verDetalhe(d)">
                  👁
                </button>
                <button 
                  class="btn-icon btn-icon-success" 
                  title="Aprovar" 
                  @click="aprovarDemanda(d.id)"
                >
                  ✅
                </button>
                <button class="btn-icon btn-icon-danger" title="Recusar" @click="recusarDemanda(d.id)">
                  ❌
                </button>
              </td>
            </tr>

            <tr v-if="demandasPendentes.length === 0">
              <td colspan="3" class="sem-dados">
                Nenhuma demanda pendente de aprovação.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bloco">
      <div class="table-header">
        <h2><span>Controle</span> de Demandas</h2>
      </div>

      <div class="table-wrap glass-panel">
        <table class="tabela">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th class="hide-md">Abertura</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="d in demandasControladas" :key="d.id">
              <td class="td-titulo">
                {{ d.titulo }}
                <div v-if="d.solicitante" class="td-muted" style="font-size: 0.8rem">Solicitante: {{ d.solicitante }}</div>
              </td>
              <td>
                <StatusBadge :status="d.status" />
              </td>
              <td class="hide-md td-muted">
                {{ formatarData(d.dataAbertura) }}
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

            <tr v-if="demandasControladas.length === 0">
              <td colspan="4" class="sem-dados">
                Nenhuma demanda em andamento ou concluída.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="bloco">
      <div class="table-header">
        <h2><span>Gestão</span> de Turmas</h2>
        <button class="btn-primary" @click="criarTurma">Nova Turma</button>
      </div>

      <div class="table-wrap glass-panel">
        <table class="tabela">
          <thead>
            <tr>
              <th>Nome da Turma</th>
              <th>Código</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="t in turmas" :key="t.id">
              <td class="td-titulo">{{ t.nome }}</td>
              <td><strong style="color: #c07bff; letter-spacing: 1px">{{ t.codigo }}</strong></td>
            </tr>

            <tr v-if="turmas.length === 0">
              <td colspan="2" class="sem-dados">
                Nenhuma turma cadastrada.
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
    @close="mostrarForm = false"
    @saved="carregarDemandas"
  />

  <DemandaDetalhe
    v-if="demandaDetalhe"
    :demanda="demandaDetalhe"
    :isAdmin="true"
    @close="demandaDetalhe = null"
    @aprovada="carregarDemandas"
    @deletada="carregarDemandas"
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
      turmas: [],
      usuariosPendentes: [],
      mostrarForm: false,
      demandaEditando: null,
      demandaDetalhe: null
    }
  },
  computed: {
    demandasPendentes() {
      return this.demandas.filter(d => d.status === "Em análise")
    },
    demandasControladas() {
      return this.demandas.filter(d => d.status !== "Em análise" && d.status !== "Recusada")
    },
    stats() {
      return {
        total: this.demandas.length,
        analise: this.demandas.filter(d => d.status === "Em análise").length,
        andamento: this.demandas.filter(d => d.status === "Em andamento").length,
        concluida: this.demandas.filter(d => d.status === "Concluída").length,
        recusada: this.demandas.filter(d => d.status === "Recusada").length
      }
    }
  },
  async mounted() {
    await this.carregarDemandas()
    await this.carregarPendentes()
    await this.carregarTurmas()
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
    async carregarPendentes() {
      try {
        const res = await api.get("/auth/pendentes")
        this.usuariosPendentes = res.data
      } catch (err) {
        console.error("Erro ao buscar usuários:", err)
      }
    },
    async carregarTurmas() {
      try {
        const res = await api.get("/turmas")
        this.turmas = res.data
      } catch (err) {
        console.error("Erro ao carregar turmas:", err)
      }
    },
    async criarTurma() {
      const nome = prompt("Digite o nome da nova turma (ex: Lab 02, Turma B):")
      if (!nome) return
      try {
        await api.post("/turmas", { nome })
        await this.carregarTurmas()
      } catch (err) {
        alert("Erro ao criar turma")
        console.error(err)
      }
    },
    async aprovarUsuario(id) {
      if (!confirm('Deseja aprovar este usuário?')) return
      try {
        await api.put(`/auth/aprovar/${id}`)
        await this.carregarPendentes()
      } catch (err) {
        console.error("Erro ao aprovar usuário:", err)
        alert("Erro ao aprovar usuário.")
      }
    },
    async recusarUsuario(id) {
      if (!confirm('Deseja realmente recusar e bloquear este usuário?')) return
      try {
        await api.put(`/auth/rejeitar/${id}`)
        await this.carregarPendentes()
      } catch (err) {
        console.error("Erro ao recusar usuário:", err)
        alert("Erro ao recusar usuário.")
      }
    },
    editarDemanda(demanda) {
      this.demandaEditando = demanda
      this.mostrarForm = true
    },
    verDetalhe(demanda) {
      this.demandaDetalhe = demanda
    },
    formatarData(dateStr) {
      if (!dateStr) return '—'
      const dataStrParts = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`
      return new Date(dataStrParts).toLocaleDateString('pt-BR')
    },
    async aprovarDemanda(id) {
      if (!confirm('Deseja realmente aprovar esta demanda?')) return

      try {
        await api.put(`/demandas/${id}/aprovar`)
        await this.carregarDemandas()
      } catch (err) {
        alert('Erro ao aprovar demanda.')
        console.error(err)
      }
    },
    async recusarDemanda(id) {
      if (!confirm('ATENÇÃO: Deseja realmente recusar esta demanda? O usuário será notificado.')) return

      try {
        await api.put(`/demandas/${id}/recusar`)
        await this.carregarDemandas()
      } catch (err) {
        alert('Erro ao recusar demanda.')
        console.error(err)
      }
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
  grid-template-columns: repeat(5, 1fr);
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
.stat-recusada { background: rgba(255, 74, 74, 0.15); border: 1px solid rgba(255, 74, 74, 0.3); }

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

.btn-icon-success:hover {
  background: rgba(74, 222, 128, 0.15);
  border-color: #4ade80;
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
}

.btn-icon-danger:hover {
  background: rgba(255, 74, 74, 0.15);
  border-color: #ff6b6b;
  box-shadow: 0 0 10px rgba(255, 74, 74, 0.3);
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
  .page-header h1 {
    font-size: 2.2rem;
  }
  .container {
    padding: 20px 15px;
  }
}

@media (max-width: 480px) {
  .tabela th,
  .tabela td {
    padding: 12px 10px;
    font-size: 0.85rem;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 30px;
  }
  .stats-grid > :first-child {
    grid-column: 1 / -1;
  }
  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 18px 10px;
    gap: 8px;
    border-radius: 16px;
  }
  .stat-icon {
    width: 42px;
    height: 42px;
    font-size: 1.2rem;
    margin: 0 auto;
  }
  .stat-value {
    font-size: 1.8rem;
    margin-bottom: 0px;
  }
  .page-header h1 {
    font-size: 1.8rem;
    letter-spacing: 0;
  }
}
</style>