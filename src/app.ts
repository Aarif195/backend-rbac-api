import express from 'express';
import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);

export default app;