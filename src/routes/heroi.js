const BaseRoute = require('./base/baseRoute')
const joi = require('@hapi/joi')

const headers = joi.object({
    authorization: joi.string().required()
}).unknown()

class HeroiRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            options: {
                tags: ['api'],
                description: 'Lista herois',
                notes: 'Pagina resultado por nome',
                validate: {
                    headers,
                    // payload -> body
                    // headers -> header
                    // params -> ID na url
                    // query -> ?skip10
                    query: joi.object({
                        skip: joi.number().integer().default(0),
                        limit: joi.number().integer().default(10),
                        nome: joi.string().min(3).max(100)
                    }),
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
                    return "Erro interno no servidor"
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            options: {
                tags: ['api'],
                description: 'Cadastrar herois',
                notes: 'Cadastra heroi por nome e poder',
                validate: {
                    failAction: (req, res, fail) => {
                        throw fail
                    },
                    headers,
                    payload: joi.object({
                        nome: joi.string().required(),
                        poder: joi.string().required()
                    })
                }
            },
            handler: async(request, h) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder })
                    return h.response().code(201)
                } catch (error) {
                    return "Erro"
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            options: {
                tags: ['api'],
                description: 'Atualiza herois',
                notes: 'Atualiza nome e/ou poder do herói. Necessita ID do herói',
                validate: {
                    failAction: (req, res, err) => {
                        throw err
                    },
                    params: joi.object({
                        id: joi.string().required()
                    }),
                    payload: joi.object({
                        nome: joi.string(),
                        poder: joi.string()
                    })
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

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            options: {
                tags: ['api'],
                description: 'Deleta herois',
                notes: 'Remove herói por ID.',
                validate: {
                    headers,
                    params: {
                        id: joi.string().required()
                    }
                }
            },
            handler: async(res, h) => {
                try {
                    const { id } = res.params
                    const resultado = await this.db.delete(id)
                    if (resultado.ok !== 1) return h.response().code(404)
                    return h.response().code(200)
                } catch (error) {
                    console.error('DEU RUIM', error)
                }

            }
        }
    }
}

module.exports = HeroiRoutes