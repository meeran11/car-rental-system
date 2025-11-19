import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import pool from './config/db.js';
import errorHandling from './middlewares/errorHandler.js';
import createUserTable from './data/createUserTable.js';
import createStaffTable from './data/createStaffTable.js';
import createCustomerTable from './data/createCustomerTable.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());


//routes
app.use('/api', userRoutes);
app.use(errorHandling);

app.get('/', async(req, res) => {
    const result = await pool.query('SELECT current_database()');
  res.send(`Connected to database: ${result.rows[0].current_database}`);
});

// app.delete('/delete-users-table', async (req, res) => {
//   try {
//     await pool.query('DROP TABLE IF EXISTS users');
//     res.send('Users table deleted successfully.');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error deleting users table.');
//   }
// });

createUserTable();
createStaffTable();
createCustomerTable();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});