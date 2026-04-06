const express = require('express');
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '021979',
    database: 'tickets'
});

db.connect(err => {
    if (err) {
        console.error(err);
    } else {
        console.log("Conectado ao MySQL");
    }
});

app.post('/senha', (req, res) => {
    const { tipo } = req.body;

    const codigo = gerarCodigo(tipo);

    const sql = "INSERT INTO senhas (codigo, tipo, data_emissao, status) VALUES (?, ?, NOW(), 'AGUARDANDO')";

    db.query(sql, [codigo, tipo], (err, result) => {
        if (err) return res.send(err);

        res.send({ codigo });
    });
});

function gerarCodigo(tipo) {
    const hoje = new Date();

    const yy = String(hoje.getFullYear()).slice(2);
    const mm = String(hoje.getMonth() + 1).padStart(2, '0');
    const dd = String(hoje.getDate()).padStart(2, '0');

    const seq = Math.floor(Math.random() * 999)
        .toString()
        .padStart(3, '0');

    return `${yy}${mm}${dd}-${tipo}-${seq}`;
}