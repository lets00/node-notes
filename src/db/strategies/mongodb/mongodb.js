const ICrud = require('./../interfaces/interfaceCrud')
const mongoose = require('mongoose')

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._schema = schema
        this._connection = connection
    }

    async isConnected() {
        // Esperar 1 segundo pra garantir a conectividade
        if (this._connection.readyState == 2) await new Promise(resolve => setTimeout(resolve, 1000))
        return this._connection.readyState
    }

    static connect() {
        mongoose.connect('mongodb://localhost:27017/nodejs-test', { useNewUrlParser: true, useUnifiedTopology: true },
            (error) => {
                if (!error) return;
                console.log('Falha na conexão!', error)
            })
        return mongoose.connection
    }

    create(item) {
        return this._schema.create(item)
    }

    read(item, skip = 0, limit = 10) {
        return this._schema.find(item).skip(skip).limit(limit)
    }

    update(id, item) {
        return this._schema.updateOne({ _id: id }, { $set: item })
    }

    delete(id) {
        return this._schema.deleteOne({ _id: id })
    }

}

module.exports = MongoDB