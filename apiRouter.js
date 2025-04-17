const Express = require("express");
const Cadastro = require("./mongoCollections/Cadastros/Cadastro");
const CadastroRouter = require("./mongoCollections/Cadastros/CadastrosRouter");

let router = Express.Router();
router.use("/Cadastros", CadastroRouter)

router.get("/", (req, res) => {
    res.status(200).json({message: "API funcionando corretamente!"});
})

router.get("/auth", async (req, res) => {
    if (!req.session.objectID)
        return res.status(200).json(null);

    let result = await Cadastro.findById(req.session.objectID);
    res.status(200).json(result);
})

router.post("/auth/logout", async (req, res) => {
    if (!req.session.objectID)
        return res.status(400).json({"success": false, "message": "Não autenticado."});

    req.session.destroy();
    res.status(200).json({"success": true});
})

module.exports = router;