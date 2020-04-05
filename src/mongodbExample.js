// Criando os Esquemas
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

const model = mongoose.model('herois', heroiSchema)

async function main() {


    const listItens = await model.find()
    console.log('items', listItens)
}

main()