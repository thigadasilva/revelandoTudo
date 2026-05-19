<template>
  <div class="home-container">
    <header class="navbar-home">
      <h2>RevelandoTudo</h2>
      <div class="navbar-buttons">
        <router-link to="/login" class="btn-login-outline">
          Login
        </router-link>
        <router-link to="/cadastro" class="btn-register">
          Cadastre-se
        </router-link>
      </div>
    </header>

    <main class="hero-section">
      <div class="hero-content">
        <h1><span>Gerencie as demandas</span> da sua empresa com inteligência.</h1>
        <p>
          Acompanhe processos internos, aprove pedidos de melhorias e mantenha
          toda a sua equipe atualizada em tempo real com o nosso dashboard interativo.
        </p>
        <div class="hero-buttons">
          <router-link to="/login" class="btn-primary-large">
            Acessar o Sistema
          </router-link>
          <a href="#features" class="btn-more-info">
            Mais Funções
          </a>
        </div>
      </div>
      <div class="hero-image">
        <img :src="dashboardImage" alt="Dashboard">
      </div>
    </main>

    <section class="features-section" id="features">
      <div class="features-header">
        <h2>Projetado para <span>Visibilidade e Velocidade</span></h2>
        <p>
          Acompanhe cada solicitação em tempo real, mantenha todos informados e elimine a falta de transparência nos processos internos.
        </p>
      </div>

      <div class="features-cards">
        <div class="feature-card">
          <h3>Status Visual em Tempo Real</h3>
          <p>
            Acompanhe o avanço de cada solicitação através de barras de progresso e etiquetas de status claras, da abertura até a conclusão.
          </p>
        </div>

        <div class="feature-card">
          <h3>Histórico e Rastreabilidade</h3>
          <p>
            Total transparência no processo: acesse uma linha do tempo detalhada com todas as atualizações e decisões tomadas em cada demanda.
          </p>
        </div>

        <div class="feature-card">
          <h3>Painel Gerencial Intuitivo</h3>
          <p>
            Visão panorâmica para gestores. Controle o total de demandas abertas, em andamento e concluídas em um dashboard prático.
          </p>
        </div>

        <div class="feature-card">
          <h3>Filtros Inteligentes</h3>
          <p>
            Encontre exatamente a informação que precisa em segundos, categorizando as demandas por status ou área de forma simplificada.
          </p>
        </div>

        <div class="feature-card">
          <h3>Autonomia para a Equipe</h3>
          <p>
            Dê independência aos usuários. Eles mesmos abrem, acompanham e interagem com os chamados, sem depender de e-mails ou cobranças.
          </p>
        </div>

        <div class="feature-card">
          <h3>Centralização Total</h3>
          <p>
            Diga adeus à perda de informações. Reúna todos os pedidos de melhorias, correções e feedbacks em uma única plataforma segura.
          </p>
        </div>
      </div>
      <div class="benefits-wrapper">
        <div class="benefits-image-container">
          <img :src="imgBeneficios" alt="vantagens">
        </div>

        <div class="benefits-content">
          <h2><span>Transforme</span> a Cultura da sua Empresa</h2>
          <p>
            Implantar o RevelandoTudo vai muito além de apenas organizar tarefas. É sobre criar um ambiente de trabalho onde a informação flui sem barreiras, gerando confiança e resultados.
          </p>

          <ul class="benefits-list">
            <li>
              <strong><span>Aumento de Produtividade</span></strong>
              Reduza o tempo perdido em reuniões de alinhamento e e-mails perguntando "como está aquela minha solicitação?".
            </li>
            <li>
              <strong><span>Fim dos Gargalos</span></strong>
              Gestores conseguem identificar rapidamente quais departamentos estão sobrecarregados ou onde os processos estão travando.
            </li>
            <li>
              <strong><span>Maior Engajamento</span></strong>
              Colaboradores se sentem mais valorizados e motivados quando conseguem acompanhar o impacto e o avanço dos seus próprios pedidos.
            </li>
          </ul>
        </div>
      </div>
    </section>
    
    <footer class="footer-section">
      <div class="footer-content">
        <div class="footer-brand">
          <h2>RevelandoTudo</h2>
          <p>"Pedi, e daí."</p>
        </div>

        <div class="footer-links">
          <h3>Links Úteis</h3>
          <ul>
            <li><a href="#">Sobre Nós</a></li>
            <li><a href="#">Suporte</a></li>
            <li><a href="#">Política de Privacidade</a></li>
            <li><a href="#">Termos de Uso</a></li>
          </ul>
        </div>

        <div class="footer-contact">
          <h3>Contato</h3>
          <p>contato@revelandotudo.com.br</p>
          <p>(11) 99999-9999</p>
          <div class="social-links">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 RevelandoTudo. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import dashboardImage from "../assets/images/demanda.jpg"
