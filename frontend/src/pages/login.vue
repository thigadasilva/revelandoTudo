<template>
  <div class="login-container">
    
    <router-link to="/" class="btn-voltar-home">← Voltar para a Home</router-link>

    <div class="login-wrapper">
      
      <div class="login-left">
        <div class="brand-info">
          <h1>Revelando<span>Tudo</span></h1>
          <p>O Portal de Transparência Institucional da sua empresa.</p>
          
          <ul class="login-benefits">
            <li>✓ Acompanhe demandas em tempo real</li>
            <li>✓ Visibilidade total dos processos</li>
            <li>✓ Comunicação sem ruídos</li>
          </ul>
        </div>
      </div>

      <div class="login-right">
        <div class="form-card">
          <div class="form-header">
            <h2>Acesse sua conta</h2>
            <p>Insira seus dados para continuar</p>
          </div>

          <form @submit.prevent="handleLogin" class="form-login">
            
            <div class="role-selector">
              <label class="role-option" :class="{ active: roleSelecionado === 'student' }">
                <input type="radio" v-model="roleSelecionado" value="student" />
                Usuario
              </label>
              <label class="role-option" :class="{ active: roleSelecionado === 'admin' }">
                <input type="radio" v-model="roleSelecionado" value="admin" />
                Administrador
              </label>
            </div>

            <div class="field">
              <label>E-mail</label>
              <input type="email" v-model="email" placeholder="seu@email.edu.br" required />
            </div>
            
            <div class="field">
              <label>Senha</label>
              <input type="password" v-model="senha" placeholder="••••••••" required />
            </div>
            
            <p v-if="erro" class="erro-msg">{{ erro }}</p>
            
            <button type="submit" class="btn-submit" :disabled="carregando">
              {{ carregando ? 'Entrando...' : 'Entrar no Sistema' }}
            </button>

            <div class="register-link">
              <p>Não tem uma conta? <router-link to="/cadastro">Cadastre-se</router-link></p>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import api from "../services/api"

export default {
  name: 'Login',
  data() {
    return {
      roleSelecionado: 'student', 
      email: '',
      senha: '',
      erro: '',
      carregando: false
    }
  },
  methods: {
    async handleLogin() {
      this.erro = ''
      this.carregando = true

      try {
        const res = await api.post('/auth/login', {
        email: this.email,
        senha: this.senha
      })

    const { token, user } = res.data

    if (user.role !== this.roleSelecionado) {
      this.erro =
        user.role === 'admin'
          ? 'Essa conta pertence à área Institucional.'
          : 'Essa conta pertence à área Estudante.'

      return
    }

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    if (user.role === 'admin') {
      this.$router.push('/admin')
    } else {
      this.$router.push('/student')
    }
      } catch (err) {
        this.erro =
        err.response?.data?.error ||
        'Erro ao fazer login.'

        this.email = ''
        this.senha = ''
      } finally {
        this.carregando = false
      }
    }
  }
}
</script>

<style scoped>

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f1930; 
  padding: 24px;
  position: relative;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
}

.login-container::before,
.login-container::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
}

.login-container::before {
  width: 400px;
  height: 400px;
  background: rgba(142, 40, 238, 0.35);
  top: -100px;
  left: -100px;
}

.login-container::after {
  width: 300px;
  height: 300px;
  background: rgba(74, 102, 241, 0.3);
  bottom: -50px;
  right: -50px;
}

.btn-voltar-home {
  position: absolute;
  top: 30px;
  left: 40px;
  color: #939ead;
  text-decoration: none;
  font-weight: 500;
  z-index: 2;
  transition: color 0.3s ease;
}

.btn-voltar-home:hover {
  color: #c07bff;
}

.login-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1000px;
  width: 100%;
  z-index: 1;
  gap: 60px;
  animation: fade-in-up 0.6s ease-out forwards;
}

@keyframes fade-in-up {
  0% { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.login-left {
  flex: 1;
  color: #ffffff;
}

.brand-info h1 {
  font-size: 3.5rem;
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 1px;
  margin: 0 0 10px 0;
}

.brand-info h1 span {
  background: linear-gradient(to right, #c07bff, #8195fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-info p {
  font-size: 1.1rem;
  color: #939ead;
  margin-bottom: 30px;
  line-height: 1.6;
}

.login-benefits {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.login-benefits li {
  color: #c07bff;
  font-weight: 500;
  font-size: 1rem;
  background: rgba(192, 123, 255, 0.05);
  padding: 10px 15px;
  border-radius: 8px;
  border-left: 3px solid #c07bff;
  transition: all 0.3s ease-in-out;
}

.login-benefits li:hover {
  transform: translateX(10px);
  border-color: rgba(192, 123, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 30px rgba(151, 44, 251, 0.15);
}

.login-right {
  width: 100%;
  max-width: 420px;
}

.form-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(192, 123, 255, 0.12);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.form-header {
  text-align: center;
}

.form-header h2 { 
  font-size: 1.8rem; 
  font-weight: 600; 
  color: #ffffff; 
  margin: 0 0 5px 0; 
}

.form-header p { 
  font-size: 0.95rem; 
  color: #939ead; 
  margin: 0; 
}

.role-selector {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  padding: 6px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 5px;
}

.role-option {
  flex: 1;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #939ead;
  font-weight: 500;
  transition: all 0.3s ease;
}

.role-option input {
  display: none; 
}

.role-option.active {
  background: rgba(192, 123, 255, 0.15);
  color: #ffffff;
  border: 1px solid rgba(192, 123, 255, 0.3);
  box-shadow: 0 0 15px rgba(151, 44, 251, 0.1);
}

.form-login { 
  display: flex; 
  flex-direction: column; 
  gap: 18px; 
}

.field { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
}

.field label { 
  font-size: 0.9rem; 
  font-weight: 500; 
  color: #ffffff; 
}

.field input {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.field input::placeholder { 
  color: rgba(255, 255, 255, 0.3); 
}

.field input:focus { 
  border-color: #c07bff; 
  box-shadow: 0 0 10px rgba(192, 123, 255, 0.2);
}

.erro-msg { color: #ff6b6b; font-size: 0.85rem; margin: 0; text-align: center; }

.btn-submit {
  background-image: linear-gradient(to bottom right, #8e28ee, #4a66f1);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-family: 'Poppins', sans-serif;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) { 
  box-shadow: 0 0 20px rgba(151, 44, 251, 0.5); 
}
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.register-link {
  text-align: center;
  margin-top: 10px;
}

.register-link p {
  color: #939ead;
  font-size: 0.9rem;
  margin: 0;
}

.register-link a {
  color: #c07bff;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #8195fc;
  text-decoration: underline;
}

@media (max-width: 850px) {
  .login-wrapper {
    flex-direction: column;
    gap: 40px;
    text-align: center;
  }
  .login-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .login-benefits li {
    text-align: left;
  }
}
</style>