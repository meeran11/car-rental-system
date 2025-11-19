import pool from "../config/db.js";

const createStaffTable = async () => {
    const queryText = `
   CREATE TABLE IF NOT EXISTS staff (
    staffid SERIAL PRIMARY KEY,
    staffname VARCHAR(100) NOT NULL,
    staffphone CHAR(11) NOT NULL CHECK (staffphone ~ '^[0-9]{11}$'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


 `;
    try {
        await pool.query(queryText);
        console.log("Staff table created successfully");
    } catch (error) {
        console.error("Error creating staff table:", error);
    }
};

export default createStaffTable;