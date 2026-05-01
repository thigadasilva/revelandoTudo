<template>
  <nav class="navbar glass-navbar">
    <div class="nav-left">
      <h2 class="logo">RevelandoTudo</h2>
      <span class="divider"></span>
      <span class="page-indicator">
        {{ role === 'admin' ? 'Dashboard Empresa' : 'Área do Usuário' }}
      </span>
    </div>

    <div class="nav-right">
      <div 
        class="profile-menu" 
        @click="toggleDropdown" 
        ref="profileMenu"
      >
        <div class="user-info hide-sm">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ role === 'admin' ? 'Administrador' : 'Estudante/Usuário' }}</span>
        </div>
        
        <div class="avatar">
          {{ userInitials }}
        </div>
        
        <span class="arrow" :class="{ 'open': showDropdown }">▼</span>

        <transition name="fade-slide">
          <div v-if="showDropdown" class="dropdown-content glass-panel">
            <div class="dropdown-header show-sm-only">
              <p class="dropdown-name">{{ userName }}</p>
              <p class="dropdown-role">{{ role === 'admin' ? 'Administrador' : 'Estudante/Usuário' }}</p>
            </div>
            
            <template v-if="role === 'admin'">
              <router-link to="/admin/categorias" class="dropdown-item">
                <span class="icon">🏷️</span> Gerenciar Categorias
              </router-link>
              <div class="dropdown-divider"></div>
            </template>
            
            <button class="dropdown-item logout-btn" @click.stop="logout">
              <span class="icon">🚪</span> Sair do Sistema
            </button>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      user: {},
      showDropdown: false
    }
  },
  computed: {
    role() {
      return this.user.role || null
    },
   userName() {
      const nomeCompleto = this.user.nome || "Usuário"
      return nomeCompleto.trim().split(/\s+/)[0]
    },
    userInitials() {
      if (!this.user.nome) return "U"
      
      // O trim() remove espaços acidentais no início e fim.
      // O split(/\s+/) divide corretamente mesmo se tiver dois espaços seguidos.
      const names = this.user.nome.trim().split(/\s+/)
      
      // Se tiver nome e sobrenome
      if (names.length >= 2) {
        // Pega a primeira letra do primeiro nome + primeira letra do último nome
        const primeiraLetra = names[0].charAt(0)
        const ultimaLetra = names[names.length - 1].charAt(0)
        return (primeiraLetra + ultimaLetra).toUpperCase()
      }
      
      // Se tiver só um nome, pega as duas primeiras letras
      return names[0].substring(0, 2).toUpperCase()
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user") || "{}")
    // Adiciona o evento para fechar o menu ao clicar fora dele
    document.addEventListener("click", this.handleClickOutside)
  },
  beforeUnmount() {
    // Limpa o evento ao sair da página
    document.removeEventListener("click", this.handleClickOutside)
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    handleClickOutside(event) {
      const menu = this.$refs.profileMenu
      // Se clicou fora do menu, fecha o dropdown
      if (menu && !menu.contains(event.target)) {
        this.showDropdown = false
      }
    },
    logout() {
      this.showDropdown = false
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      this.$router.push("/")
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  position: relative;
  z-index: 50; 
  margin-bottom: 30px;
}

.glass-navbar {
  background: rgba(9, 1, 28, 0.54);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(192, 123, 255, 0.12);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.glass-panel {
  background: rgba(15, 25, 48, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(192, 123, 255, 0.2);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(to right, #c07bff, #8195fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.divider {
  height: 24px;
  width: 2px;
  background: rgba(192, 123, 255, 0.3);
  border-radius: 2px;
}

.page-indicator {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.nav-right {
  display: flex;
  align-items: center;
}

.profile-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 30px;
  transition: background 0.3s ease;
  position: relative; 
}

.profile-menu:hover {
  background: rgba(255, 255, 255, 0.05);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.user-name {
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}

.user-role {
  font-family: 'Poppins', sans-serif;
  font-size: 0.75rem;
  color: #939ead;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-image: linear-gradient(to bottom right, #8e28ee, #4a66f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 0 15px rgba(151, 44, 251, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.arrow {
  font-size: 0.6rem;
  color: #939ead;
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
  color: #c07bff;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 220px;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.dropdown-header {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
}

.dropdown-name {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #ffffff;
  font-size: 0.95rem;
}

.dropdown-role {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  color: #939ead;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(192, 123, 255, 0.15);
  color: #c07bff;
}

.logout-btn:hover {
  background: rgba(255, 74, 74, 0.1) !important;
  color: #ff6b6b !important;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 4px 8px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.show-sm-only {
  display: none;
}

@media (max-width: 768px) {
  .navbar {
    padding: 15px 20px;
  }
  .hide-sm {
    display: none;
  }
  .show-sm-only {
    display: block;
  }
  .page-indicator {
    font-size: 0.85rem;
  }
  .logo {
    font-size: 1.6rem;
  }
}
</style>