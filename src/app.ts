import express from 'express';
import { pool } from './db';
import { authenticateRequest } from './middlewares/authenticate_request';
import { errorHandler } from './middlewares/error_handler';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';


// TODO: Temporary implementation to bypass SSL certificate verification for the OPAC server
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();

app.use(express.json());

app.use(authenticateRequest);

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);

app.use(errorHandler);


(async () => {
  try {
    await pool.connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
})();
export default app;