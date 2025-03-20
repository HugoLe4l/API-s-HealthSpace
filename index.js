import express from 'express';
import cors from 'cors';

import AuthRota from "./Auths.js"
import AnuncioRota from "./anuncio.js"

const app = express();
const PORT = 8081;

app.use(express.json());
// Configuração do CORS
const corsOptions = {
    origin: '*', // Permite que a origem local se conecte
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Permite esses métodos
    allowedHeaders: ['Content-Type', 'Authorization'], // Permite esses headers
    preflightContinue: false,
    optionsSuccessStatus: 204 // Status para a resposta de preflight
  };
  
  app.use(cors(corsOptions)); // Aplica as configurações do CORS


app.use('/auth', AuthRota); // Rotas de autenticação
app.use('/anuncio', AnuncioRota); // Rotas de autenticação


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 