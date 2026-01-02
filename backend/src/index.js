import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import carRoutes from './routes/carRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import rentalRoutes from './routes/rentalRoutes.js';

import pool from './config/db.js';
import errorHandling from './middlewares/errorHandler.js';

// Table creation scripts
import createUserTable from './data/createUserTable.js';
import createStaffTable from './data/createStaffTable.js';
import createCustomerTable from './data/createCustomerTable.js';
import createMaintenanceTable from './data/createMaintenanceTable.js';
import createCarsTable from './data/createCarsTable.js';
import createPaymentTable from './data/createPaymentTable.js';
import createRentalsTable from './data/createRentalsTable.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/user', userRoutes);
app.use('/api/car', carRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/rental', rentalRoutes);
// Root test route
app.get('/', async (req, res) => {
  const result = await pool.query('SELECT current_database()');
  res.send(`Connected to database: ${result.rows[0].current_database}`);
});

// Error handler
app.use(errorHandling);

const start = async () => {
  try {
    console.log('⏳ Creating tables...');

    // Create tables in dependency order
    await createUserTable();
    await createStaffTable();
    await createCustomerTable();
    await createMaintenanceTable();
    await createCarsTable();
    await createPaymentTable();
    await createRentalsTable();

    console.log('✅ All tables created successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to initialize DB tables:', err);
    process.exit(1);
  }
};

start();

export default app;