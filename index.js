import express from 'express';
import cors from 'cors';

import AuthRota from "./Auths.js"
import AnuncioRota from "./anuncio.js"

const app = express();
const PORT = 8081;

app.use(express.json());
const corsOptions = {
  origin: ['http://localhost:5173', 'https://api-s-health-space.vercel.app'], // Permite a origem do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Para enviar cookies/tokens, se necessário
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions)); // Aplica as configurações de CORS

app.use('/auth', AuthRota); // Rotas de autenticação
app.use('/anuncio', AnuncioRota); // Rotas de autenticação


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 
