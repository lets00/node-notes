const BaseRoute = require('./base/baseRoute')
const joi = require('@hapi/joi')

const jwt = require('jsonwebtoken')

class AuthRoutes extends BaseRoute {

    constructor(secret) {
        super()
        this.secret = secret
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            options: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'faz login com user e senha no banco',
                validate: {
                    payload: joi.object({
                        username: joi.string().required(),
                        password: joi.string().required()
                    })
                }
            },
            handler: (req, h) => {
                const { username, password } = req.payload
                const token = jwt.sign({ username }, this.secret)
                return h.response({ token }).code(200)

                // return { token }
            }
        }
    }
}

module.exports = AuthRoutes