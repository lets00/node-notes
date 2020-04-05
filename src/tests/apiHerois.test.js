const assert = require('assert')
const api = require('./../api')


let app;
describe('Suíte de teste da API Herois',
    function() {
        this.beforeAll(async() => {
            app = await api
        })

        it('listar /herois', async() => {
            const result = await app.inject({
                method: 'GET',
                url: '/herois'
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
                url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
            })

            const dados = JSON.parse(result.payload)
            assert.deepEqual(result.statusCode, 200)
            assert.ok(dados.length === TAMANHO_LIMITE)
        })

        it('listar /herois - erro 400', async() => {
            const TAMANHO_LIMITE = "QualquerCoisaDiferenteDeNumber"
            const result = await app.inject({
                method: 'GET',
                url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
            })

            const dados = JSON.parse(result.payload)
            console.log(dados.length)
            assert.deepEqual(result.statusCode, 400)
        })
    })