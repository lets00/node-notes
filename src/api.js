const Hapi = require('hapi')
const Context = require('./db/strategies/base/contextStrategy')
const HeroiSchema = require('./db/strategies/mongodb/schemas/herois')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const HeroiRoute = require('./routes/heroi')

const app = new Hapi.Server({
    port: 8000
})


function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroiSchema))
    app.route(mapRoutes(new HeroiRoute(context), HeroiRoute.methods()))

    return app
}

module.exports = main()

// main()