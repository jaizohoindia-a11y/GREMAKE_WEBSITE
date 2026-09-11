import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { pricingBookingRouter } from './routes/pricingBookings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '50kb' }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 60,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true, legacyHeaders: false,
});
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 5,
  message: { success: false, message: 'Too many form submissions. Please try again later.' },
  standardHeaders: true, legacyHeaders: false,
});

app.use(globalLimiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Gremake Enquiry API is running', timestamp: new Date().toISOString() });
});

app.use('/api/pricing-bookings', formLimiter, pricingBookingRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err.message);
  res.status(500).json({ success: false, message: 'An internal error occurred. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`Gremake Enquiry API running on port ${PORT}`);
});

export default app;
