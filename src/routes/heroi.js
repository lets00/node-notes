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

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    failAction: (req, res, fail) => {
                        throw fail
                    },
                    payload: {
                        nome: joi.string().required(),
                        poder: joi.string().required()
                    }
                }
            },
            handler: async(request, h) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder })
                    return h.response().code(201)
                } catch (error) {
                    console.log('DEU RUIM', error)
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction: (req, res, err) => {
                        throw err
                    },
                    params: {
                        id: joi.string().required()
                    },
                    payload: {
                        nome: joi.string(),
                        poder: joi.string()
                    }
                }
            },
            handler: async(request, h) => {
                // return h.response().code(200)
                try {
                    const { id } = request.params
                    const { payload } = request
                    const dados = JSON.parse(JSON.stringify(payload))
                    const result = await this.db.update(id, dados)
                    if (result.nModified !== 1 && result.n !== 1) return h.response().code(404)
                    return h.response().code(200)
                } catch (error) {
                    return "ERRO interno"
                }
            }
        }
    }
}

module.exports = HeroiRoutes