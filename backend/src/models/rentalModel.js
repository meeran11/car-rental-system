import pool from "../config/db.js";
import { deletePaymentService } from "./paymentModel.js";
export const createRentalService = async ({
  customerId,
  userId,
  staffId = null,
  carId,
  paymentId,
  startDate,
  endDate,
  totalAmount,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1) Update car status to 'requested'
    await client.query(
      `UPDATE cars SET carStatus = 'requested' WHERE carId = $1`,
      [carId]
    );

    // 2) Insert rental
    const insertQuery = `
      INSERT INTO rentals
        (customerId, userId, staffId, carId, paymentId, startDate, endDate, totalAmount)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;
    const values = [
      customerId,
      userId,
      staffId,
      carId,
      paymentId,
      startDate,
      endDate,
      totalAmount,
    ];

    const { rows } = await client.query(insertQuery, values);

    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await deletePaymentService(paymentId); // Rollback payment on failure
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getRequestedRentalsService = async () => {
  const { rows } = await pool.query(
    `
      SELECT r.bookingId,
             r.carId,
             c.carModel,
             c.carYear,
             c.carImageUrl,
             r.startDate,
             r.endDate,
             r.totalAmount,
             r.paymentId,
             r.staffId,
             r.status,
             u.username AS customerUsername,
             cu.customerName,
             cu.customerPhone,
             cu.driverLicense
      FROM rentals r
      JOIN cars c ON r.carId = c.carId
      JOIN customers cu ON r.customerId = cu.customerId
      JOIN users u ON cu.userId = u.userId
      WHERE r.status = 'requested'
      ORDER BY r.startDate ASC
    `
  );

  return rows;
};

export const approveRentalService = async ({ bookingId, userId }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    //get staffId from userId
    const { rows: staffRows } = await client.query(
      `SELECT staffId FROM staff WHERE userId = $1`,
      [userId]
    );
    if(staffRows.length === 0) {
      throw new Error("Staff not found");
    }
    const staffId = staffRows[0].staffid;
    // 1) Check rental status
    const { rows } = await client.query(
      `
      SELECT r.carId, r.status
      FROM rentals r
      JOIN cars c ON r.carId = c.carId
      WHERE r.bookingId = $1
      FOR UPDATE
    `,
      [bookingId]
    );

    if (rows.length === 0) {
      throw new Error("Rental not found");
    }

    const { carid, status } = rows[0];
    if (status !== "requested") {
      throw new Error("Rental is not in requested status");
    }

    // 2) Update car status to 'rented'
    await client.query(
      `
      UPDATE cars
      SET carStatus = 'rented'
      WHERE carId = $1
    `,
      [carid]
    );

    // 3) Update rentals table with staffId and status to 'active'
    await client.query(
      `
      UPDATE rentals
      SET staffId = $1, status = 'active'
      WHERE bookingId = $2
    `,
      [staffId, bookingId]
    );

    await client.query("COMMIT");
    return { bookingId, carid, staffId, status: "active" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getRentedCarsByUserService = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT
      r.bookingId,
      r.userId,
      r.customerId,
      r.carId,
      c.carModel,
      c.carImageUrl,
      c.carYear,
      r.startDate,
      r.endDate,
      r.totalAmount,
      r.paymentId,
      r.status
    FROM rentals r
    JOIN cars c ON r.carId = c.carId
    WHERE r.userId = $1
      AND r.status = 'active'
    ORDER BY r.startDate DESC;
    `,
    [userId]
  );

  return rows;
};

export const getRequestedRentalsByUserService = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT
  r.bookingid,
  r.carid,
  c.carmodel,
  c.caryear,
  c.carimageurl,
  r.startdate,
  r.enddate,
  r.totalamount,
  r.paymentid,
  r.status,
  cu.customername,
  cu.driverlicense
FROM rentals r
JOIN cars c ON r.carid = c.carid
JOIN customers cu ON r.customerid = cu.customerid
WHERE r.userid = $1
  AND r.status = 'requested'
ORDER BY r.startdate ASC;
    `,
    [userId]
  );

  return rows;
};

export const endRentalService = async (bookingId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) Lock rental and check status
    const { rows } = await client.query(
      `SELECT bookingid, carid, status
       FROM rentals
       WHERE bookingid = $1
       FOR UPDATE`,
      [bookingId]
    );

    if (rows.length === 0) {
      throw new Error("Rental not found");
    }

    const { bookingid, carid, status } = rows[0];
    if (status !== "active") {
      throw new Error("Rental is not currently active");
    }

    // 2) Update car status back to 'available'
    await client.query(
      `UPDATE cars SET carstatus = 'available' WHERE carid = $1`,
      [carid]
    );

    // 3) Mark rental as completed
    await client.query(
      `UPDATE rentals SET status = 'completed', startdate = NULL, enddate = NULL WHERE bookingid = $1`,
      [bookingid]
    );

    await client.query("COMMIT");
    return { bookingid, carid, status: "completed" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const declineRentalService = async (bookingId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) Lock rental and check status, get paymentId
    const { rows } = await client.query(
      `SELECT r.carId, r.status, r.paymentId
       FROM rentals r
       WHERE r.bookingId = $1
       FOR UPDATE`,
      [bookingId]
    );

    if (rows.length === 0) {
      throw new Error("Rental not found");
    }

    const { carid, status, paymentid } = rows[0];
    if (status !== "requested") {
      throw new Error("Rental is not in requested status");
    }

    // 2) Update car status back to 'available'
    await client.query(
      `UPDATE cars SET carStatus = 'available' WHERE carId = $1`,
      [carid]
    );

    // 3) Delete the associated payment (reverse payment)
    await client.query(`DELETE FROM payments WHERE paymentId = $1`, [
      paymentid,
    ]);

    // 4) Mark rental as declined
    await client.query(
      `UPDATE rentals SET status = 'declined', updated_at = NOW() WHERE bookingId = $1`,
      [bookingId]
    );

    await client.query("COMMIT");
    return {
      bookingId,
      carid,
      paymentid,
      status: "declined",
      message: "Rental declined successfully. Your payment has been reversed.",
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
