import pool from '../config/db.js';

export const updateStaffInfoService = async (userId, fields) => {
  const allowed = ['staffName', 'staffPhone'];
  const inputKeys = Object.keys(fields)
    .filter(k => allowed.includes(k) && fields[k] !== undefined);

  if (inputKeys.length === 0) {
    const res = await pool.query(
      'SELECT staffId, userId, staffName, staffPhone, created_at, updated_at FROM staff WHERE userId = $1',
      [userId]
    );
    if (res.rows.length === 0) throw new Error('Staff not found');
    return res.rows[0];
  }

  // Validate phone if updating
  if (inputKeys.includes('staffPhone') && !/^[0-9]{11}$/.test(fields.staffPhone)) {
    throw new Error('Phone must be exactly 11 digits');
  }

  const setString = inputKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = inputKeys.map(k => fields[k]);
  values.push(userId);

  const query = `
    UPDATE staff
    SET ${setString}, updated_at = NOW()
    WHERE userId = $${values.length}
    RETURNING staffId, userId, staffName, staffPhone, created_at, updated_at
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) throw new Error('Staff not found');
  return result.rows[0];
};

export const getStaffByUserIdService = async (userId) => {
  const result = await pool.query(
    'SELECT staffId, userId, staffName, staffPhone, created_at, updated_at FROM staff WHERE userId = $1',
    [userId]
  );
  return result.rows[0];
};
