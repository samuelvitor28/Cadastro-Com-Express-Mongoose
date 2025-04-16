const Dotenv = require("dotenv").config();
const Express = require("express");
const MainRouter = require("./mainRouter");
const MongoConect = require("./mongoConnect");

async function start() {
    try {
        await MongoConect.connect();
        let app = Express();

        app.use(Express.json());
        app.use("/api", MainRouter)

        app.get("/", (req, res) => {
            res.status(200).send("<h1>Você está na página inicial!</h1>");
        })
        app.listen(process.env.PORT, () => {
            console.log(`Servidor iniciado no PORT ${process.env.PORT} em http://localhost:3000/`);
        });
    } catch (err) {
        console.log(`Não foi possível se conectar ao MongoDB\nErro: ${err}`);
    }
}

start();