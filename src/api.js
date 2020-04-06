const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/herois')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroiRoute = require('./routes/heroi')
const joi = require('@hapi/joi')

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

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
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.validator(joi)
    app.route(mapRoutes(new HeroiRoute(context), HeroiRoute.methods()))
    app.start()
        // return app
}

// module.exports = main()
main()