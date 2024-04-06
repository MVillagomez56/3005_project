const pool = require("../db");

const getAllEquipment = async (req, res, next) => {

    try {
        const { rows } = await pool.query("SELECT * FROM Equipment");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving equipment.");
    }

}

const getEquipmentById = async (req, res, next) => {
    const equipmentId = parseInt(req.params.id);

    if (isNaN(equipmentId)) {
        return res.status(400).json({ error: "Invalid equipment ID." });
    }

    try {
        const query = "SELECT * FROM Equipment WHERE id = $1";
        const { rows } = await pool.query(query, [equipmentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Equipment not found." });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while retrieving the equipment." });
    }

}

const changeEquipmentStatus = async (req, res, next) => {
    const equipmentId = parseInt(req.params.id);
    const { newStatus } = req.body; // Assuming the new status is sent in the request body

    if (isNaN(equipmentId)) {
        return res.status(400).json({ error: "Invalid equipment ID." });
    }

    if (!['available', 'unavailable', 'maintenance'].includes(newStatus)) {
        return res.status(400).json({ error: "Invalid status value." });
    }

    try {
        const query = "UPDATE Equipment SET status = $2 WHERE id = $1 RETURNING *";
        const { rows } = await pool.query(query, [equipmentId, newStatus]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Equipment not found." });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while changing the equipment status." });
    }
};

module.exports = {
    getAllEquipment,
    getEquipmentById,
    changeEquipmentStatus
};