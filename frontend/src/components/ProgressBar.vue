<template>
  <div class="progress-bar-wrap">
    <div 
      class="progress-bar-fill" 
      :class="{ 'fill-recusada': status === 'Recusada' }"
      :style="{ width: pct + '%' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    pct() {
      const map = {
        'Em análise': 20,
        'Em andamento': 60,
        'Concluída': 100,
        'Recusada': 100
      }
      return map[this.status] || 0
    }
  }
}
</script>

<style scoped>
.progress-bar-wrap {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05); /* Fundo sutil escuro */
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
}

.progress-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(to right, #c07bff, #4a66f1);
  box-shadow: 0 0 10px rgba(151, 44, 251, 0.5); /* Efeito neon */
  transition: width 0.6s ease-out;
}

.fill-recusada {
  background: #ff4a4a !important;
  box-shadow: 0 0 10px rgba(255, 74, 74, 0.5) !important;
}
</style>