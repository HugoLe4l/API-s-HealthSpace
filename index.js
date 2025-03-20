import express from 'express';
import cors from 'cors';

import AuthRota from "./Auths.js"
import AnuncioRota from "./anuncio.js"

const app = express();
const PORT = 8081;

app.use(express.json());
const corsOptions = {
    origin: '*', // Permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permite o envio de cookies/tokens, se necessário
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
  
  app.use(cors(corsOptions)); // Aplica as configurações do CORS


app.use('/auth', AuthRota); // Rotas de autenticação
app.use('/anuncio', AnuncioRota); // Rotas de autenticação


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 