const Mongoose = require("mongoose");

const Cadastro = new Mongoose.Schema({
    nome: {
        type: String,
        unique: true,
        required: true,
        minLength: 10
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = Mongoose.model("Cadastro", Cadastro);