const Mongoose = require("mongoose");

const Cadastro = new Mongoose.Schema({
    nome: {
        type: String,
        unique: true,
        required: [true, "O campo 'nome' é obrigatório."],
        minLength: [3, "O nome deve ter no mínimo 3 caracteres."],
        maxLength: [25, "O nome não pode ter mais que 25 caracteres."]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "O campo 'email' é obrigatório."],
        lowercase: true,
        maxLength: [255, "O email não pode ter mais que 255 caracteres"]
    },
    senha: {
        type: String,
        required: true,
        minLength: [10, "A senha deve ter no mínimo 10 caracteres."],
        maxLength: [255, "A senha não pode ter mais que 255 caracteres."]
    },
    descricao: {
        type: String,
        maxLength: [100, "A descrição não pode ter mais que 100 caracteres."]
    },
    imageURL: {
        type: String,
        maxLength: [30, "ImageURL não pode ter mais que 30 caracteres."]
    }
})

module.exports = Mongoose.model("Cadastro", Cadastro);