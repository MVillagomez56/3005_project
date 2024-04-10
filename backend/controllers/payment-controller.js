const pool = require("../db");
const getAllPayments = async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM payments");
    res.json(rows.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error while retrieving payments.");
  }
};

const getPaymentById = async (req, res) => {
  const paymentId = parseInt(req.params.id);

  if (isNaN(paymentId)) {
    return res.status(400).json({ error: "Invalid payments ID." });
  }

  try {
    const query = "SELECT * FROM payments WHERE payment_id = $1";
    const { rows } = await pool.query(query, [paymentId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "payments not found." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the payments." });
  }
};

const addPayment = async (req, res) => {
  const { member_id, amount, service, completion_status } = req.body;
  let serviceName;

  //if service is number, fetch relevant class
  if (service !== "membership") {
    const query = "SELECT * FROM classes WHERE class_id = $1";
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
    const query =
      "INSERT INTO payment (member_id, amount, service, completion_status) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [member_id, amount, serviceName, completion_status];
    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while adding the payments." });
  }
};

const approvePayment = async (req, res) => {
  const paymentId = parseInt(req.params.id);

  if (isNaN(paymentId)) {
    return res.status(400).json({ error: "Invalid payment ID." });
  }

  try {
    const query =
      "UPDATE Payments SET completion_status = TRUE WHERE id = $1 RETURNING *";
    const { rows } = await pool.query(query, [paymentId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Payment not found." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while approving the payment." });
  }
};

const declinePayment = async (req, res) => {
  const paymentId = parseInt(req.params.id);

  if (isNaN(paymentId)) {
    return res.status(400).json({ error: "Invalid payment ID." });
  }

  try {
    // Since there's no 'Declined' status in a BOOLEAN, assuming you want to set it back to FALSE (Pending).
    // If you intend to mark it as something else, you might need to adjust your data model.
    // For now, setting it to FALSE or considering adding another column to represent declined status.
    const query =
      "UPDATE Payments SET completion_status = FALSE WHERE id = $1 RETURNING *";
    const { rows } = await pool.query(query, [paymentId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Payment not found." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while declining the payment." });
  }
};

const getMemberPayments = async (req, res) => {
  const memberId = parseInt(req.params.id);

  if (isNaN(memberId)) {
    return res.status(400).json({ error: "Invalid member ID." });
  }

  try {
    const query = "SELECT * FROM Payments WHERE member_id = $1";
    const { rows } = await pool.query(query, [memberId]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the payments." });
  }
};

const cancelPayment = async (req, res) => {
  //delete payment
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    return res.status(400).json({ error: "Invalid payment ID." });
  }
  try {
    const query = "DELETE FROM Payments WHERE id = $1 RETURNING *";
    const { rows } = await pool.query(query, [paymentId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Payment not found." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "An error occurred while cancelling the payment." });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  addPayment,
  approvePayment,
  declinePayment,
  getMemberPayments,
  cancelPayment,
};
