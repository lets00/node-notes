const assert = require('assert')
const api = require('../api')

let app = {}
describe('Suíte de teste de autenticação', function() {
    this.beforeAll(async() => {
        app = await api
    })

    it('deve obter um token', async() => {
        const result = await app.inject({
                method: 'POST',
                url: '/login',
                payload: {
                    username: 'test',
                    password: '123'
                }
            })
            // console.log(result)
        const statusCode = result.statusCode
        const dadoos = JSON.parse(result.payload)
        assert.deepEqual(statusCode, 200)
    })
})