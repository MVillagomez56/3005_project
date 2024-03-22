const getAllRooms = async(req,res,next)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM Rooms");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving rooms.");
    }
}

const getAllClass = async(req,res,next)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM Classes");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving classes.");
    }
}

const getAllMembers = async(req,res,next)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM Members");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving members.");
    }
}

const getAllEquipment = async(req,res,next)=>{
    try {
        const { rows } = await pool.query("SELECT * FROM Equipment");
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving equipment.");
    }
}

const getPopularClass = async(req,res,next)=>{
    try {
        const query = `
            SELECT c.id, c.name, COUNT(cm.member_id) as member_count 
            FROM Classes c
            JOIN Classes_Members cm ON c.id = cm.class_id
            GROUP BY c.id
            ORDER BY member_count DESC
            LIMIT 1
        `;
        const { rows } = await pool.query(query);
        if (rows.length === 0) {
            return res.status(404).send("No classes found.");
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error while retrieving the popular class.");
    }
}