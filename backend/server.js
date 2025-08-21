import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { db, run, get, all, initDbIfNeeded } from './src/db.js';
import authRouter from './src/routes/auth.js';
import loansRouter from './src/routes/loans.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// routes
app.use('/auth', authRouter);
app.use('/loans', loansRouter);

// start server after DB initialization
const PORT = process.env.PORT || 4000;
initDbIfNeeded().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
