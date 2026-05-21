<template>
  <div class="cadastro-container">

    <router-link to="/" class="btn-voltar">
      ← Voltar para Home
    </router-link>

    <div class="cadastro-wrapper">

      <div class="top-content">
        <h1>Escolha seu <span>tipo de cadastro</span></h1>
        <p>
          Crie sua conta de acordo com seu perfil e tenha acesso ao
          ecossistema RevelandoTudo.
        </p>
      </div>

      <div class="cards-area">

        <div class="card-option">
          <div class="badge">Institucional</div>

          <h2>Cadastro Admin</h2>

          <p>
            Ideal para empresas, gestores e responsáveis que desejam
            administrar demandas, atualizar processos e acompanhar tudo em
            tempo real.
          </p>

          <ul>
            <li>✓ Painel administrativo</li>
            <li>✓ Gestão de demandas</li>
            <li>✓ Controle institucional</li>
          </ul>

          <router-link to="/cadastro-admin" class="btn-card">
            Criar Conta Admin
          </router-link>
        </div>

        <div class="card-option">
          <div class="badge user">Usuário</div>

          <h2>Cadastro Usuário</h2>

          <p>
            Para colaboradores e usuários vinculados a uma instituição que
            desejam apenas acompanhar demandas e atualizações.
          </p>

          <ul>
            <li>✓ Acompanhamento em tempo real</li>
            <li>✓ Histórico completo</li>
            <li>✓ Conta simples e rápida</li>
          </ul>

          <router-link to="/cadastro-usuario" class="btn-card">
            Criar Conta Usuário
          </router-link>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: "Cadastro"
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
  width: 420px;
  height: 420px;
  background: rgba(142, 40, 238, 0.22);
  top: -120px;
  left: -120px;
}

.cadastro-container::after {
  width: 350px;
  height: 350px;
  background: rgba(74, 102, 241, 0.22);
  bottom: -100px;
  right: -100px;
}

.btn-voltar {
  position: absolute;
  top: 30px;
  left: 40px;
  color: #939ead;
  text-decoration: none;
  z-index: 5;
  transition: .3s;
}

.btn-voltar:hover {
  color: #c07bff;
}

.cadastro-wrapper {
  width: 100%;
  max-width: 1250px;
  z-index: 2;
}

.top-content {
  text-align: center;
  margin-bottom: 60px;
}

.top-content h1 {
  font-size: 3.7rem;
  color: white;
  margin-bottom: 15px;
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 1px;
}

.top-content span {
  background: linear-gradient(to right, #c07bff, #8195fc);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.top-content p {
  color: #939ead;
  font-size: 1.05rem;
  max-width: 650px;
  margin: auto;
  line-height: 1.7;
}

.cards-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 35px;
}

.card-option {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(192,123,255,0.12);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 35px;
  transition: .3s ease;
}

.card-option:hover {
  transform: translateY(-8px);
  border-color: rgba(192,123,255,0.35);
  box-shadow: 0 0 25px rgba(151,44,251,.15);
}

.badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: .85rem;
  background: rgba(192,123,255,.15);
  color: #c07bff;
  margin-bottom: 20px;
}

.badge.user {
  background: rgba(74,102,241,.15);
  color: #8195fc;
}

.card-option h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 15px;
}

.card-option p {
  color: #939ead;
  line-height: 1.7;
  margin-bottom: 25px;
}

.card-option ul {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.card-option li {
  color: white;
  margin-bottom: 12px;
}

.btn-card {
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 14px;
  border-radius: 14px;
  text-decoration: none;
  background-image: linear-gradient(to bottom right, #8e28ee, #4a66f1);
  color: white;
  font-weight: 600;
  transition: .3s;
}

.btn-card:hover {
  box-shadow: 0 0 20px rgba(151,44,251,.35);
}

@media (max-width: 950px) {

  .cards-area {
    grid-template-columns: 1fr;
  }

  .top-content h1 {
    font-size: 2.7rem;
  }

}

</style>