const mongoose = require('mongoose')

const heroiSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    inseridoEm: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('herois', heroiSchema)