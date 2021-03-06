const assert = require('assert')
const api = require('./../api')

let app;
const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0cmluZyIsImlhdCI6MTU4NjIwNjMzNn0.M96u-a6bhmIeE5hGrBbzxUvhM7LrLydXDS7c3_yJYtE"

const headers = {
    Authorization: MOCK_TOKEN
}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin',
    poder: 'Marreta'
}

const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'Mira'
}

let MOCK_ID

describe('Suíte de teste da API Herois',
    function() {
        this.beforeAll(async() => {
            app = await api
            await app.inject({
                method: 'POST',
                url: '/herois',
                headers,
                payload: JSON.stringify(MOCK_HEROI_INICIAL)
            })
            const result = await app.inject({
                method: 'GET',
                headers,
                url: `/herois?limit=1&nome=${MOCK_HEROI_INICIAL.nome}`
            })
            MOCK_ID = JSON.parse(result.payload)[0]._id
        })

        it('listar /herois', async() => {
            const result = await app.inject({
                method: 'GET',
                url: '/herois',
                headers
            })

            const dados = JSON.parse(result.payload)
            const statusCode = result.statusCode
            assert.deepEqual(statusCode, 200)
                // Ideal um assert por it()
            assert.ok(Array.isArray(dados))
        })

        it('listar /herois - deve retornar somente 3', async() => {
            const TAMANHO_LIMITE = 3
            const result = await app.inject({
                method: 'GET',
                url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
                headers
            })

            const dados = JSON.parse(result.payload)
            assert.deepEqual(result.statusCode, 200)
            assert.ok(dados.length === TAMANHO_LIMITE)
        })

        it('listar /herois - erro 400', async() => {
            const TAMANHO_LIMITE = "QualquerCoisaDiferenteDeNumber"
            const result = await app.inject({
                method: 'GET',
                url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
                headers
            })

            const dados = JSON.parse(result.payload)
            assert.deepEqual(result.statusCode, 400)
        })

        it('cadastrar POST /herois', async() => {
            const result = await app.inject({
                method: 'POST',
                url: '/herois',
                payload: MOCK_HEROI_CADASTRAR,
                headers
            })
            assert.ok(result.statusCode === 201)
        })

        it('atualizar PATCH /herois/:id', async() => {
            const dado = { poder: 'Super mira' }
            const result = await app.inject({
                method: 'PATCH',
                url: `/herois/${MOCK_ID}`,
                payload: dado,
                headers
            })
            assert.ok(result.statusCode === 200)
        })

        it('remover DELETE /herois/:id', async() => {
            const result = await app.inject({
                method: 'DELETE',
                url: `/herois/${MOCK_ID}`,
                headers
            })
            assert.ok(result.statusCode === 200)
        })
    })