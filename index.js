const Dotenv = require("dotenv").config();
const Express = require("express");
const MainRouter = require("./mainRouter");
let app = Express();

app.use(Express.json());

app.use("/api", MainRouter)

app.get("/", (req, res) => {
    res.status(200).send("<h1>Você está na página inicial!</h1>");
})
app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado no PORT ${process.env.PORT} em http://localhost:3000/`);
});