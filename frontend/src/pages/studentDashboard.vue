<template>
  <div class="page-container">
    <Navbar />

    <main class="content-wrapper">
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1>Central de <span>Demandas</span></h1>
            <p>Acompanhe os chamados da empresa ou gerencie suas próprias solicitações.</p>
          </div>
          <button class="btn-primary" @click="abrirFormNovo">
            + Relatar Demanda
          </button>
        </div>
      </div>

      <div class="tabs-container">
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'all' }"
          @click="currentTab = 'all'"
        >
          Todas as Demandas
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'mine' }"
          @click="currentTab = 'mine'"
        >
          Minhas Relatadas
        </button>
      </div>

      <div class="filtros-container">
        <div class="busca-wrap">
          <span class="busca-icon">🔍</span>
          <input
            class="input-busca"
            v-model="busca"
            placeholder="Buscar por título ou palavra-chave..."
          />
        </div>

        <select class="select-filtro" v-model="filtroStatus">
          <option value="all">Todos os status</option>
          <option v-for="s in statusList" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <div class="cards-grid">
        <button
          v-for="d in demandasFiltradas"
          :key="d.id"
          class="card-demanda"
          @click="verDetalhe(d)"
        >
          <div class="card-top">
            <h3 class="card-titulo">{{ d.titulo }}</h3>
            <StatusBadge :status="d.status" />
          </div>
          <p class="card-desc">{{ d.descricao }}</p>
          <ProgressBar :status="d.status" class="custom-progress" />
          <div class="card-footer">
            <span class="data-text">📅 Previsão: {{ formatarData(d.dataEsperada) }}</span>
          </div>
        </button>

        <div v-if="demandasFiltradas.length === 0" class="empty-state">
          Nenhuma demanda encontrada com estes filtros.
        </div>
      </div>
    </main>

    <DemandaDetalhe
      v-if="demandaDetalhe"
      :demanda="demandaDetalhe"
      @close="demandaDetalhe = null"
    />

    <DemandaForm
      v-if="mostrarForm"
      :isStudent="true"
      @close="mostrarForm = false"
      @saved="carregarDemandas"
    />
  </div>
</template>

<script>
import api from "../services/api"
import Navbar from "../components/Navbar.vue"
import StatusBadge from "../components/StatusBadge.vue"
import ProgressBar from "../components/ProgressBar.vue"
import DemandaDetalhe from "../components/DemandaDetalhe.vue"
import DemandaForm from "../components/DemandaForm.vue"

export default {
  name: "StudentDashboard",
  components: { 
    Navbar, 
    StatusBadge, 
    ProgressBar, 
    DemandaDetalhe,
    DemandaForm
  },
  data() {
    return {
      demandas: [],
      busca: '',
      filtroStatus: 'all',
      statusList: ['Em análise', 'Em andamento', 'Aprovado', 'Concluída', 'Recusada'],
      demandaDetalhe: null,
      mostrarForm: false,
      currentTab: 'all',
      user: JSON.parse(localStorage.getItem("user") || "{}")
    }
  },
  computed: {
    demandasFiltradas() {
      return this.demandas.filter(d => {
        // Filtro de Aba
        if (this.currentTab === 'mine' && d.userId !== this.user.id) return false
        if (this.currentTab === 'all' && d.status === 'Recusada') return false

        const textoBusca = this.busca.toLowerCase()
        const matchBusca = d.titulo.toLowerCase().includes(textoBusca) || 
                           (d.descricao && d.descricao.toLowerCase().includes(textoBusca))
        
        const matchStatus = this.filtroStatus === 'all' || d.status === this.filtroStatus

        return matchBusca && matchStatus
      })
    }
  },
  async mounted() {
    await this.carregarDemandas()
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
    verDetalhe(demanda) {
      this.demandaDetalhe = demanda
    },
    abrirFormNovo() {
      this.mostrarForm = true
    },
    formatarData(dataStr) {
      if (!dataStr) return 'Não definida'
      const dataStrParts = dataStr.includes('T') ? dataStr : `${dataStr}T00:00:00`
      return new Date(dataStrParts).toLocaleDateString('pt-BR')
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #0f1930;
  color: #ffffff;
  position: relative;
  overflow: clip;
}

.page-container::before {
  content: "";
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(142, 40, 238, 0.15);
  border-radius: 50%;
  filter: blur(120px);
  top: 50px;
  left: -200px;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 50px 80px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header { margin-bottom: 40px; }
.page-header h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3.5rem;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
}
.page-header h1 span {
  background: linear-gradient(to right, #c07bff, #8195fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.page-header p {
  font-family: 'Poppins', sans-serif;
  color: #939ead;
  font-size: 1.1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.btn-primary {
  background-image: linear-gradient(to bottom right, #8e28ee, #4a66f1);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-primary:hover {
  box-shadow: 0 0 15px rgba(151, 44, 251, 0.5);
  transform: translateY(-2px);
}

.tabs-container {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.tab-btn {
  background: transparent;
  border: none;
  color: #939ead;
  padding: 10px 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.tab-btn:hover {
  color: #fff;
}

.tab-btn.active {
  color: #c07bff;
}

.tab-btn.active::after {
  content: "";
  position: absolute;
  bottom: -11px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #c07bff;
  box-shadow: 0 0 10px #c07bff;
}

.filtros-container {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.busca-wrap {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(192, 123, 255, 0.2);
  border-radius: 12px;
  padding: 0 15px;
  flex: 1;
  min-width: 250px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.busca-wrap:focus-within {
  border-color: #c07bff;
  box-shadow: 0 0 15px rgba(151, 44, 251, 0.2);
}

.busca-icon { margin-right: 10px; opacity: 0.7; }

.input-busca {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  padding: 14px 0;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  outline: none;
}

.input-busca::placeholder { color: #6b7280; }

.select-filtro {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(192, 123, 255, 0.2);
  color: #ffffff;
  border-radius: 12px;
  padding: 14px 20px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  appearance: none;
}

.select-filtro:focus, .select-filtro:hover {
  border-color: #c07bff;
  background: rgba(255, 255, 255, 0.08);
}

.select-filtro option {
  background: #0f1930;
  color: #fff;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-style: italic;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.card-demanda {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(192, 123, 255, 0.12);
  border-radius: 20px;
  padding: 24px;
  text-align: left;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.card-demanda:hover {
  transform: translateY(-5px);
  border-color: rgba(192, 123, 255, 0.4);
  box-shadow: 0 0 25px rgba(151, 44, 251, 0.15);
  background: rgba(255, 255, 255, 0.05);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.card-titulo {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
}

.card-desc {
  font-family: 'Poppins', sans-serif;
  color: #939ead;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.tag-categoria, .data-text {
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  color: #6b7280;
}

:deep(.progress-bar-wrap) {
  background: rgba(255, 255, 255, 0.1) !important;
}
:deep(.progress-bar-fill) {
  background: linear-gradient(to right, #8e28ee, #4a66f1) !important;
  box-shadow: 0 0 10px rgba(151, 44, 251, 0.5);
}

@media (max-width: 768px) {
  .content-wrapper { padding: 30px 20px; }
  .filtros-container { flex-direction: column; }
  .cards-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .content-wrapper { padding: 20px 15px; }
  .page-header h1 {
    font-size: 2.2rem;
  }
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-primary {
    width: 100%;
    text-align: center;
  }
  .tabs-container {
    flex-direction: column;
    gap: 8px;
  }
  .tab-btn {
    width: 100%;
    text-align: center;
  }
  .card-demanda {
    padding: 18px;
  }
}
</style>