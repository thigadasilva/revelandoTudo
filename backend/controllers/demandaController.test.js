const { createDemanda, updateStatus } = require('./demandasController')

const { Demanda, AtualizacaoDemanda } = require('../models')

jest.mock('../models', () => ({
  Demanda: {
    create: jest.fn(),
    findOne: jest.fn()
  },

  AtualizacaoDemanda: {
    create: jest.fn()
  }
}))
 describe('createDemanda', () => {

   test('deve criar uma demanda com sucesso', async () => {

    const req = {
      body: {
        titulo: 'Teste',
        descricao: 'Descrição teste'
      },

      usuario: {
        id: 1,
        role: 'admin'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    Demanda.create.mockResolvedValue({
      id: 1,
      titulo: 'Teste'
    })

    await createDemanda(req, res)

    expect(Demanda.create).toHaveBeenCalled()

    expect(AtualizacaoDemanda.create).toHaveBeenCalled()

    expect(res.status).toHaveBeenCalledWith(201)
  })

})

/*
 test('deve retornar 400 se titulo ou descricao não forem enviados', async () => {

  const req = {
    body: {
      titulo: '',
      descricao: ''
    },

    usuario: {
      id: 1,
      role: 'admin'
    }
  }

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  }

  await createDemanda(req, res)

  expect(res.status).toHaveBeenCalledWith(400)

  expect(res.json).toHaveBeenCalledWith({
    erro: 'Título e descrição são obrigatórios.'
  })

})


test('deve atualizar o status da demanda', async () => {

  const demandaMock = {
    id: 1,
    status: 'Em análise',
    save: jest.fn()
  }

  Demanda.findOne.mockResolvedValue(demandaMock)

  const req = {
    params: {
      id: 1
    },

    body: {
      status: 'Concluída'
    },

    usuario: {
      id: 1,
      role: 'admin'
    }
  }

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  }

  await updateStatus(req, res)

  expect(Demanda.findOne).toHaveBeenCalled()

  expect(demandaMock.status).toBe('Concluída')

  expect(demandaMock.save).toHaveBeenCalled()

  expect(AtualizacaoDemanda.create).toHaveBeenCalled()

  expect(res.json).toHaveBeenCalled()

}) */