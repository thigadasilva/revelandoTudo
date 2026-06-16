<template>
  <div class="page-container">
    <Navbar/>
    <div class="content-wrapper">
      <div class="page-header">
        <h1>Lista de <span>Demandas</span></h1>
        <p>Acompanhe e gerencie todos os chamados abertos no sistema.</p>
      </div>

      <ul class="demandas-list">
        <li v-for="demanda in demandas" :key="demanda.id" class="demanda-item">
          <div class="demanda-info">
            <span class="demanda-titulo">{{ demanda.titulo }}</span>
          </div>
          <span class="demanda-status">{{ demanda.status }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue"
import api from "../services/api"

export default {
  components: {
    Navbar
  },
  data() {
    return {
      demandas: []
    }
  },
  async mounted() {
    const response = await api.get("/demandas")
    this.demandas = response.data
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
  width: 400px;
  height: 400px;
  background: rgba(74, 102, 241, 0.2);
  border-radius: 50%;
  filter: blur(120px);
  top: 100px;
  right: -100px;
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 50px 80px;
  max-width: 1000px;
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

.demandas-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demanda-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(192, 123, 255, 0.12);
  padding: 20px 24px;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}

.demanda-item:hover {
  transform: translateX(10px);
  border-color: rgba(192, 123, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 20px rgba(151, 44, 251, 0.15);
}

.demanda-info {
  display: flex;
  flex-direction: column;
}

.demanda-titulo {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 500;
}

.demanda-status {
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(192, 123, 255, 0.15);
  color: #c07bff;
  border: 1px solid rgba(192, 123, 255, 0.3);
  font-weight: 600;
}

@media (max-width: 768px) {
  .content-wrapper { padding: 30px 20px; }
  .demanda-item { flex-direction: column; align-items: flex-start; gap: 10px; }
}
</style>