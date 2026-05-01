<template>
  <div class="page-container">
    <Navbar />

    <main class="content-wrapper">
      <div class="page-header">
        <h1>Ações <span>Institucionais</span></h1>
        <p>Acompanhe e pesquise os chamados da empresa de forma simplificada.</p>
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
        
        <select class="select-filtro" v-model="filtroCat">
          <option value="all">Todas as categorias</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.nome">
            {{ cat.nome }}
          </option>
        </select>

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
            <span class="tag-categoria">🏷 {{ d.Categoria?.nome || 'Sem categoria' }}</span>
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
  </div>
</template>

<script>
import api from "../services/api"
import Navbar from "../components/Navbar.vue"
import StatusBadge from "../components/StatusBadge.vue"
import ProgressBar from "../components/ProgressBar.vue"
import DemandaDetalhe from "../components/DemandaDetalhe.vue"

export default {
  name: "StudentDashboard",
  components: { 
    Navbar, 
    StatusBadge, 
    ProgressBar, 
    DemandaDetalhe 
  },
  data() {
    return {
      demandas: [],
      categorias: [], 
      busca: '',
      filtroCat: 'all',
      filtroStatus: 'all',
      statusList: ['Em análise', 'Em andamento', 'Concluída'],
      demandaDetalhe: null 
    }
  },
  computed: {
   
    demandasFiltradas() {
      return this.demandas.filter(d => {
        const textoBusca = this.busca.toLowerCase()
        const matchBusca = d.titulo.toLowerCase().includes(textoBusca) || 
                           (d.descricao && d.descricao.toLowerCase().includes(textoBusca))
        
        const matchCat = this.filtroCat === 'all' || (d.Categoria && d.Categoria.nome === this.filtroCat)
        
        const matchStatus = this.filtroStatus === 'all' || d.status === this.filtroStatus

        return matchBusca && matchCat && matchStatus
      })
    }
  },
  async mounted() {
    await this.carregarDemandas()
    await this.carregarCategorias()
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
        console.error("Erro ao carregar categorias:", err)
      }
    },
    verDetalhe(demanda) {
      this.demandaDetalhe = demanda
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
</style>