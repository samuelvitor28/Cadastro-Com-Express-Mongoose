const Dotenv = require("dotenv").config();
const Express = require("express");
const ExpressSession = require("express-session");
const Path = require("path");
const Cadastro = require("./mongoCollections/Cadastros/Cadastro");
const MainRouter = require("./apiRouter");
const MongoConect = require("./mongoConnect");
const port = process.env.PORT || 3000

async function start() {
    try {
        await MongoConect.connect();
        let app = Express();

        app.use(Express.json());
        app.use(ExpressSession({
            secret: process.env.SESSION_SECRET || "chave_muito_secreta",
            resave: false, // Não salva sessões que não tiveram mudanças
            saveUninitialized: false, // Não salva sessões que não foram inicializadas/vazias
            cookie: { maxAge: 60 * 60 * 1000 } // Sessão expira após 1 hora
        }))
        app.use(Express.static("public"))
        app.use("/api", MainRouter)

        app.get("/", async (req, res) => {
            /*let login = await Cadastro.findById(req.session.objectID, {senha: 0})
            let loginMessage = (login) ? `Você está autenticado como ${login.nome}!` : "Você não está autenticado."
            res.status(200).send(`<h1>Você está na página inicial!</h1>\n<h2>${loginMessage}</h2>`);*/
            res.status(200).sendFile(Path.join(__dirname, "/public/index.html"))
        })

        app.all("*all", (req, res) => {
            res.status(404).send("<h1>404 - Página não encontrada</h1>");
        })
        app.listen(port, () => {
            console.log(`Servidor iniciado no PORT ${port} em http://localhost:3000/`);
        });
    } catch (err) {
        console.log(`Não foi possível se conectar ao MongoDB\nErro: ${err}`);
    }
}

start();