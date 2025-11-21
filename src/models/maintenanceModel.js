import pool from '../config/db.js';

export const getAllMaintenance = async () => {
  const result = await pool.query('SELECT * FROM maintenance');
  return result.rows;
};

export const getMaintenanceById = async (id) => {
  const result = await pool.query('SELECT * FROM maintenance WHERE maintenanceId = $1', [id]);
  return result.rows[0];
};

export const createMaintenanceWithCarLink = async (carId, { maintenanceDate, maintenanceType, maintenanceCost }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertResult = await client.query(
      `INSERT INTO maintenance (maintenanceDate, maintenanceType, maintenanceCost)
       VALUES ($1, $2, $3)
       RETURNING maintenanceId`,
      [maintenanceDate, maintenanceType, maintenanceCost]
    );

    const maintenanceid = insertResult.rows[0].maintenanceId;

    await client.query(
      `UPDATE cars SET maintenanceId = $1 WHERE carId = $2`,
      [maintenanceid, carId]
    );

    await client.query('COMMIT');
    return { maintenanceid };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateMaintenanceWithCarCheck = async (maintenanceId, { maintenanceDate, maintenanceType, maintenanceCost }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE maintenance
       SET maintenanceDate = $1, maintenanceType = $2, maintenanceCost = $3
       WHERE maintenanceId = $4
       RETURNING *`,
      [maintenanceDate, maintenanceType, maintenanceCost, maintenanceId]
    );

    const carCheck = await client.query(
      `SELECT carId FROM cars WHERE maintenanceId = $1`,
      [maintenanceId]
    );

    await client.query('COMMIT');
    return {
      updated: updateResult.rows[0],
      linkedCar: carCheck.rows[0] || null
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteMaintenanceAndUnlinkCar = async (maintenanceId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE cars SET maintenanceId = NULL WHERE maintenanceId = $1`,
      [maintenanceId]
    );

    const deleteResult = await client.query(
      `DELETE FROM maintenance WHERE maintenanceId = $1 RETURNING *`,
      [maintenanceId]
    );

    await client.query('COMMIT');
    return deleteResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};