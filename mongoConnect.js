const Mongoose = require("mongoose");
const options = {
    serverApi: { 
        version: '1', 
        strict: true, 
        deprecationErrors: true 
    }
};

async function connect() {
    await Mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/meu_banco_local", options);
    console.log("Conectado com sucesso ao MongoDB");
}

module.exports = {connect};