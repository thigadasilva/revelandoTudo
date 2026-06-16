<template>
  <section class="swagger-page">
    <header class="swagger-header">
      <h1>Documentacao da API</h1>
      <p>Interface Swagger embutida no frontend.</p>
    </header>

    <iframe
      class="swagger-frame"
      :src="docsUrl"
      title="Swagger UI"
    ></iframe>
  </section>
</template>

<script>
export default {
  name: "SwaggerPage",
  data() {
    return {
      docsUrl: "http://localhost:3000/docs"
    }
  }
}
</script>

<style scoped>
.swagger-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 32px;
  background: #0f172a;
  color: #f8fafc;
}

.swagger-header h1 {
  font-family: "Bebas Neue", sans-serif;
  font-size: 2.2rem;
  margin: 0 0 4px;
  letter-spacing: 1px;
}

.swagger-header p {
  margin: 0;
  font-family: "Poppins", sans-serif;
  color: #cbd5f5;
}

.swagger-frame {
  flex: 1;
  width: 100%;
  border: none;
  border-radius: 12px;
  background: #ffffff;
  min-height: 70vh;
}

@media (max-width: 768px) {
  .swagger-page {
    padding: 16px;
  }

  .swagger-frame {
    min-height: 60vh;
  }
}
</style>
