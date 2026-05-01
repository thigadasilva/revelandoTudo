<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box glass-modal">
      <div class="modal-header">
        <h2>{{ demanda.titulo }}</h2>
        <button class="btn-icon" @click="$emit('close')">✕</button>
      </div>

      <div class="badges-row">
        <StatusBadge :status="demanda.status" />
        <span class="tag">🏷 {{ nomeCategoria }}</span>
      </div>

      <ProgressBar :status="demanda.status" />

      <p class="descricao">{{ demanda.descricao }}</p>

      <div class="datas">
        <span>📅 Abertura: {{ formatarData(demanda.dataAbertura) }}</span>
        <span>📅 Previsão: {{ formatarData(demanda.dataEsperada) }}</span>
      </div>

      <div class="historico">
        <h3>Histórico de Atualizações</h3>
        <div v-if="atualizacoes.length === 0" class="sem-historico">
          Nenhuma atualização registrada.
        </div>
        <div class="timeline">
          <div v-for="(atu, i) in atualizacoes" :key="i" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <p class="timeline-date">{{ formatarData(atu.createdAt) }}</p>
              <p class="timeline-msg">{{ atu.mensagem }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api"
import StatusBadge from "./StatusBadge.vue"
import ProgressBar from "./ProgressBar.vue"

export default {
  name: 'DemandaDetalhe',
  components: { StatusBadge, ProgressBar },
  props: {
    demanda: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      atualizacoes: []
    }
  },
  computed: {
    nomeCategoria() {
      return this.demanda.Categoria?.nome || this.demanda.categoria || '—'
    }
  },
  async mounted() {
    try {
      const res = await api.get(`/demandas/${this.demanda.id}/atualizacoes`)
      this.atualizacoes = res.data
    } catch (err) {
      console.error('Erro ao buscar histórico:', err)
    }
  },
  methods: {
    formatarData(dateStr) {
      if (!dateStr) return '—'
      const dataStrParts = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`
      return new Date(dataStrParts).toLocaleDateString('pt-BR')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 16px;
}

.glass-modal {
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(15, 25, 48, 0.95);
  border: 1px solid rgba(192, 123, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 35px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Poppins', sans-serif;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1rem;
  cursor: pointer;
  color: #939ead;
  padding: 6px 10px;
  border-radius: 8px;
  flex-shrink: 0;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: rgba(255, 74, 74, 0.15);
  color: #ff6b6b;
  border-color: rgba(255, 74, 74, 0.3);
}

.badges-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.8rem;
  color: #c07bff;
  background: rgba(192, 123, 255, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid rgba(192, 123, 255, 0.2);
}

.descricao {
  font-size: 0.95rem;
  color: #d1d5db;
  line-height: 1.6;
  margin: 0;
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.datas {
  display: flex;
  gap: 24px;
  font-size: 0.85rem;
  color: #939ead;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.02);
  padding: 10px 16px;
  border-radius: 10px;
}

.historico h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 10px 0 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.sem-historico {
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
  padding: 16px 0;
}

.timeline {
  border-left: 2px solid rgba(192, 123, 255, 0.2); 
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
}

.timeline-item {
  position: relative;
}

.timeline-dot {
  position: absolute;
  left: -25px;
  top: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #c07bff;
  box-shadow: 0 0 10px #c07bff; 
}

.timeline-date {
  font-size: 0.8rem;
  color: #8195fc;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.timeline-msg {
  font-size: 0.95rem;
  color: #e5e7eb;
  margin: 0;
  line-height: 1.5;
}
</style>