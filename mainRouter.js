const Express = require("express");

let router = Express.Router();

router.get("/", (req, res) => {
    res.status(200).json({message: "API funcionando corretamente!"});
})

module.exports = router;