import express from 'express';
import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import conversationRoutes from './routes/conversation.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/conversations', conversationRoutes);
app.use('/api/v1/admin', adminRoutes);


export default app;