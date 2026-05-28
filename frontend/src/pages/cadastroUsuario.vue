<template>
  <div class="cadastro-container">

    <router-link to="/cadastro" class="btn-voltar">
      ← Voltar
    </router-link>

    <div class="cadastro-wrapper">

      <div class="left-side">
        <div class="brand-box">
          <h1>Revelando<span>Tudo</span></h1>
          <h2>Crie sua conta de usuário</h2>

          <p>
            Informe o código da turma da sua empresa para enviar
            sua solicitação de acesso ao administrador.
          </p>

          <ul>
            <li>✓ Solicitação rápida de acesso</li>
            <li>✓ Acompanhamento de demandas</li>
            <li>✓ Ambiente seguro e organizado</li>
          </ul>
        </div>
      </div>

      <div class="right-side">
        <div class="form-card">

          <div class="header-form">
            <h2>Cadastro de Usuário</h2>
            <p>Preencha seus dados para começar</p>
          </div>

          <form @submit.prevent="cadastrarUsuario">

            <div class="field">
              <label>Nome Completo</label>
              <input
                v-model="nome"
                type="text"
                required
              >
            </div>

            <div class="field">
              <label>Email</label>
              <input
                v-model="email"
                type="email"
                required
              >
            </div>

            <div class="field">
              <label>Código da Turma</label>
              <input
                v-model="codigoInstitucional"
                type="text"
                placeholder="Ex: SENAI2026"
                required
              >
            </div>

            <div class="grid-2">

              <div class="field">
                <label>Senha</label>
                <div class="input-wrapper">
                  <input
                    v-model="senha"
                    :type="mostrarSenha ? 'text' : 'password'"
                    required
                  >
                  <button type="button" class="btn-toggle-senha" @click="mostrarSenha = !mostrarSenha" title="Mostrar/Ocultar Senha">
                    <svg v-if="mostrarSenha" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                  </button>
                </div>
              </div>

              <div class="field">
                <label>Confirmar Senha</label>
                <div class="input-wrapper">
                  <input
                    v-model="confirmarSenha"
                    :type="mostrarConfirmarSenha ? 'text' : 'password'"
                    required
                  >
                  <button type="button" class="btn-toggle-senha" @click="mostrarConfirmarSenha = !mostrarConfirmarSenha" title="Mostrar/Ocultar Senha">
                    <svg v-if="mostrarConfirmarSenha" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                  </button>
                </div>
              </div>

            </div>

            <p v-if="erro" class="erro">{{ erro }}</p>
            <p v-if="sucesso" class="sucesso">{{ sucesso }}</p>

            <button type="submit" :disabled="carregando">
              {{ carregando ? "Enviando..." : "Solicitar Cadastro" }}
            </button>

          </form>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
import api from "../services/api"

export default {
  name: "CadastroUsuario",

  data() {
    return {
      nome: "",
      email: "",
      codigoInstitucional: "",
      senha: "",
      confirmarSenha: "",
      mostrarSenha: false,
      mostrarConfirmarSenha: false,
      erro: "",
      sucesso: "",
      carregando: false
    }
  },

  methods: {

    async cadastrarUsuario() {

      this.erro = ""
      this.sucesso = ""

      if (this.senha !== this.confirmarSenha) {
        this.erro = "As senhas não coincidem."
        return
      }

      if (this.senha.length < 6) {
        this.erro = "A senha precisa ter no mínimo 6 caracteres."
        return
      }

      if (this.codigoInstitucional.length < 4) {
        this.erro = "Informe um código de turma válido."
        return
      }

      this.carregando = true

      try {

        await api.post("/auth/registrar", {
          nome: this.nome,
          email: this.email,
          senha: this.senha,
          role: "student",
          codigoInstitucional: this.codigoInstitucional.toUpperCase()
        })

        this.sucesso =
          "Solicitação enviada com sucesso! Aguarde aprovação."

        this.nome = ""
        this.email = ""
        this.codigoInstitucional = ""
        this.senha = ""
        this.confirmarSenha = ""

        setTimeout(() => {
          this.$router.push("/login")
        }, 1800)

      } catch (err) {

        this.erro =
          err.response?.data?.error ||
          "Erro ao enviar solicitação."

      } finally {
        this.carregando = false
      }

    }

  }
}
</script>

<style scoped>

.cadastro-container {
  min-height: 100vh;
  background: #0f1930;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  position: relative;
  overflow: hidden;
}

.cadastro-container::before,
.cadastro-container::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.cadastro-container::before {
  width: 400px;
  height: 400px;
  background: rgba(142, 40, 238, 0.25);
  top: -100px;
  left: -100px;
}

.cadastro-container::after {
  width: 350px;
  height: 350px;
  background: rgba(74, 102, 241, 0.25);
  bottom: -100px;
  right: -100px;
}

.btn-voltar {
  position: absolute;
  top: 30px;
  left: 40px;
  color: #939ead;
  text-decoration: none;
}

.cadastro-wrapper {
  width: 100%;
  max-width: 1150px;
  display: flex;
  gap: 60px;
  z-index: 2;
}

.left-side {
  flex: 1;
  color: white;
}

.brand-box h1 {
  font-size: 4rem;
  font-family: 'Bebas Neue', sans-serif;
}

.brand-box span {
  background: linear-gradient(to right, #c07bff, #8195fc);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-box h2 {
  margin-top: 20px;
}

.brand-box p {
  color: #939ead;
  line-height: 1.7;
}

.brand-box ul {
  list-style: none;
  padding: 0;
  margin-top: 30px;
}

.brand-box li {
  color: #c07bff;
  margin-bottom: 14px;
}

.right-side {
  width: 460px;
}

.form-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(192,123,255,0.12);
  backdrop-filter: blur(12px);
  border-radius: 22px;
  padding: 35px;
}

.header-form {
  text-align: center;
  margin-bottom: 25px;
}

.header-form h2 {
  color: white;
}

.header-form p {
  color: #939ead;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  color: white;
  font-size: 0.9rem;
}

input {
  width: 100%;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 12px;
  color: white;
  outline: none;
}

input:focus {
  border-color: #c07bff;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.input-wrapper input {
  width: 100%;
  padding-right: 40px;
}
button.btn-toggle-senha {
  position: absolute;
  right: 12px;
  background: transparent;
  background-image: none;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 1.2rem;
  color: #939ead;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
button.btn-toggle-senha:hover {
  transform: scale(1.1);
  color: #c07bff;
}

input::placeholder {
  color: rgba(255,255,255,0.35);
}

button {
  margin-top: 10px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background-image: linear-gradient(to bottom right, #8e28ee, #4a66f1);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: .6;
}

.erro {
  color: #ff6b6b;
  text-align: center;
}

.sucesso {
  color: #4ade80;
  text-align: center;
}

@media (max-width: 980px) {
  .cadastro-wrapper {
    flex-direction: column;
  }

  .right-side {
    width: 100%;
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .cadastro-container {
    padding-top: 80px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .cadastro-wrapper {
    gap: 30px;
  }
  .btn-voltar {
    top: 20px;
    left: 20px;
  }
  .brand-box h1 {
    font-size: 3rem;
  }
  .form-card {
    padding: 25px;
  }
}

</style>