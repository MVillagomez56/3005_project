var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// USE FOR USER AUTHENTICATION
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var pool = require("../db");
// Get
var getUserById = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var userId, rows, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.id);
                // Validate that the provided ID is a number
                if (isNaN(userId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid user ID." })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pool.query("SELECT id, email, name, date_of_birth, role FROM Users WHERE id = $1;", [userId])];
            case 2:
                rows = (_a.sent()).rows;
                // Check if a user was found
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found." })];
                }
                res.json(rows[0]); // Send the found user
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while retrieving the user." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getAllMembers = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var rows, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, pool.query("SELECT m.id, u.name, m.weight, m.height, m.muscle_mass, m.body_fat FROM Members m JOIN Users u ON m.id = u.id ORDER BY m.id;")];
            case 1:
                rows = (_a.sent()).rows;
                res.json(rows);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error(err_2.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while retrieving members." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getMemberById = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var userId, rows, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.userid);
                // Validate that the provided ID is a number
                if (isNaN(userId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid user ID provided." })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pool.query("SELECT m.id, u.name, m.weight, m.height, m.muscle_mass, m.body_fat FROM Members m JOIN Users u ON m.id = u.id WHERE m.id = $1;", [userId])];
            case 2:
                rows = (_a.sent()).rows;
                // Check if a member was found
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "Member not found." })];
                }
                res.json(rows[0]); // Send the found member
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.error(err_3.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while retrieving the member." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getFitnessGoals = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var member_id, rows, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                member_id = parseInt(req.params.member_id);
                console.log("member_id", member_id);
                if (typeof member_id !== "number" || member_id <= 0) {
                    console.log("Invalid member ID.");
                    return [2 /*return*/, res.status(400).json({ error: "Invalid member ID." })];
                }
                return [4 /*yield*/, pool.query("SELECT * FROM fitness_goals WHERE member_id = $1 ORDER BY id ASC;", [member_id])];
            case 1:
                rows = (_a.sent()).rows;
                res.json(rows);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.error(err_4.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while retrieving fitness goals." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addFitnessGoal = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var goal, member_id, rows, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                goal = req.body.goal;
                member_id = parseInt(req.params.member_id);
                if (typeof member_id !== "number" || member_id <= 0) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid member ID." })];
                }
                if (typeof goal !== "string" || !goal.trim()) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid goal." })];
                }
                return [4 /*yield*/, pool.query("INSERT INTO fitness_goals (member_id, goal) VALUES ($1, $2) RETURNING *;", [member_id, goal])];
            case 1:
                rows = (_a.sent()).rows;
                console.log("rows", rows);
                res.status(201).json(rows[0]);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                console.error(err_5.message);
                res.status(500).json({ error: "An error occurred while adding the goal." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var updateFitnessGoal = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var goal, goal_id, rows, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                goal = req.body.goal;
                goal_id = parseInt(req.params.goal_id);
                if (typeof goal_id !== "number" || goal_id <= 0) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid goal ID." })];
                }
                if (typeof goal !== "string" || !goal.trim()) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid goal." })];
                }
                return [4 /*yield*/, pool.query("UPDATE fitness_goals SET goal = $1 WHERE id = $2 RETURNING *;", [goal, goal_id])];
            case 1:
                rows = (_a.sent()).rows;
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "Goal not found." })];
                }
                res.status(200).json(rows[0]);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                console.error(err_6.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while updating the goal." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var completeFitnessGoal = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var goal_id, status, rows, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                goal_id = parseInt(req.params.goal_id);
                status = req.body.status;
                if (typeof goal_id !== "number" || goal_id <= 0) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid goal ID." })];
                }
                if (typeof status !== "boolean") {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid status." })];
                }
                return [4 /*yield*/, pool.query("UPDATE fitness_goals SET status = $1 WHERE id = $2 RETURNING *;", [status, goal_id])];
            case 1:
                rows = (_a.sent()).rows;
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "Goal not found." })];
                }
                res.status(200).json(rows[0]);
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                console.error(err_7.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while completing the goal." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var deleteFitnessGoal = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var goal_id, rows, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                goal_id = parseInt(req.params.goal_id);
                if (typeof goal_id !== "number" || goal_id <= 0) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid goal ID." })];
                }
                return [4 /*yield*/, pool.query("DELETE FROM fitness_goals WHERE id = $1 RETURNING *;", [goal_id])];
            case 1:
                rows = (_a.sent()).rows;
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "Goal not found." })];
                }
                res.status(200).json(rows[0]);
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                console.error(err_8.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while deleting the goal." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var searchMember = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, id, name, userId, userName, query, rows, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("Trigger!");
                _a = req.query, id = _a.id, name = _a.name;
                if (!id || !name) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Both ID and name must be provided." })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                userId = parseInt(id);
                userName = name.trim();
                if (isNaN(userId) || userName === "") {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid ID or name." })];
                }
                query = "\n      SELECT u.id, u.name\n      FROM Users u\n      JOIN Members m ON u.id = m.id\n      WHERE u.id = $1 AND u.name = $2;\n    ";
                return [4 /*yield*/, pool.query(query, [userId, userName])];
            case 2:
                rows = (_b.sent()).rows;
                if (rows.length > 0) {
                    console.log(rows[0]);
                    res.json(rows[0]);
                }
                else {
                    res.status(404).json({ message: "Member not found" });
                }
                return [3 /*break*/, 4];
            case 3:
                err_9 = _b.sent();
                console.error(err_9.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while searching for the member." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Function to get all trainers and their PF sessions
var getAllTrainersWithPF = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var trainersQuery, rows, trainers, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                trainersQuery = "\n      SELECT \n        t.id, \n        u.name, \n        t.specialization\n      FROM \n        Trainers t\n      JOIN \n        Users u ON t.id = u.id\n      WHERE \n        u.role = 'trainer';\n    ";
                return [4 /*yield*/, pool.query(trainersQuery)];
            case 1:
                rows = (_a.sent()).rows;
                trainers = rows.map(function (trainer) { return ({
                    id: trainer.id,
                    name: trainer.name,
                    specialization: trainer.specialization
                }); });
                res.json(trainers);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Error fetching trainers:", error_1);
                res.status(500).json({
                    error: "An error occurred while retrieving trainers."
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getTrainerDetailById = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var trainerId, trainerDetailQuery, rows, trainer, formattedTrainer, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                trainerId = parseInt(req.params.id);
                trainerDetailQuery = "\n      SELECT \n        t.id, \n        u.name, \n        t.specialization, \n        t.monday_availability,\n        t.tuesday_availability,\n        t.wednesday_availability,\n        t.thursday_availability,\n        t.friday_availability,\n        t.saturday_availability,\n        t.sunday_availability,\n        t.cost\n      FROM \n        Trainers t\n      JOIN \n        Users u ON t.id = u.id\n      WHERE \n        t.id = $1 AND u.role = 'trainer';\n    ";
                return [4 /*yield*/, pool.query(trainerDetailQuery, [trainerId])];
            case 1:
                rows = (_a.sent()).rows;
                // Check if the trainer was found
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "Trainer not found." })];
                }
                trainer = rows[0];
                formattedTrainer = {
                    id: trainer.id,
                    name: trainer.name,
                    specialization: trainer.specialization,
                    availability: {
                        monday: trainer.monday_availability,
                        tuesday: trainer.tuesday_availability,
                        wednesday: trainer.wednesday_availability,
                        thursday: trainer.thursday_availability,
                        friday: trainer.friday_availability,
                        saturday: trainer.saturday_availability,
                        sunday: trainer.sunday_availability
                    },
                    cost: trainer.cost
                };
                res.json(formattedTrainer);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching trainer details:", error_2);
                res.status(500).json({
                    error: "An error occurred while retrieving the trainer's details."
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var registerCourse = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
// Post
//Add a new user
var register = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var _a, email, password, name, date_of_birth, role, insertQuery, values, rows, err_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, email = _a.email, password = _a.password, name = _a.name, date_of_birth = _a.date_of_birth, role = _a.role;
                if (typeof password !== "string" || !password.trim()) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid password" })];
                }
                if (typeof email !== "string" || !email.trim()) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid email" })];
                }
                if (typeof name !== "string" || !name.trim()) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid name" })];
                }
                if (new Date(date_of_birth).toString() === "Invalid Date") {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid date of birth" })];
                }
                insertQuery = "\n        INSERT INTO Users (email, password, name, date_of_birth, role)\n        VALUES ($1, $2, $3, $4, $5)\n        RETURNING id, email, name, date_of_birth, role, password;\n      ";
                values = [email, password, name, date_of_birth, role];
                return [4 /*yield*/, pool.query(insertQuery, values)];
            case 1:
                rows = (_b.sent()).rows;
                // Send success response
                res.status(201).json({ user: __assign(__assign({}, rows[0]), { has_payment_method: false }) });
                return [3 /*break*/, 3];
            case 2:
                err_10 = _b.sent();
                console.error(err_10);
                res
                    .status(500)
                    .json({ error: "Could not create new user in the database" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var login = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var _a, email, password, rows, user, err_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Extract login details from request body
                console.log("req.body", req.body);
                _a = req.body, email = _a.email, password = _a.password;
                //check if email and password are strings
                if (typeof email !== "string" || !email.trim()) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid email" })];
                }
                if (typeof password !== "string" || !password.trim()) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid password" })];
                }
                return [4 /*yield*/, pool.query("SELECT * FROM Users WHERE email = $1;", [
                        email,
                    ])];
            case 1:
                rows = (_b.sent()).rows;
                if (rows[0] == undefined) {
                    console.log("User not found");
                    return [2 /*return*/, res.status(401).json({ error: "User not found" })];
                }
                user = rows[0];
                // const isPasswordValid = await bcrypt.compare(password, user.password);
                console.log("user", user);
                if (password !== user.password) {
                    return [2 /*return*/, res.status(401).json({ error: "Incorrect password" })];
                }
                // STRECTH GOAL: Generate a JWT token
                // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                //   expiresIn: "1h",
                // });
                res.status(200).json({
                    user: __assign(__assign({}, user), { has_payment_method: !!user.cc_number })
                }); // send user object to be stored in local storage and state
                return [3 /*break*/, 3];
            case 2:
                err_11 = _b.sent();
                console.error(err_11);
                res.status(500).json({ error: "Could not log in user" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// add payment
var addPayment = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var _a, member_id, amount, payment_date, service, amountNum, memberCheck, rows, err_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, member_id = _a.member_id, amount = _a.amount, payment_date = _a.payment_date, service = _a.service;
                amountNum = parseFloat(amount);
                // Basic validation
                if (typeof member_id !== "number" || member_id <= 0) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid member ID" })];
                }
                if (typeof amountNum !== "number" || amount <= 0) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid amount" })];
                }
                if (typeof service !== "string" || !service.trim()) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid service" })];
                }
                return [4 /*yield*/, pool.query("SELECT id FROM Members WHERE id = $1", [member_id])];
            case 1:
                memberCheck = _b.sent();
                if (memberCheck.rows.length === 0) {
                    return [2 /*return*/, res.status(400).json({ error: "Member ID does not exist" })];
                }
                return [4 /*yield*/, pool.query("INSERT INTO payments (member_id, amount, date, service) VALUES ($1, $2, $3, $4) RETURNING *;", [member_id, amountNum, payment_date, service])];
            case 2:
                rows = (_b.sent()).rows;
                // Respond with the newly created payment entry
                res.status(201).json(rows[0]);
                return [3 /*break*/, 4];
            case 3:
                err_12 = _b.sent();
                console.error(err_12.message);
                res.status(500).json({ error: "Could not create payment" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var addFitnessGoals = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var goals, member_id_1, _i, goals_1, goal, valuesPlaceholder, queryText, rows, err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                goals = req.body.goals;
                console.log("req", req);
                member_id_1 = parseInt(req.params.member_id);
                //add back in memberid
                if (typeof member_id_1 !== "number" || member_id_1 <= 0) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid or missing member ID." })];
                }
                // Validate 'goals' array
                if (!Array.isArray(goals) || goals.length === 0) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid or missing goals." })];
                }
                // Validate each goal in the array
                for (_i = 0, goals_1 = goals; _i < goals_1.length; _i++) {
                    goal = goals_1[_i];
                    if (typeof goal !== "string" || !goal.trim()) {
                        return [2 /*return*/, res.status(400).json({ error: "Invalid goal." })];
                    }
                }
                valuesPlaceholder = goals
                    .map(function (_, index) { return "(" + member_id_1 + ", $" + (index + 1) + ")"; })
                    .join(",");
                queryText = "INSERT INTO fitness_goals (member_id, goal) VALUES " + valuesPlaceholder + " RETURNING *;";
                return [4 /*yield*/, pool.query(queryText, goals)];
            case 1:
                rows = (_a.sent()).rows;
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "Could not add the fitness goal." })];
                }
                res.status(201).json(rows); // Send the newly created fitness goal
                return [3 /*break*/, 3];
            case 2:
                err_13 = _a.sent();
                console.error(err_13);
                res
                    .status(500)
                    .json({ error: "Could not add the fitness goal to the database." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//put
//update members
var updateMember = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var member_id, _a, weight, height, updateQuery, values, rows, err_14;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                member_id = parseInt(req.params.member_id);
                // Validate that the provided ID is a number
                if (isNaN(member_id)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid member ID provided." })];
                }
                _a = req.body, weight = _a.weight, height = _a.height;
                updateQuery = "\n        UPDATE Members\n        SET weight = $1, height = $2\n        WHERE id = $3\n        RETURNING *;\n      ";
                values = [weight, height, member_id];
                return [4 /*yield*/, pool.query(updateQuery, values)];
            case 1:
                rows = (_b.sent()).rows;
                // Check if a member was found and updated
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "Member not found." })];
                }
                res.json(rows[0]); // Send the updated member
                return [3 /*break*/, 3];
            case 2:
                err_14 = _b.sent();
                console.error(err_14.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while updating the member." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var updateMemberPaymentInfo = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var member_id, _a, cardNumber, ccv, expiryDate, updateQuery, values, rows, err_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                console.log("req.body", req.body);
                member_id = parseInt(req.params.member_id);
                // Validate that the provided ID is a number
                if (isNaN(member_id)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid member ID provided." })];
                }
                _a = req.body, cardNumber = _a.cardNumber, ccv = _a.ccv, expiryDate = _a.expiryDate;
                updateQuery = "\n        UPDATE Members\n        SET cc_number = $1, cc_expiry_date = $2, ccv = $3\n        WHERE id = $4\n        RETURNING *;\n      ";
                values = [cardNumber, expiryDate, ccv, member_id];
                return [4 /*yield*/, pool.query(updateQuery, values)];
            case 1:
                rows = (_b.sent()).rows;
                // Check if a member was found and updated
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "Member not found." })];
                }
                res.json(rows[0]); // Send the updated member
                return [3 /*break*/, 3];
            case 2:
                err_15 = _b.sent();
                console.error(err_15.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while updating the member." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var updateUser = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var userId, _a, name, email, password, date_of_birth, updateQuery, values, rows, err_16;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = parseInt(req.params.id);
                // Validate that the provided ID is a number
                if (isNaN(userId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid user ID provided." })];
                }
                _a = req.body, name = _a.name, email = _a.email, password = _a.password, date_of_birth = _a.date_of_birth;
                updateQuery = "\n        UPDATE Users\n        SET email = $1, name = $2, date_of_birth = $3, password = $4\n        WHERE id = $5\n        RETURNING *;\n      ";
                values = [email, name, date_of_birth, password, userId];
                return [4 /*yield*/, pool.query(updateQuery, values)];
            case 1:
                rows = (_b.sent()).rows;
                // Check if a user was found and updated
                if (rows.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found." })];
                }
                res.json(rows[0]); // Send the updated user
                return [3 /*break*/, 3];
            case 2:
                err_16 = _b.sent();
                console.error(err_16.message);
                res
                    .status(500)
                    .json({ error: "An error occurred while updating the user." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
module.exports = {
    login: login,
    register: register,
    updateMember: updateMember,
    addFitnessGoals: addFitnessGoals,
    updateMemberPaymentInfo: updateMemberPaymentInfo,
    addPayment: addPayment,
    searchMember: searchMember,
    getAllTrainersWithPF: getAllTrainersWithPF,
    updateUser: updateUser,
    getFitnessGoals: getFitnessGoals,
    addFitnessGoal: addFitnessGoal,
    updateFitnessGoal: updateFitnessGoal,
    completeFitnessGoal: completeFitnessGoal,
    deleteFitnessGoal: deleteFitnessGoal,
    getTrainerDetailById: getTrainerDetailById
};
