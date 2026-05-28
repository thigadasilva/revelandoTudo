<template>
  <div class="modal-overlay">
    <form class="modal-box glass-modal" @submit.prevent="handleSubmit">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Editar Demanda' : 'Nova Demanda' }}</h2>
        <button type="button" class="btn-icon" @click="$emit('close')">✕</button>
      </div>

      <div class="field">
        <label>Título</label>
        <input v-model="form.titulo" required placeholder="Ex: Novo notebook" class="dark-input"/>
      </div>

      <div class="field-row">
        <div v-if="!isStudent" class="field">
          <label>Status</label>
          <select v-model="form.status" required class="dark-input">
            <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label>Descrição detalhada</label>
        <textarea v-model="form.descricao" rows="3" required class="dark-input" placeholder="Detalhes do pedido..."></textarea>
      </div>

      <div v-if="!isStudent && !isEdit" class="field">
        <label>Solicitante (Opcional)</label>
        <input v-model="form.solicitante" placeholder="Nome de quem solicitou" class="dark-input"/>
      </div>

      <div v-if="!isStudent" class="field">
        <label>Previsão de conclusão</label>
        <input type="date" v-model="form.dataEsperada" required class="dark-input"/>
      </div>

      <div v-if="isEdit && !isStudent" class="field">
        <label>Nota de atualização (opcional)</label>
        <input v-model="form.mensagem" class="dark-input" placeholder="Descreva a atualização..." />
      </div>

      <button type="submit" class="btn-primary btn-full">
        {{ isEdit ? 'Salvar Alterações' : 'Cadastrar Demanda' }}
      </button>
    </form>
  </div>
</template>

<script>
import api from "../services/api"

export default {
  name: 'DemandaForm',
  props: {
    demanda: {
      type: Object,
      default: null
    },
    isStudent: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'saved'],
  data() {
    return {
      statuses: ['Em análise', 'Em andamento', 'Concluída'],
      form: {
        titulo: this.demanda?.titulo || '',
        status: this.demanda?.status || 'Em análise',
        descricao: this.demanda?.descricao || '',
        dataEsperada: this.demanda?.dataEsperada || '',
        solicitante: this.demanda?.solicitante || '',
        mensagem: ''
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.demanda
    }
  },
  methods: {
    async handleSubmit() {
      try {
        if (this.isEdit) {
          await api.put(`/demandas/${this.demanda.id}`, this.form)
        } else {
          await api.post('/demandas', this.form)
        }
        this.$emit('saved')
        this.$emit('close')
      } catch (err) {
        alert('Erro ao salvar demanda. Verifique os dados e tente novamente.')
        console.error(err)
      }
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
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(15, 25, 48, 0.95);
  border: 1px solid rgba(192, 123, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Poppins', sans-serif;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1rem;
  cursor: pointer;
  color: #939ead;
  padding: 6px 10px;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: rgba(255, 74, 74, 0.15);
  color: #ff6b6b;
  border-color: rgba(255, 74, 74, 0.3);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #c07bff;
}

.dark-input {
  border: 1px solid rgba(192, 123, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.95rem;
  color: #ffffff;
  outline: none;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.dark-input::placeholder {
  color: #6b7280;
}

.dark-input:focus {
  border-color: #c07bff;
  box-shadow: 0 0 10px rgba(151, 44, 251, 0.2);
  background: rgba(0, 0, 0, 0.4);
}

.dark-input option {
  background: #0f1930;
  color: #ffffff;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.btn-primary {
  background-image: linear-gradient(to bottom right, #8e28ee, #4a66f1);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-primary:hover {
  box-shadow: 0 0 20px rgba(151, 44, 251, 0.5);
  transform: translateY(-2px);
}

.btn-full { width: 100%; }

@media (max-width: 600px) {
  .field-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .glass-modal {
    padding: 20px;
  }
  .modal-header h2 {
    font-size: 1.2rem;
  }
}
</style>