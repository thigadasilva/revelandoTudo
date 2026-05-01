<template>
  <div class="admin-container">
    <Navbar />
    
    <main class="content">
      <header class="page-header">
        <div>
          <h1>Gerenciar Categorias</h1>
          <p>Adicione ou remova as categorias de serviço disponíveis no sistema.</p>
        </div>
        <router-link to="/admin" class="btn-back">← Voltar ao Painel</router-link>
      </header>

      <section class="manager-card glass-card">
        <div class="add-category-form">
          <input 
            v-model="novaCategoria" 
            placeholder="Nome da nova categoria (ex: Infraestrutura)" 
            class="dark-input"
            @keyup.enter="cadastrarCategoria"
          />
          <button @click="cadastrarCategoria" class="btn-primary" :disabled="!novaCategoria">
            Adicionar
          </button>
        </div>

        <div class="categories-list">
          <div v-if="loading" class="loading">Carregando...</div>
          
          <div v-for="cat in categorias" :key="cat.id" class="category-item">
            <span>{{ cat.nome }}</span>
            <button @click="deletarCategoria(cat.id)" class="btn-delete" title="Excluir">
              🗑️
            </button>
          </div>

          <div v-if="categorias.length === 0 && !loading" class="empty-state">
            Nenhuma categoria cadastrada ainda.
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue"
import api from "../services/api"

export default {
  components: { Navbar },
  data() {
    return {
      categorias: [],
      novaCategoria: "",
      loading: false
    }
  },
  mounted() {
    this.carregarCategorias()
  },
  methods: {
    async carregarCategorias() {
      this.loading = true
      try {
        const res = await api.get("/categorias")
        this.categorias = res.data
      } catch (err) {
        console.error("Erro ao carregar categorias", err)
      } finally {
        this.loading = false
      }
    },
    async cadastrarCategoria() {
      if (!this.novaCategoria) return
      try {
        await api.post("/categorias", { nome: this.novaCategoria })
        this.novaCategoria = ""
        this.carregarCategorias() 
      } catch (err) {
        alert("Erro ao cadastrar categoria.")
      }
    },
    async deletarCategoria(id) {
      if (!confirm("Tem certeza que deseja excluir esta categoria?")) return
      try {
        await api.delete(`/categorias/${id}`)
        this.carregarCategorias()
      } catch (err) {
        alert("Não é possível excluir categorias que estão sendo usadas em demandas.")
      }
    }
  }
}
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1a1a2e, #09011c);
  color: white;
  font-family: 'Poppins', sans-serif;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2rem;
  background: linear-gradient(to right, #c07bff, #8195fc);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 5px;
}

.page-header p { color: #939ead; font-size: 0.9rem; }

.btn-back {
  text-decoration: none;
  color: #c07bff;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(192, 123, 255, 0.2);
  transition: all 0.3s;
}

.btn-back:hover { background: rgba(192, 123, 255, 0.1); }

.glass-card {
  background: rgba(15, 25, 48, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(192, 123, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
}

.add-category-form {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.dark-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(192, 123, 255, 0.2);
  border-radius: 12px;
  padding: 12px 15px;
  color: white;
  outline: none;
}

.btn-primary {
  background: linear-gradient(to bottom right, #8e28ee, #4a66f1);
  border: none;
  color: white;
  padding: 0 25px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  filter: grayscale(1);
  transition: 0.3s;
}

.btn-delete:hover { filter: grayscale(0); transform: scale(1.2); }

.empty-state { text-align: center; color: #6b7280; padding: 20px; }
</style>