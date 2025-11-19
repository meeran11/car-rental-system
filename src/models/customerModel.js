import pool from "../config/db.js";

export const createCustomerService = async ({ name, phone, driverLicense }) => {
    const result = await pool.query('INSERT INTO customers (customername, customerphone, driverlicense) VALUES ($1, $2, $3) RETURNING *', 
    [name, phone, driverLicense]);
    return result.rows[0];
}