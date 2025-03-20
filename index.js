import express from 'express';
import cors from 'cors';

import AuthRota from "./Auths.js"
import AnuncioRota from "./anuncio.js"

const app = express();
const PORT = 8081;

app.use(express.json());
app.use(cors());


app.use('/auth', AuthRota); // Rotas de autenticação
app.use('/anuncio', AnuncioRota); // Rotas de autenticação


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});