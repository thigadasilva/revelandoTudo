const swaggerJsdoc = require("swagger-jsdoc")

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "RevelandoTudo API",
    version: "1.0.0",
    description: "Documentacao da API do RevelandoTudo"
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local"
    }
  ],
  tags: [
    { name: "Auth", description: "Autenticacao e usuarios" },
    { name: "Demandas", description: "Gestao de demandas" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nome: { type: "string", example: "Maria Silva" },
          email: { type: "string", example: "maria@empresa.com" },
          senha: { type: "string", example: "hash" },
          role: { type: "string", enum: ["admin", "student"] },
          empresa: { type: "string", nullable: true, example: "Empresa X" },
          cnpj: { type: "string", nullable: true, example: "00.000.000/0001-00" },
          telefone: { type: "string", nullable: true, example: "+55 11 99999-9999" },
          codigoInstitucional: { type: "string", nullable: true, example: "INST-2026" },
          adminId: { type: "integer", nullable: true, example: 2 },
          statusAcesso: { type: "string", example: "aprovado" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Demanda: {
        type: "object",
        properties: {
          id: { type: "integer", example: 10 },
          titulo: { type: "string", example: "Criar landing page" },
          descricao: { type: "string", example: "Detalhes da demanda" },
          status: { type: "string", example: "Em analise" },
          dataAbertura: { type: "string", format: "date" },
          dataEsperada: { type: "string", format: "date", nullable: true },
          adminId: { type: "integer", example: 1 },
          userId: { type: "integer", example: 5 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      AtualizacaoDemanda: {
        type: "object",
        properties: {
          id: { type: "integer", example: 3 },
          mensagem: { type: "string", example: "Demanda criada com sucesso" },
          status: { type: "string", example: "Em analise" },
          demandaId: { type: "integer", example: 10 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      RegistrarRequest: {
        type: "object",
        required: ["nome", "email", "senha", "role"],
        properties: {
          nome: { type: "string", example: "Maria Silva" },
          email: { type: "string", example: "maria@empresa.com" },
          cargo: { type: "string", example: "Analista" },
          senha: { type: "string", example: "minhaSenhaSegura" },
          role: { type: "string", enum: ["admin", "student"] },
          empresa: { type: "string", nullable: true },
          cnpj: { type: "string", nullable: true },
          telefone: { type: "string", nullable: true },
          codigoInstitucional: { type: "string", nullable: true }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: { type: "string", example: "maria@empresa.com" },
          senha: { type: "string", example: "minhaSenhaSegura" }
        }
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJI..." },
          user: { $ref: "#/components/schemas/User" }
        }
      },
      DemandaCreateRequest: {
        type: "object",
        required: ["titulo", "descricao"],
        properties: {
          titulo: { type: "string", example: "Criar landing page" },
          descricao: { type: "string", example: "Detalhes da demanda" },
          dataEsperada: { type: "string", format: "date", nullable: true }
        }
      },
      DemandaUpdateRequest: {
        type: "object",
        properties: {
          titulo: { type: "string", example: "Atualizar landing page" },
          descricao: { type: "string", example: "Detalhes da demanda" },
          status: { type: "string", example: "Em andamento" },
          dataEsperada: { type: "string", format: "date", nullable: true },
          mensagem: { type: "string", example: "Atualizacao solicitada" }
        }
      },
      StatusUpdateRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", example: "Em andamento" },
          mensagem: { type: "string", example: "Status atualizado" }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
          erro: { type: "string" },
          message: { type: "string" },
          detalhes: { type: "string" }
        }
      }
    }
  },
  paths: {
    "/auth/registrar": {
      post: {
        tags: ["Auth"],
        summary: "Registrar usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegistrarRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Usuario criado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          "400": { description: "Dados invalidos" },
          "500": { description: "Erro interno" }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Login realizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" }
              }
            }
          },
          "401": { description: "Credenciais invalidas" },
          "403": { description: "Acesso pendente ou recusado" },
          "500": { description: "Erro interno" }
        }
      }
    },
    "/auth/pendentes": {
      get: {
        tags: ["Auth"],
        summary: "Listar usuarios pendentes",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de pendentes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" }
                }
              }
            }
          },
          "401": { description: "Nao autorizado" },
          "500": { description: "Erro interno" }
        }
      }
    },
    "/auth/aprovar/{id}": {
      put: {
        tags: ["Auth"],
        summary: "Aprovar usuario",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": {
            description: "Usuario aprovado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { message: { type: "string" } }
                }
              }
            }
          },
          "404": { description: "Nao encontrado" },
          "500": { description: "Erro interno" }
        }
      }
    },
    "/demandas": {
      get: {
        tags: ["Demandas"],
        summary: "Listar demandas",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de demandas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Demanda" }
                }
              }
            }
          },
          "401": { description: "Nao autorizado" },
          "500": { description: "Erro interno" }
        }
      },
      post: {
        tags: ["Demandas"],
        summary: "Criar demanda",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DemandaCreateRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Demanda criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Demanda" }
              }
            }
          },
          "400": { description: "Dados invalidos" },
          "401": { description: "Nao autorizado" },
          "500": { description: "Erro interno" }
        }
      }
    },
    "/demandas/{id}": {
      put: {
        tags: ["Demandas"],
        summary: "Atualizar demanda",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DemandaUpdateRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Demanda atualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Demanda" }
              }
            }
          },
          "404": { description: "Nao encontrada" },
          "500": { description: "Erro interno" }
        }
      }
    },
    "/demandas/{id}/status": {
      put: {
        tags: ["Demandas"],
        summary: "Atualizar status da demanda",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StatusUpdateRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Status atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Demanda" }
              }
            }
          },
          "404": { description: "Nao encontrada" },
          "500": { description: "Erro interno" }
        }
      }
    },
    "/demandas/{id}/atualizacoes": {
      get: {
        tags: ["Demandas"],
        summary: "Listar atualizacoes da demanda",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": {
            description: "Lista de atualizacoes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AtualizacaoDemanda" }
                }
              }
            }
          },
          "500": { description: "Erro interno" }
        }
      }
    },
    "/demandas/{id}/aprovar": {
      put: {
        tags: ["Demandas"],
        summary: "Aprovar demanda",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": {
            description: "Demanda aprovada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Demanda" }
              }
            }
          },
          "404": { description: "Nao encontrada" },
          "500": { description: "Erro interno" }
        }
      }
    },
    "/demandas/{id}/recusar": {
      put: {
        tags: ["Demandas"],
        summary: "Recusar demanda",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          "200": {
            description: "Demanda recusada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    mensagem: { type: "string" },
                    demanda: { $ref: "#/components/schemas/Demanda" }
                  }
                }
              }
            }
          },
          "404": { description: "Nao encontrada" },
          "500": { description: "Erro interno" }
        }
      }
    }
  }
}

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: []
})

module.exports = swaggerSpec
