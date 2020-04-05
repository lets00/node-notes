const BaseRoute = require('./base/baseRoute')
const joi = require('joi')

class HeroiRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    // payload -> body
                    // headers -> header
                    // params -> ID na url
                    // query -> ?skip10
                    query: {
                        skip: joi.number().integer().default(0),
                        limit: joi.number().integer().default(10),
                        nome: joi.string().min(3).max(100)
                    },
                    // Mostra qual foi o campo errado
                    failAction: (request, headers, erro) => {
                        throw erro
                    }
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query
                    const query = nome ? { nome } : {}
                    return this.db.read(query, skip, limit)
                } catch (error) {
                    console.log('DEU RUIM', error)
                    return "Erro interno no servidor"
                }
            }
        }
    }
}

module.exports = HeroiRoutes