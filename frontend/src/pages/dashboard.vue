<template>
  <div class="page-container">
    <Navbar/>
    <div class="content-wrapper">
      <div class="page-header">
        <h1>Visão Geral do <span>Dashboard</span></h1>
        <p>Acompanhe o volume e o progresso de todas as demandas em tempo real.</p>
      </div>

      <div class="cards-grid">
        <StatCard titulo="Demandas Abertas" :valor="10" />
        <StatCard titulo="Em Andamento" :valor="5" />
        <StatCard titulo="Concluídas" :valor="20" />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue"
import StatCard from "../components/StatCard.vue"

export default {
  components: {
    Navbar,
    StatCard
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #0f1930;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.page-container::before {
  content: "";
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(142, 40, 238, 0.2);
  border-radius: 50%;
  filter: blur(120px);
  top: -100px;
  left: -150px;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 50px 80px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 50px;
}

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
  margin: 0;
}

.cards-grid {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

:deep(.card) {
  flex: 1;
  min-width: 250px;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(192, 123, 255, 0.12) !important;
  backdrop-filter: blur(12px) !important;
  box-shadow: 0 0 20px rgba(151, 44, 251, 0.05) !important;
  border-radius: 20px !important;
  padding: 30px !important;
  transition: all 0.3s ease !important;
  text-align: left !important;
}

:deep(.card:hover) {
  transform: translateY(-8px) !important;
  border-color: rgba(192, 123, 255, 0.4) !important;
  box-shadow: 0 0 30px rgba(151, 44, 251, 0.15) !important;
}

:deep(.card h3) {
  font-family: 'Poppins', sans-serif;
  color: #939ead !important;
  font-size: 1.1rem !important;
  font-weight: 500 !important;
  margin-bottom: 10px !important;
}

:deep(.card .numero) {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3.5rem !important;
  margin: 0 !important;
  background: linear-gradient(to right, #c07bff, #8195fc);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (max-width: 768px) {
  .content-wrapper { padding: 30px 20px; }
  .cards-grid { flex-direction: column; }
}
</style>