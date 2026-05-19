<template>
  <div class="cadastro-container">

    <router-link to="/cadastro" class="btn-voltar">
      ← Voltar
    </router-link>

    <div class="cadastro-wrapper">

      <div class="left-side">
        <div class="brand-box">
          <h1>Revelando<span>Tudo</span></h1>
          <h2>Crie o portal oficial da sua empresa</h2>

          <p>
            Cadastre sua instituição, defina um código universal e permita
            que usuários solicitem acesso ao sistema usando esse código.
          </p>

          <ul>
            <li>✓ Gestão profissional de solicitações</li>
            <li>✓ Código institucional exclusivo</li>
            <li>✓ Painel administrativo inteligente</li>
          </ul>
        </div>
      </div>

      <div class="right-side">
        <div class="form-card">

          <div class="header-form">
            <h2>Cadastro Institucional</h2>
            <p>Preencha os dados para começar</p>
          </div>

          <form @submit.prevent="cadastrarAdmin">

            <div class="grid-2">
              <div class="field">
                <label>Nome do Responsável</label>
                <input v-model="nome" type="text" required>
              </div>

              <div class="field">
                <label>Cargo</label>
                <input v-model="cargo" type="text" required>
              </div>
            </div>

            <div class="field">
              <label>Empresa</label>
              <input v-model="empresa" type="text" required>
            </div>

            <div class="grid-2">
              <div class="field">
                <label>CNPJ</label>
                <input v-model="cnpj" type="text" required>
              </div>

              <div class="field">
                <label>Telefone</label>
                <input v-model="telefone" type="text" required>
              </div>
            </div>

            <div class="field">
              <label>Email Corporativo</label>
              <input v-model="email" type="email" required>
            </div>

            <div class="field">
              <label>Código Institucional Universal</label>
              <input
                v-model="codigoInstitucional"
                type="text"
                placeholder="Ex: SENAI2026"
                required
              >
              <small class="dica">
                Esse código será usado pelos usuários para solicitar acesso.
              </small>
            </div>

            <div class="grid-2">
              <div class="field">
                <label>Senha</label>
                <input v-model="senha" type="password" required>
              </div>

              <div class="field">
                <label>Confirmar Senha</label>
                <input v-model="confirmarSenha" type="password" required>
              </div>
            </div>

            <p v-if="erro" class="erro">{{ erro }}</p>
            <p v-if="sucesso" class="sucesso">{{ sucesso }}</p>

            <button type="submit" :disabled="carregando">
              {{ carregando ? "Criando..." : "Criar Conta Institucional" }}
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
  name: "CadastroAdmin",

  data() {
    return {
      nome: "",
      cargo: "",
      empresa: "",
      cnpj: "",
      telefone: "",
      email: "",
      codigoInstitucional: "",
      senha: "",
      confirmarSenha: "",
      erro: "",
      sucesso: "",
      carregando: false
    }
  },

  methods: {
    async cadastrarAdmin() {

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
        this.erro = "O código institucional precisa ter no mínimo 4 caracteres."
        return
      }

      this.carregando = true

      try {

        await api.post("/auth/registrar", {
          nome: this.nome,
          cargo: this.cargo,
          empresa: this.empresa,
          cnpj: this.cnpj,
          telefone: this.telefone,
          email: this.email,
          senha: this.senha,
          role: "admin",
          codigoInstitucional: this.codigoInstitucional.toUpperCase()
        })

        this.sucesso = "Conta criada com sucesso!"

        setTimeout(() => {
          this.$router.push("/login")
        }, 1500)

      } catch (err) {

        this.erro =
          err.response?.data?.error ||
          "Erro ao cadastrar empresa."

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
  max-width: 1200px;
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
  background-clip:text;
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
  margin-top: 30px;
  padding: 0;
  list-style: none;
}

.brand-box li {
  margin-bottom: 15px;
  color: #c07bff;
}

.right-side {
  width: 480px;
}

.form-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(192,123,255,0.12);
  backdrop-filter: blur(12px);
  padding: 35px;
  border-radius: 22px;
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

.dica {
  color: #939ead;
  font-size: 0.78rem;
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

</style>