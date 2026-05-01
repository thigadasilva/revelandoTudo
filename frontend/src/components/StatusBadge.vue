<template>
  <span :class="badgeClass">{{ status }}</span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true
    }
  },
  computed: {
    badgeClass() {
      const map = {
        'Em análise': 'badge badge-analise',
        'Em andamento': 'badge badge-andamento',
        'Concluída': 'badge badge-concluida'
      }
      return map[this.status] || 'badge'
    }
  }
}
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  border: 1px solid transparent;
  letter-spacing: 0.5px;
}

.badge-analise {
  background: rgba(254, 215, 102, 0.1);
  color: #fed766;
  border-color: rgba(254, 215, 102, 0.3);
}

.badge-andamento {
  background: rgba(74, 102, 241, 0.1);
  color: #8195fc;
  border-color: rgba(74, 102, 241, 0.3);
}

.badge-concluida {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.3);
}
</style>