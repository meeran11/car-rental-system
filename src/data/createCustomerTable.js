import pool from "../config/db.js";

const createCustomerTable = async () => {
    const queryText = `
   CREATE TABLE IF NOT EXISTS customers (
    customerid SERIAL PRIMARY KEY,
    customername VARCHAR(100) NOT NULL,
    customerphone CHAR(11) NOT NULL CHECK (customerphone ~ '^[0-9]{11}$'),
    driverlicense VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 `;
    try {
        await pool.query(queryText);
        console.log("Customer table created successfully");
    } catch (error) {
        console.error("Error creating customer table:", error);
    }
};

export default createCustomerTable;