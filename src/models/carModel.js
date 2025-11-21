import pool from '../config/db.js';
import { getAllCars } from '../controllers/carController.js';

export const uploadCarService = async ({ carModel, carYear, carStatus, maintenanceId, carImageUrl }) => {
    const result = await pool.query(`
        INSERT INTO cars (carModel, carYear, carStatus, maintenanceId, carImageUrl, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
    `, [carModel, carYear, carStatus, maintenanceId, carImageUrl]);
    return result.rows[0];
}

export const getAllCarsService = async () => {
    const result = await pool.query(`
        SELECT carId, carModel, carYear, carStatus, maintenanceId, carImageUrl, created_at
        FROM cars`);
    return result.rows;
}

export const getCarByIdService = async (id) => {
    const result = await pool.query(`
        SELECT carId, carModel, carYear, carStatus, maintenanceId, carImageUrl, created_at
        FROM cars
        WHERE carId = $1
    `, [id]);
    return result.rows[0];
}

// services/carService.js
export const updateCarByIDService = async (carId, carData) => {
    const { carModel, carYear, carStatus, maintenanceId, carImageUrl } = carData;

    const result = await pool.query(`
        UPDATE cars
        SET carModel = $1,
            carYear = $2,
            carStatus = $3,
            maintenanceId = $4,
            carImageUrl = $5
        WHERE carId = $6
        RETURNING carId, carModel, carYear, carStatus, maintenanceId, carImageUrl, created_at
    `, [carModel, carYear, carStatus, maintenanceId, carImageUrl, carId]);

    return result.rows[0]; // return the updated car
};

// services/carService.js
export const deleteCarByIDService = async (carId) => {
    const result = await pool.query(`
        DELETE FROM cars
        WHERE carId = $1
        RETURNING carId, carModel, carYear, carStatus, maintenanceId, carImageUrl, created_at
    `, [carId]);

    return result.rows[0]; // will be undefined if no car was found
};