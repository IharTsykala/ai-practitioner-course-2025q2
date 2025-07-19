import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import qaRoutes from './routes/qa.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../docs/swagger.js';

config();

const app = express();
const PORT = process.env.PORT || 8002;

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/ask', qaRoutes);

app.get('/', (req, res) => {
	res.send('RAG API is running');
});

app.listen(PORT, () => {
	console.log(`✅ Server is running at http://localhost:${PORT}`);
});
