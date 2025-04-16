const Express = require("express");
const CadastroRouter = require("./mongoCollections/Cadastros/CadastrosRouter");

let router = Express.Router();
router.use("/Cadastros", CadastroRouter)

router.get("/", (req, res) => {
    res.status(200).json({message: "API funcionando corretamente!"});
})

module.exports = router;