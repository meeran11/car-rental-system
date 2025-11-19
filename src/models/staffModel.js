import pool from '../config/db.js';
export const createStaffService = async ({ staffname, staffphone }) => {
    const result = await pool.query('INSERT INTO staff (staffname, staffphone) VALUES ($1, $2) RETURNING *', 
    [staffname, staffphone]);
    return result.rows[0];
}