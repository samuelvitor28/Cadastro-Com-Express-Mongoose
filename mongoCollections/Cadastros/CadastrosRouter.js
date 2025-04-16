const Express = require("express")
const Cadastro = require("./Cadastro")

let router = Express.Router();

// Gerencia os erros de UNQIUE
function uniqueErrorHandler(err) {
    if (err.code == 11000) {
        if (err.keyPattern?.nome)
            return "O nome já está em uso."
        else if (err.keyPattern?.email)
            return "O email já está em uso."
    }
}

// Gerencia erros de validação, retorna as mensagens do erro mapeadas para uma array
function validationErrorHandler(err) {
    if (err.name == "ValidationError")
        return Object.values(err.errors).map(e => e.message)
}

router.get("/", async (req, res) => {
    let result = await Cadastro.find({}, { email: 0, senha: 0, __v: 0 })
    res.status(200).json({ "success": true, "result": result })
})

router.get("/:nome", async (req, res) => {
    let result = await Cadastro.find({nome: req.params.nome}, {email: 0, senha: 0, __v: 0});
    if (result.length == 0)
        return res.status(400).json({"success": false, "message": "Cadastro não encontrado."});

    res.status(200).json({"success": true, "result": result});
})

router.post("/", async (req, res) => {
    try {
        let result = await Cadastro.insertOne(req.body);
        res.status(200).json({ "success": true, "result": result })
    } catch (err) {
        res.status(400).json({ "success": false, "message": uniqueErrorHandler(err) || validationErrorHandler(err) || err })
    }
})

router.delete("/", async (req, res) => {
    try {
        if (!req.body || !req.body.nome || !req.body.senha)
            return res.status(400).json({ "success": false, "message": "Campos 'nome' e 'senha' são obrigatórios" })

        let result = await Cadastro.deleteOne(req.body);
        if (result.deletedCount == 0) // Não removeu nada
            return res.status(400).json({"success": false, "message": "Cadastro não encontrado."})
        
        res.status(200).json({ "success": true, "result": "Cadastro removido com sucesso." })
    } catch (err) {
        res.status(400).json({ "success": false, "message": err.message })
    }
})

router.put("/", (req, res) => {
    return res.status(400).json({"success": false, "message": "Parametro 'nome' é obrigatório. (Ex /cadastros/nomeAqui)"})
})

router.put("/:nome", async (req, res) => {
    try {
        let result = await Cadastro.updateOne({nome: req.params.nome}, req.body, {runValidators: true})
        
        if (!result.acknowledged)
            return res.status(400).json({"success": false, "message": "Campos incorretos, verifique o nome dos campos."})
        else if (result.matchedCount == 0)
            return res.status(400).json({"success": false, "message": "Cadastro não encontrado."})

        res.status(200).json({"success": true, "result": "Cadastro atualizado com sucesso."})
    } catch (err) {
        res.status(400).json({"success": false, "message": uniqueErrorHandler(err) || validationErrorHandler(err) || err})
    }
})
module.exports = router;