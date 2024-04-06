const getAllPayments = async (req, res) => {
    try {
        const rows = await db.query("SELECT * FROM payment");
        res.json(rows.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving payments.");
    }
}

const getPaymentById = async (req, res) => {
    const paymentId = parseInt(req.params.id);

    if (isNaN(paymentId)) {
        return res.status(400).json({ error: "Invalid payment ID." });
    }

    try {
        const query = "SELECT * FROM payment WHERE payment_id = $1";
        const { rows } = await db.query(query, [paymentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Payment not found." });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while retrieving the payment." });
    }
}

const addPayment = async (req, res) => {

    const { member_id, amount, service, completion_status } = req.body;
    let serviceName;

    //if service is number, fetch relevant class
    if (service!== "membership") {
        const query= "SELECT * FROM classes WHERE class_id = $1";
        const { rows } = await db.query(query, [service]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Class not found." });
        }
        serviceName = rows[0].type + " fitness class";

    } else {
        serviceName = "membership";
    }

    try {
        console.log("Adding payment", serviceName);
        const query = "INSERT INTO payment (member_id, amount, service, completion_status) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [member_id, amount, serviceName, completion_status];

        const { rows } = await db.query(query, values);

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while adding the payment." });
    }

}

const approvePayment = async (req, res) => {
    const paymentId = parseInt(req.params.id);

    if (isNaN(paymentId)) {
        return res.status(400).json({ error: "Invalid payment ID." });
    }

    try {
        const query = "UPDATE payment SET completion_status = 'Completed' WHERE payment_id = $1 RETURNING *";
        const { rows } = await db.query(query, [paymentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Payment not found." });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while approving the payment." });
    }
}

const declinePayment = async (req, res) => {
    
    const paymentId = parseInt(req.params.id);

    if (isNaN(paymentId)) {
        return res.status(400).json({ error: "Invalid payment ID." });
    }

    try {
        const query = "UPDATE payment SET completion_status = 'Declined' WHERE payment_id = $1 RETURNING *";
        const { rows } = await db.query(query, [paymentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Payment not found." });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while declining the payment." });
    }
}

module.exports = {
    getAllPayments,
    getPaymentById,
    addPayment,
    approvePayment,
    declinePayment
}