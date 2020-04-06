const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/herois')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroiRoute = require('./routes/heroi')
const AuthRoute = require('./routes/auth')

const joi = require('@hapi/joi')
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const HapiJWT = require('hapi-auth-jwt2')

const JWT_SECRET = 'SENHA_SECRETA'


const app = new Hapi.Server({
    host: 'localhost',
    port: 8000
})


function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroiSchema))

    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: 'v1.0',
        },
    };

    await app.register([
        HapiJWT,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.validator(joi)
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // }
        validate: (dado, req) => {
            //verifica no DB se o usuario esta ativo
            return { isValid: true }
        }
    })

    app.auth.default('jwt')

    app.route([
            ...mapRoutes(new HeroiRoute(context), HeroiRoute.methods()),
            ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
        ])
        // app.start()
    return app
}

module.exports = main()
    // main()