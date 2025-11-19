import pool from '../config/db.js';
import bcrypt from "bcrypt";
export const createUserService = async ({ username, password, role }) => {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *', 
    [username, hashedPassword, role]);
    return result.rows[0];
}
export const getAllUsersService = async () => {
    const result = await pool.query('SELECT * FROM users')
    return result.rows;
}

export const getUserByIdService = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1'   , [id]);
    return result.rows[0];
}
export const updateUserService = async (id, name, email) => {
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [name, email, id]);
    return result.rows[0];
}
export const deleteUserService = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
}