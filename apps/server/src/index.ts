import express from 'express';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();
const app = express();
const logger = pino();

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
