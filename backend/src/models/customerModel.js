import pool from '../config/db.js';

export const updateCustomerInfoService = async (userId, fields) => {
  const allowed = ['customerName', 'customerPhone', 'driverLicense'];
  const inputKeys = Object.keys(fields)
    .filter(k => allowed.includes(k) && fields[k] !== undefined);

  if (inputKeys.length === 0) {
    const res = await pool.query(
      'SELECT customerId, userId, customerName, customerPhone, driverLicense, created_at, updated_at FROM customers WHERE userId = $1',
      [userId]
    );
    if (res.rows.length === 0) throw new Error('Customer not found');
    return res.rows[0];
  }

  // Validate phone if updating
  if (inputKeys.includes('customerPhone') && !/^[0-9]{11}$/.test(fields.customerPhone)) {
    throw new Error('Phone must be exactly 11 digits');
  }

  // Validate driverLicense if updating
  if (inputKeys.includes('driverLicense') && fields.driverLicense && fields.driverLicense.length > 20) {
    throw new Error('Driver license must be max 20 characters');
  }

  const setString = inputKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = inputKeys.map(k => fields[k]);
  values.push(userId);

  const query = `
    UPDATE customers
    SET ${setString}, updated_at = NOW()
    WHERE userId = $${values.length}
    RETURNING customerId, userId, customerName, customerPhone, driverLicense, created_at, updated_at
  `;

  const result = await pool.query(query, values);

  if (result.rows.length === 0) throw new Error('Customer not found');
  return result.rows[0];
};

export const getCustomerByUserIdService = async (userId) => {
  const result = await pool.query(
    'SELECT customerId, userId, customerName, customerPhone, driverLicense, created_at, updated_at FROM customers WHERE userId = $1',
    [userId]
  );
  return result.rows[0];
};