import imgBeneficios from "../assets/images/dashboard.jpg"

export default {
  name: "Home",
  data() {
    return {
      dashboardImage,
      imgBeneficios
    }
  }
}
</script>

<style scoped>
@keyframes fade-in-left{
  0%{
    opacity: 0;
    transform: translateX(-50px);
  }
  100%{
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-right {
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.home-container {
  min-height: 100vh;
  background: #0f1930;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: clip;
}

.home-container::before,
.home-container::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
}

.home-container::before {
  width: 400px;
  height: 400px;
  background: rgba(142, 40, 238, 0.35);
  top: 250px;
  left: -250px;
}

.home-container::after {
  width: 300px;
  height: 300px;
  background: rgba(74, 102, 241, 0.3);
  bottom: -80px;
  right: -80px;
}

.navbar-home {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(9, 1, 28, 0.54);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(238, 231, 231, 0.05);
}

.navbar-home h2 {
  margin: 0;
  color: #ffffff;
  font-weight: 800;
  font-family: 'Poppins', sans-serif;
}

.navbar-buttons{
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-login-outline {
  padding: 1em 2em;
  text-decoration: none;
  border: 2px solid rgba(192, 123, 255, 0.4);
  color: #ffffff;
  border-radius: 15px;
  transition: all 0.2s ease-in-out;
  font-family: 'Poppins', sans-serif;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.btn-login-outline:hover {
  border-color: #c07bff;
  box-shadow: 0px 0 15px #972cfb;
}

.btn-register {
  padding: 1em 2em;
  text-decoration: none;
  background-image: linear-gradient(to bottom right, #8e28ee, #4a66f1);
  color: #fff;
  border-radius: 15px;
  transition: all 0.2s ease-in-out;
  font-family: 'Poppins', sans-serif;
}

.btn-register:hover {
  box-shadow: 0 0 15px #972cfb;
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 80px 60px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  z-index: 1;
  gap: 60px;
}

.hero-content {
  max-width: 600px;
  text-align: left;
  opacity: 0;
  animation: fade-in-left 1s ease-out forwards;
}

.hero-content h1 {
  font-size: 4.9rem;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.2;
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 1px;
}

.hero-content h1 span {
  background: linear-gradient(to right, #c07bff, #8195fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-content p {
  font-size: 1rem;
  color: #939ead;
  margin-bottom: 40px;
  line-height: 1.6;
  font-family: 'Poppins', sans-serif;
}

.hero-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary-large {
  text-decoration: none;
  background-image: linear-gradient(to bottom right, #8e28ee, #4a66f1);
  color: white;
  padding: 15px 32px;
  border-radius: 15px;
  font-size: 1.1rem;
  transition: all 0.3s ease-in-out;
  font-family: 'Poppins', sans-serif;
}

.btn-primary-large:hover {
  box-shadow: 0.5px 0 20px #972cfb;
}

.btn-more-info {
  padding: 1em 2em;
  text-decoration: none;
  border: 2px solid rgba(192, 123, 255, 0.4);
  color: #ffffff;
  border-radius: 15px;
  transition: all 0.2s ease-in-out;
  font-family: 'Poppins', sans-serif;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  transition: 0.2s ease-in-out;
}

.btn-more-info:hover {
  border-color: #c07bff;
  box-shadow: 0 0 30px rgba(151, 44, 251, 0.652);
}

.hero-image{
  width: 600px;
  padding: 1px;
  border-radius: 21px;
  background: linear-gradient(to bottom right, #c07bff, #8195fc);
  box-shadow: 0 0 20px rgba(151, 44, 251, 0.25);
  opacity: 0;
  animation: fade-in-right 1s ease-out 0.3s forwards;
}

.hero-image img{
  width: 100%;
  display: block;
  border-radius: 20px;
}

.features-section {
  width: 100%;
  padding: 100px 80px;
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 40px;
  scroll-margin-top: 50px;
}

.features-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px auto;
}

.features-header h2 {
  font-size: 2.8rem;
  color: #ffffff;
  margin-bottom: 20px;
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 1px;
}

.features-header h2 span {
  background: linear-gradient(to right, #c07bff, #8195fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-header p {
  font-size: 1.1rem;
  color: #939ead;
  line-height: 1.8;
  font-family: 'Poppins', sans-serif;
}

.features-cards {
  display: flex;
  justify-content: center;
  gap: 75px;
  flex-wrap: wrap;
}

.feature-card {
  width: 320px;
  padding: 30px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(192, 123, 255, 0.12);
  backdrop-filter: blur(12px);
  box-shadow: 0 0 20px rgba(151, 44, 251, 0.08);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgba(192, 123, 255, 0.4);
  box-shadow: 0 0 30px rgba(151, 44, 251, 0.15);
}

.feature-card h3 {
  font-size: 1.4rem;
  color: #ffffff;
  margin-bottom: 15px;
  font-family: 'Poppins', sans-serif;
}

.feature-card p {
  color: #939ead;
  line-height: 1.7;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
}

.benefits-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  margin-top: 120px;
  padding: 0 20px;
}

.benefits-image-container {
  width: 600px;
  padding: 1px;
  border-radius: 21px;
  background: linear-gradient(to bottom right, #c07bff, #8195fc);
  box-shadow: 0 0 20px rgba(151, 44, 251, 0.25);
  flex-shrink: 0;
}

.benefits-image-container img {
  width: 100%;
  display: block;
  border-radius: 20px;
}

.benefits-content {
  flex: 1;
  max-width: 600px;
  text-align: left;
}

.benefits-content h2 {
  font-size: 3rem;
  color: #ffffff;
  font-family: 'Bebas Neue', sans-serif;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.benefits-content h2 span {
  background: linear-gradient(to right, #c07bff, #8195fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.benefits-content p {
  font-size: 1.1rem;
  color: #939ead;
  line-height: 1.7;
  margin-bottom: 40px;
  font-family: 'Poppins', sans-serif;
}

.benefits-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.benefits-list li {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(192, 123, 255, 0.12);
  padding: 24px;
  border-radius: 16px;
  color: #939ead;
  backdrop-filter: blur(12px);
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.benefits-list li:hover {
  transform: translateX(10px);
  border-color: rgba(192, 123, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 30px rgba(151, 44, 251, 0.15);
}

.benefits-list li strong {
  display: block;
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.benefits-list li span{
  background: linear-gradient(to right, #c07bff, #8195fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-section {
  background: #070b15;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 60px 80px 20px 80px;
  margin-top: auto;
  position: relative;
  z-index: 1;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto 40px auto;
}

.footer-brand h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 10px 0;
}

.footer-brand p {
  color: #c07bff;
  font-family: 'Poppins', sans-serif;
  font-style: italic;
  font-size: 1rem;
  margin: 0;
}

.footer-links h3,
.footer-contact h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
  color: #ffffff;
  margin-bottom: 20px;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  text-decoration: none;
  color: #939ead;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #c07bff;
}

.footer-contact p {
  color: #939ead;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  margin: 0 0 12px 0;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.social-links a {
  text-decoration: none;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  border: 1px solid rgba(192, 123, 255, 0.3);
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background: rgba(192, 123, 255, 0.1);
  border-color: #c07bff;
  box-shadow: 0 0 10px rgba(151, 44, 251, 0.2);
}

.footer-bottom {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-bottom p {
  color: #6b7280;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  margin: 0;
}
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;500;600;700&display=swap');

html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  background: #0f1930;
  font-family: 'Poppins', sans-serif;
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
}
</style>