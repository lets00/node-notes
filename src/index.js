const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const Postgres = require('./db/strategies/postgres')

const mongo = new ContextStrategy(new MongoDB())
mongo.create()

const postgres = new ContextStrategy(new Postgres())
postgres.create()