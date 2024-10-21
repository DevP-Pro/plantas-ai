import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';  // A importação correta de cors
import floorplanRoutes from './routes/floorplan';

const app = express();
const port = process.env.PORT || 3333;

app.use(bodyParser.json());

// Habilitar CORS
app.use(cors({
  origin: 'http://localhost:4200',  // Permite requisições do frontend rodando no localhost:4200
}));

// Rota para geração de plantas baixas
app.use('/api/floorplan', floorplanRoutes);

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
