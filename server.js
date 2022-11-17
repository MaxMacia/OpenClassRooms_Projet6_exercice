const http = require("http");

const server = http.createServer((req, res) => {
    res.end("Voilà la nouvelle réponse du serveur!!")
});

server.listen(process.env.POR || 3000);