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

function authLock(req, res, next)  { // Middleware que não permite que o usuário acesse a rota caso não esteja autenticado
    if (!req.session.objectID) {
        return res.status(401).json({"success": false, "message": "Sem autorização."})
    }
    next();
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

router.post("/", async (req, res) => { // Quando alguem registrar
    try {
        let result = await Cadastro.insertOne(req.body);
        req.session.objectID = result._id
        res.status(200).json({ "success": true, "result": result })
    } catch (err) {
        res.status(400).json({ "success": false, "message": uniqueErrorHandler(err) || validationErrorHandler(err) || err })
    }
})

router.post("/login", async (req, res) => { // Quando alguem fazer login
    try {
        if (!req.body || (!req.body.nome && !req.body.email) || !req.body.senha)
            return res.status(400).json({"success": false, "message": "Os campos 'nome' e 'senha' são obrigatórios."});

        let result = await Cadastro.find(req.body);
        if (result.length == 0)
            return res.status(400).json({"success": false, "message": "Credenciais inválidas."});

        req.session.objectID = result[0]._id;
        res.status(200).json({"success": true, "result": "Login bem sucedido."});
    } catch (err) {
        res.status(400).json({"success": false, "message": err.message});
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

router.put("/:nome", authLock, async (req, res) => {
    try {
        let login = await Cadastro.findById(req.session.objectID);
        if (!login || login.nome.toLowerCase() != req.params.nome.toLowerCase()) // Permite apenas o propietário da conta alterar ela
            return res.status(400).json({"success": false, "message": "Sem autorização."});

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
