const assert = require('assert')
const MongoDB = require('./../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/herois')
const Context = require('./../db/strategies/base/contextStrategy')

let context;
let MOCK_HEROI_ID = ''

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Pernalonga'
}

describe('MongoDB tests', function() {
    this.beforeAll(async() => {
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroiSchema))
    })

    it('verificar conexão', async() => {
        const result = await context.isConnected()
        const expected = 1
        assert.equal(result, expected)
    })

    it('cadastrando herói', async() => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('listar heróis', async() => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        const result = { nome, poder }
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('atualizar herói', async() => {
        const [{ id }] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        MOCK_HEROI_ID = id
        const result = await context.update(MOCK_HEROI_ID, { nome: 'Pernalonga' })
        assert.deepEqual(result.nModified, 1)
    })

    // Em produção, não usar o método DELETE, controlar os dados ativos/inativos(excluídos)
    // através de uma variável de controle
    it('remover herói', async() => {
        const result = await context.delete(MOCK_HEROI_ID)
        assert.deepEqual(result.deletedCount, 1)
    })

})