"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// USE FOR USER AUTHENTICATION
var jwt = require("jsonwebtoken");

var bcrypt = require("bcrypt");

var pool = require("../db");

var dayMappings = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7
}; // Get

var getUserById = function getUserById(req, res, next) {
  var userId, _ref, rows;

  return regeneratorRuntime.async(function getUserById$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("getUserById");
          userId = parseInt(req.params.id); // Validate that the provided ID is a number

          if (!isNaN(userId)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Invalid user ID."
          }));

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(pool.query("SELECT * FROM Users WHERE id = $1;", [userId]));

        case 7:
          _ref = _context.sent;
          rows = _ref.rows;

          if (!(rows.length === 0)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "User not found."
          }));

        case 11:
          res.json(rows[0]); // Send the found user

          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](4);
          console.error(_context.t0.message);
          res.status(500).json({
            error: "An error occurred while retrieving the user."
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 14]]);
};

var getAllMembers = function getAllMembers(req, res, next) {
  var _ref2, rows;

  return regeneratorRuntime.async(function getAllMembers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(pool.query("SELECT m.id, u.name, m.weight, m.height, m.muscle_mass, m.body_fat FROM Members m JOIN Users u ON m.id = u.id ORDER BY m.id;"));

        case 3:
          _ref2 = _context2.sent;
          rows = _ref2.rows;
          res.json(rows);
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0.message);
          res.status(500).json({
            error: "An error occurred while retrieving members."
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getMemberById = function getMemberById(req, res, next) {
  var userId, _ref3, rows;

  return regeneratorRuntime.async(function getMemberById$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          userId = parseInt(req.params.userid); // Convert the userid from string to integer
          // Validate that the provided ID is a number

          if (!isNaN(userId)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "Invalid user ID provided."
          }));

        case 3:
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(pool.query("SELECT * FROM Members m WHERE m.id = $1;", [userId]));

        case 6:
          _ref3 = _context3.sent;
          rows = _ref3.rows;

          if (!(rows.length === 0)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "Member not found."
          }));

        case 10:
          res.json(rows[0]); // Send the found member

          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](3);
          console.error(_context3.t0.message);
          res.status(500).json({
            error: "An error occurred while retrieving the member."
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 13]]);
};

var getFitnessGoals = function getFitnessGoals(req, res, next) {
  var member_id, _ref4, rows;

  return regeneratorRuntime.async(function getFitnessGoals$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          member_id = parseInt(req.params.member_id);
          console.log("member_id", member_id);

          if (!(typeof member_id !== "number" || member_id <= 0)) {
            _context4.next = 6;
            break;
          }

          console.log("Invalid member ID.");
          return _context4.abrupt("return", res.status(400).json({
            error: "Invalid member ID."
          }));

        case 6:
          _context4.next = 8;
          return regeneratorRuntime.awrap(pool.query("SELECT * FROM fitness_goals WHERE member_id = $1 ORDER BY id ASC;", [member_id]));

        case 8:
          _ref4 = _context4.sent;
          rows = _ref4.rows;
          res.json(rows);
          _context4.next = 17;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0.message);
          res.status(500).json({
            error: "An error occurred while retrieving fitness goals."
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var addFitnessGoal = function addFitnessGoal(req, res, next) {
  var goal, member_id, _ref5, rows;

  return regeneratorRuntime.async(function addFitnessGoal$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          goal = req.body.goal;
          member_id = parseInt(req.params.member_id);

          if (!(typeof member_id !== "number" || member_id <= 0)) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: "Invalid member ID."
          }));

        case 5:
          if (!(typeof goal !== "string" || !goal.trim())) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: "Invalid goal."
          }));

        case 7:
          _context5.next = 9;
          return regeneratorRuntime.awrap(pool.query("INSERT INTO fitness_goals (member_id, goal) VALUES ($1, $2) RETURNING *;", [member_id, goal]));

        case 9:
          _ref5 = _context5.sent;
          rows = _ref5.rows;
          console.log("rows", rows);
          res.status(201).json(rows[0]);
          _context5.next = 19;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0.message);
          res.status(500).json({
            error: "An error occurred while adding the goal."
          });

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var updateFitnessGoal = function updateFitnessGoal(req, res, next) {
  var goal, goal_id, _ref6, rows;

  return regeneratorRuntime.async(function updateFitnessGoal$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          goal = req.body.goal;
          goal_id = parseInt(req.params.goal_id);

          if (!(typeof goal_id !== "number" || goal_id <= 0)) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: "Invalid goal ID."
          }));

        case 5:
          if (!(typeof goal !== "string" || !goal.trim())) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: "Invalid goal."
          }));

        case 7:
          _context6.next = 9;
          return regeneratorRuntime.awrap(pool.query("UPDATE fitness_goals SET goal = $1 WHERE id = $2 RETURNING *;", [goal, goal_id]));

        case 9:
          _ref6 = _context6.sent;
          rows = _ref6.rows;

          if (!(rows.length === 0)) {
            _context6.next = 13;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: "Goal not found."
          }));

        case 13:
          res.status(200).json(rows[0]);
          _context6.next = 20;
          break;

        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0.message);
          res.status(500).json({
            error: "An error occurred while updating the goal."
          });

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var completeFitnessGoal = function completeFitnessGoal(req, res, next) {
  var goal_id, status, _ref7, rows;

  return regeneratorRuntime.async(function completeFitnessGoal$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          goal_id = parseInt(req.params.goal_id);
          status = req.body.status;

          if (!(typeof goal_id !== "number" || goal_id <= 0)) {
            _context7.next = 5;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: "Invalid goal ID."
          }));

        case 5:
          if (!(typeof status !== "boolean")) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: "Invalid status."
          }));

        case 7:
          _context7.next = 9;
          return regeneratorRuntime.awrap(pool.query("UPDATE fitness_goals SET status = $1 WHERE id = $2 RETURNING *;", [status, goal_id]));

        case 9:
          _ref7 = _context7.sent;
          rows = _ref7.rows;

          if (!(rows.length === 0)) {
            _context7.next = 13;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            error: "Goal not found."
          }));

        case 13:
          res.status(200).json(rows[0]);
          _context7.next = 20;
          break;

        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0.message);
          res.status(500).json({
            error: "An error occurred while completing the goal."
          });

        case 20:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var deleteFitnessGoal = function deleteFitnessGoal(req, res, next) {
  var goal_id, _ref8, rows;

  return regeneratorRuntime.async(function deleteFitnessGoal$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          goal_id = parseInt(req.params.goal_id);

          if (!(typeof goal_id !== "number" || goal_id <= 0)) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            error: "Invalid goal ID."
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(pool.query("DELETE FROM fitness_goals WHERE id = $1 RETURNING *;", [goal_id]));

        case 6:
          _ref8 = _context8.sent;
          rows = _ref8.rows;

          if (!(rows.length === 0)) {
            _context8.next = 10;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            error: "Goal not found."
          }));

        case 10:
          res.status(200).json(rows[0]);
          _context8.next = 17;
          break;

        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0.message);
          res.status(500).json({
            error: "An error occurred while deleting the goal."
          });

        case 17:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var searchMember = function searchMember(req, res) {
  var id, name, updateQuery, values, valueIndex, _ref9, rows;

  return regeneratorRuntime.async(function searchMember$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log("Trigger!");
          id = parseInt(req.query.id);
          name = req.query.name;
          _context9.prev = 3;

          if (!(!id && !name)) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            error: "Please provide a valid ID or name"
          }));

        case 6:
          console.log("id", id);
          console.log("name", name);
          updateQuery = "SELECT * FROM Members m JOIN Users u ON m.id = u.id";
          values = [];
          valueIndex = 1;

          if (id) {
            updateQuery += " WHERE m.id = $".concat(valueIndex);
            values.push(id);
            valueIndex++;
          } //if name is provided and id exists ignore name
          // check if name is similar to any name in the database


          if (name && !id) {
            updateQuery += " WHERE u.name ILIKE $".concat(valueIndex);
            values.push("%".concat(name, "%"));
            valueIndex++;
          }

          _context9.next = 15;
          return regeneratorRuntime.awrap(pool.query(updateQuery, values));

        case 15:
          _ref9 = _context9.sent;
          rows = _ref9.rows;

          if (rows.length > 0) {
            console.log(rows);
            res.json(rows);
          } else {
            res.status(404).json({
              message: "Member not found"
            });
          }

          _context9.next = 24;
          break;

        case 20:
          _context9.prev = 20;
          _context9.t0 = _context9["catch"](3);
          console.error(_context9.t0.message);
          res.status(500).json({
            error: "An error occurred while searching for the member."
          });

        case 24:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[3, 20]]);
}; // Function to get all trainers and their PF sessions


var getAllTrainersWithPF = function getAllTrainersWithPF(req, res) {
  var trainersQuery, _ref10, rows, trainers;

  return regeneratorRuntime.async(function getAllTrainersWithPF$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          // SQL query to fetch trainers with their names from the Users table
          trainersQuery = "\n      SELECT \n        t.id, \n        u.name, \n        t.specialization\n      FROM \n        Trainers t\n      JOIN \n        Users u ON t.id = u.id\n      WHERE \n        u.role = 'trainer';\n    ";
          _context10.next = 4;
          return regeneratorRuntime.awrap(pool.query(trainersQuery));

        case 4:
          _ref10 = _context10.sent;
          rows = _ref10.rows;
          // Formatting the trainers' data for the response
          trainers = rows.map(function (trainer) {
            return {
              id: trainer.id,
              name: trainer.name,
              specialization: trainer.specialization
            };
          });
          res.json(trainers);
          _context10.next = 14;
          break;

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](0);
          console.error("Error fetching trainers:", _context10.t0);
          res.status(500).json({
            error: "An error occurred while retrieving trainers."
          });

        case 14:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getTrainerDetailById = function getTrainerDetailById(req, res) {
  var trainerId, trainerDetailQuery, trainerResult, trainer, formattedTrainer;
  return regeneratorRuntime.async(function getTrainerDetailById$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          trainerId = parseInt(req.params.id); // Get the trainer ID from the request parameters
          // SQL query to fetch the trainer's details from the Trainers and Users tables

          trainerDetailQuery = "\n      SELECT \n        t.id, \n        u.name, \n        t.specialization,\n        t.cost\n      FROM \n        Trainers t\n      JOIN \n        Users u ON t.id = u.id\n      WHERE \n        t.id = $1 AND u.role = 'trainer';\n    "; // Execute the trainer detail query

          _context11.next = 5;
          return regeneratorRuntime.awrap(pool.query(trainerDetailQuery, [trainerId]));

        case 5:
          trainerResult = _context11.sent;

          if (!(trainerResult.rows.length === 0)) {
            _context11.next = 8;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            error: "Trainer not found."
          }));

        case 8:
          // Assuming there's only one match due to ID uniqueness for trainer details
          trainer = trainerResult.rows[0]; // Format the trainer's data for the response

          formattedTrainer = {
            id: trainer.id,
            name: trainer.name,
            specialization: trainer.specialization,
            cost: trainer.cost
          };
          res.json(formattedTrainer);
          _context11.next = 17;
          break;

        case 13:
          _context11.prev = 13;
          _context11.t0 = _context11["catch"](0);
          console.error("Error fetching trainer details:", _context11.t0);
          res.status(500).json({
            error: "An error occurred while retrieving the trainer's details."
          });

        case 17:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var registerCourse = function registerCourse(req, res, next) {
  return regeneratorRuntime.async(function registerCourse$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
        case "end":
          return _context12.stop();
      }
    }
  });
}; // Post
//Add a new user


var register = function register(req, res, next) {
  var _req$body, email, password, name, date_of_birth, role, insertQuery, values, _ref11, rows;

  return regeneratorRuntime.async(function register$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          // Extract user details from request body
          _req$body = req.body, email = _req$body.email, password = _req$body.password, name = _req$body.name, date_of_birth = _req$body.date_of_birth, role = _req$body.role;

          if (!(typeof password !== "string" || !password.trim())) {
            _context13.next = 4;
            break;
          }

          return _context13.abrupt("return", res.status(400).json({
            error: "Invalid password"
          }));

        case 4:
          if (!(typeof email !== "string" || !email.trim())) {
            _context13.next = 6;
            break;
          }

          return _context13.abrupt("return", res.status(400).json({
            error: "Invalid email"
          }));

        case 6:
          if (!(typeof name !== "string" || !name.trim())) {
            _context13.next = 8;
            break;
          }

          return _context13.abrupt("return", res.status(400).json({
            error: "Invalid name"
          }));

        case 8:
          if (!(new Date(date_of_birth).toString() === "Invalid Date")) {
            _context13.next = 10;
            break;
          }

          return _context13.abrupt("return", res.status(400).json({
            error: "Invalid date of birth"
          }));

        case 10:
          // STRECTH GOAL: Hash the password before storing it in the database
          // const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of salting
          // Insert new user into database
          insertQuery = "\n        INSERT INTO Users (email, password, name, date_of_birth, role)\n        VALUES ($1, $2, $3, $4, $5)\n        RETURNING id, email, name, date_of_birth, role, password;\n      ";
          values = [email, password, name, date_of_birth, role];
          _context13.next = 14;
          return regeneratorRuntime.awrap(pool.query(insertQuery, values));

        case 14:
          _ref11 = _context13.sent;
          rows = _ref11.rows;
          // Send success response
          res.status(201).json({
            user: _objectSpread({}, rows[0], {
              has_payment_method: false
            })
          });
          _context13.next = 23;
          break;

        case 19:
          _context13.prev = 19;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          res.status(500).json({
            error: "Could not create new user in the database"
          });

        case 23:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var login = function login(req, res, next) {
  var _req$body2, email, password, _ref12, rows, user;

  return regeneratorRuntime.async(function login$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          // Extract login details from request body
          console.log("req.body", req.body);
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password; //check if email and password are strings

          if (!(typeof email !== "string" || !email.trim())) {
            _context14.next = 5;
            break;
          }

          return _context14.abrupt("return", res.status(400).json({
            error: "Invalid email"
          }));

        case 5:
          if (!(typeof password !== "string" || !password.trim())) {
            _context14.next = 7;
            break;
          }

          return _context14.abrupt("return", res.status(400).json({
            error: "Invalid password"
          }));

        case 7:
          _context14.next = 9;
          return regeneratorRuntime.awrap(pool.query("SELECT * FROM Users WHERE email = $1;", [email]));

        case 9:
          _ref12 = _context14.sent;
          rows = _ref12.rows;

          if (!(rows[0] == undefined)) {
            _context14.next = 14;
            break;
          }

          console.log("User not found");
          return _context14.abrupt("return", res.status(401).json({
            error: "User not found"
          }));

        case 14:
          // Check if the password is correct
          user = rows[0]; // const isPasswordValid = await bcrypt.compare(password, user.password);

          console.log("user", user);

          if (!(password !== user.password)) {
            _context14.next = 18;
            break;
          }

          return _context14.abrupt("return", res.status(401).json({
            error: "Incorrect password"
          }));

        case 18:
          // STRECTH GOAL: Generate a JWT token
          // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          //   expiresIn: "1h",
          // });
          res.status(200).json({
            user: _objectSpread({}, user, {
              has_payment_method: !!user.cc_number
            })
          }); // send user object to be stored in local storage and state

          _context14.next = 25;
          break;

        case 21:
          _context14.prev = 21;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          res.status(500).json({
            error: "Could not log in user"
          });

        case 25:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 21]]);
}; // add payment


var addPayment = function addPayment(req, res, next) {
  var _req$body3, member_id, amount, payment_date, service, amountNum, serviceName, query, _ref13, _rows, memberCheck, queryText, values, _ref14, rows;

  return regeneratorRuntime.async(function addPayment$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          // Destructure payment information from request body
          _req$body3 = req.body, member_id = _req$body3.member_id, amount = _req$body3.amount, payment_date = _req$body3.payment_date, service = _req$body3.service;
          amountNum = parseFloat(amount); // Basic validation

          if (!(typeof member_id !== "number" || member_id <= 0)) {
            _context15.next = 5;
            break;
          }

          return _context15.abrupt("return", res.status(400).json({
            error: "Invalid member ID"
          }));

        case 5:
          if (!(typeof amountNum !== "number" || amount <= 0)) {
            _context15.next = 7;
            break;
          }

          return _context15.abrupt("return", res.status(400).json({
            error: "Invalid amount"
          }));

        case 7:
          if (!(service !== "membership")) {
            _context15.next = 18;
            break;
          }

          query = "SELECT * FROM classes WHERE id = $1";
          _context15.next = 11;
          return regeneratorRuntime.awrap(pool.query(query, [service]));

        case 11:
          _ref13 = _context15.sent;
          _rows = _ref13.rows;

          if (!(_rows.length === 0)) {
            _context15.next = 15;
            break;
          }

          return _context15.abrupt("return", res.status(404).json({
            error: "Class not found."
          }));

        case 15:
          serviceName = _rows[0].type + " fitness class";
          _context15.next = 19;
          break;

        case 18:
          serviceName = "membership";

        case 19:
          _context15.next = 21;
          return regeneratorRuntime.awrap(pool.query("SELECT id FROM Members WHERE id = $1", [member_id]));

        case 21:
          memberCheck = _context15.sent;

          if (!(memberCheck.rows.length === 0)) {
            _context15.next = 24;
            break;
          }

          return _context15.abrupt("return", res.status(400).json({
            error: "Member ID does not exist"
          }));

        case 24:
          // Insert payment information into the database, using parameterized query for security
          // if service is a number, pass it as a number to class_id. if not, pass null
          queryText = "\n      INSERT INTO payments (member_id, amount, service, date, class_id)\n      VALUES ($1, $2, $3, $4, $5)\n      RETURNING *;\n    ";
          values = [member_id, amountNum, serviceName, payment_date];

          if (service !== "membership") {
            values.push(service);
          } else {
            values.push(null);
          }

          _context15.next = 29;
          return regeneratorRuntime.awrap(pool.query(queryText, values));

        case 29:
          _ref14 = _context15.sent;
          rows = _ref14.rows;
          // Respond with the newly created payment entry
          res.status(201).json(rows[0]);
          _context15.next = 38;
          break;

        case 34:
          _context15.prev = 34;
          _context15.t0 = _context15["catch"](0);
          console.error(_context15.t0.message);
          res.status(500).json({
            error: "Could not create payment"
          });

        case 38:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 34]]);
};

var addFitnessGoals = function addFitnessGoals(req, res) {
  var goals, member_id, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, goal, valuesPlaceholder, queryText, _ref15, rows;

  return regeneratorRuntime.async(function addFitnessGoals$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          goals = req.body.goals;
          console.log("req", req);
          member_id = parseInt(req.params.member_id); //add back in memberid

          if (!(typeof member_id !== "number" || member_id <= 0)) {
            _context16.next = 6;
            break;
          }

          return _context16.abrupt("return", res.status(400).json({
            error: "Invalid or missing member ID."
          }));

        case 6:
          if (!(!Array.isArray(goals) || goals.length === 0)) {
            _context16.next = 8;
            break;
          }

          return _context16.abrupt("return", res.status(400).json({
            error: "Invalid or missing goals."
          }));

        case 8:
          // Validate each goal in the array
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context16.prev = 11;
          _iterator = goals[Symbol.iterator]();

        case 13:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context16.next = 20;
            break;
          }

          goal = _step.value;

          if (!(typeof goal !== "string" || !goal.trim())) {
            _context16.next = 17;
            break;
          }

          return _context16.abrupt("return", res.status(400).json({
            error: "Invalid goal."
          }));

        case 17:
          _iteratorNormalCompletion = true;
          _context16.next = 13;
          break;

        case 20:
          _context16.next = 26;
          break;

        case 22:
          _context16.prev = 22;
          _context16.t0 = _context16["catch"](11);
          _didIteratorError = true;
          _iteratorError = _context16.t0;

        case 26:
          _context16.prev = 26;
          _context16.prev = 27;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 29:
          _context16.prev = 29;

          if (!_didIteratorError) {
            _context16.next = 32;
            break;
          }

          throw _iteratorError;

        case 32:
          return _context16.finish(29);

        case 33:
          return _context16.finish(26);

        case 34:
          // Inserting the new fitness goal into the database
          valuesPlaceholder = goals.map(function (_, index) {
            return "(".concat(member_id, ", $").concat(index + 1, ")");
          }).join(",");
          queryText = "INSERT INTO fitness_goals (member_id, goal) VALUES ".concat(valuesPlaceholder, " RETURNING *;");
          _context16.next = 38;
          return regeneratorRuntime.awrap(pool.query(queryText, goals));

        case 38:
          _ref15 = _context16.sent;
          rows = _ref15.rows;

          if (!(rows.length === 0)) {
            _context16.next = 42;
            break;
          }

          return _context16.abrupt("return", res.status(404).json({
            error: "Could not add the fitness goal."
          }));

        case 42:
          res.status(201).json(rows); // Send the newly created fitness goal

          _context16.next = 49;
          break;

        case 45:
          _context16.prev = 45;
          _context16.t1 = _context16["catch"](0);
          console.error(_context16.t1);
          res.status(500).json({
            error: "Could not add the fitness goal to the database."
          });

        case 49:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 45], [11, 22, 26, 34], [27,, 29, 33]]);
}; //put
//update members


var updateMember = function updateMember(req, res, next) {
  var member_id, _req$body4, weight, height, muscle_mass, body_fat, updateQuery, values, valueIndex, _ref16, rows;

  return regeneratorRuntime.async(function updateMember$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          member_id = parseInt(req.params.member_id); // Convert the member ID from string to integer
          // Validate that the provided ID is a number

          if (!isNaN(member_id)) {
            _context17.next = 4;
            break;
          }

          return _context17.abrupt("return", res.status(400).json({
            error: "Invalid member ID provided."
          }));

        case 4:
          // Extract member details from request body
          _req$body4 = req.body, weight = _req$body4.weight, height = _req$body4.height, muscle_mass = _req$body4.muscle_mass, body_fat = _req$body4.body_fat;
          console.log("req.body", req.body); //DEPENDING ON WHICH FIELDS ARE PASSED IN, UPDATE THE CORRESPONDING FIELDS

          updateQuery = "UPDATE Members SET ";
          values = [];
          valueIndex = 1;

          if (weight) {
            console.log("weight", weight);
            updateQuery += "weight = $".concat(valueIndex, ", ");
            values.push(weight);
            valueIndex++;
          }

          if (height) {
            updateQuery += "height = $".concat(valueIndex, ", ");
            values.push(height);
            valueIndex++;
          }

          if (muscle_mass) {
            updateQuery += "muscle_mass = $".concat(valueIndex, ", ");
            values.push(muscle_mass);
            valueIndex++;
          }

          if (body_fat) {
            updateQuery += "body_fat = $".concat(valueIndex, ", ");
            values.push(body_fat);
            valueIndex++;
          } // Remove the trailing comma and space


          updateQuery = updateQuery.slice(0, -2); // Add the WHERE clause to update the correct member

          updateQuery += " WHERE id = $".concat(valueIndex, " RETURNING *;");
          values.push(member_id);
          console.log("updateQuery", updateQuery); // Update the member in the database

          _context17.next = 19;
          return regeneratorRuntime.awrap(pool.query(updateQuery, values));

        case 19:
          _ref16 = _context17.sent;
          rows = _ref16.rows;

          if (!(rows.length === 0)) {
            _context17.next = 23;
            break;
          }

          return _context17.abrupt("return", res.status(404).json({
            error: "Member not found."
          }));

        case 23:
          res.json(rows[0]); // Send the updated member

          _context17.next = 30;
          break;

        case 26:
          _context17.prev = 26;
          _context17.t0 = _context17["catch"](0);
          console.error(_context17.t0.message);
          res.status(500).json({
            error: "An error occurred while updating the member."
          });

        case 30:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

var updateMemberPaymentInfo = function updateMemberPaymentInfo(req, res, next) {
  var member_id, _req$body5, cardNumber, ccv, expiryDate, updateQuery, values, _ref17, rows;

  return regeneratorRuntime.async(function updateMemberPaymentInfo$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          console.log("req.body", req.body);
          member_id = parseInt(req.params.member_id); // Convert the member ID from string to integer
          // Validate that the provided ID is a number

          if (!isNaN(member_id)) {
            _context18.next = 5;
            break;
          }

          return _context18.abrupt("return", res.status(400).json({
            error: "Invalid member ID provided."
          }));

        case 5:
          // Extract member details from request body
          _req$body5 = req.body, cardNumber = _req$body5.cardNumber, ccv = _req$body5.ccv, expiryDate = _req$body5.expiryDate; // Update the member in the database

          updateQuery = "\n        UPDATE Members\n        SET cc_number = $1, cc_expiry_date = $2, ccv = $3\n        WHERE id = $4\n        RETURNING *;\n      ";
          values = [cardNumber, expiryDate, ccv, member_id];
          _context18.next = 10;
          return regeneratorRuntime.awrap(pool.query(updateQuery, values));

        case 10:
          _ref17 = _context18.sent;
          rows = _ref17.rows;

          if (!(rows.length === 0)) {
            _context18.next = 14;
            break;
          }

          return _context18.abrupt("return", res.status(404).json({
            error: "Member not found."
          }));

        case 14:
          res.json(rows[0]); // Send the updated member

          _context18.next = 21;
          break;

        case 17:
          _context18.prev = 17;
          _context18.t0 = _context18["catch"](0);
          console.error(_context18.t0.message);
          res.status(500).json({
            error: "An error occurred while updating the member."
          });

        case 21:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

var updateUser = function updateUser(req, res, next) {
  var userId, _req$body6, name, email, password, date_of_birth, updateQuery, values, _ref18, rows;

  return regeneratorRuntime.async(function updateUser$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          userId = parseInt(req.params.id); // Convert the user ID from string to integer
          // Validate that the provided ID is a number

          if (!isNaN(userId)) {
            _context19.next = 4;
            break;
          }

          return _context19.abrupt("return", res.status(400).json({
            error: "Invalid user ID provided."
          }));

        case 4:
          // Extract user details from request body
          _req$body6 = req.body, name = _req$body6.name, email = _req$body6.email, password = _req$body6.password, date_of_birth = _req$body6.date_of_birth; // Update the user in the database

          updateQuery = "\n        UPDATE Users\n        SET email = $1, name = $2, date_of_birth = $3, password = $4\n        WHERE id = $5\n        RETURNING *;\n      ";
          values = [email, name, date_of_birth, password, userId];
          _context19.next = 9;
          return regeneratorRuntime.awrap(pool.query(updateQuery, values));

        case 9:
          _ref18 = _context19.sent;
          rows = _ref18.rows;

          if (!(rows.length === 0)) {
            _context19.next = 13;
            break;
          }

          return _context19.abrupt("return", res.status(404).json({
            error: "User not found."
          }));

        case 13:
          res.json(rows[0]); // Send the updated user

          _context19.next = 20;
          break;

        case 16:
          _context19.prev = 16;
          _context19.t0 = _context19["catch"](0);
          console.error(_context19.t0.message);
          res.status(500).json({
            error: "An error occurred while updating the user."
          });

        case 20:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var registerPersonalTraining = function registerPersonalTraining(req, res) {
  var _req$body7, userId, slots, duration, trainerId, trainerQuery, trainerResult, trainer, totalCost, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, slot, slotParts, dayOfWeek, day, startTime, startTimeDate, endTime, name, description, queryText, values, classResult, classId, insertClassMemberQuery;

  return regeneratorRuntime.async(function registerPersonalTraining$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _req$body7 = req.body, userId = _req$body7.userId, slots = _req$body7.slots, duration = _req$body7.duration;
          trainerId = parseInt(req.params.id, 10);
          _context20.prev = 2;
          // Fetch the trainer's hourly rate and name from the Trainers table
          // by joining with the Users table
          trainerQuery = "\n      SELECT Users.name, Trainers.cost \n      FROM Trainers \n      INNER JOIN Users ON Trainers.id = Users.id \n      WHERE Trainers.id = $1\n    ";
          _context20.next = 6;
          return regeneratorRuntime.awrap(pool.query(trainerQuery, [trainerId]));

        case 6:
          trainerResult = _context20.sent;

          if (!(trainerResult.rows.length === 0)) {
            _context20.next = 9;
            break;
          }

          return _context20.abrupt("return", res.status(404).json({
            error: "Trainer not found."
          }));

        case 9:
          trainer = trainerResult.rows[0];
          totalCost = trainer.cost * parseInt(duration, 10); // Calculate total cost based on duration

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context20.prev = 14;
          _iterator2 = slots[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context20.next = 41;
            break;
          }

          slot = _step2.value;
          slotParts = slot.slotKey.split("-");
          dayOfWeek = slotParts[0];
          day = dayMappings[dayOfWeek]; // Convert weekday name to int

          if (day) {
            _context20.next = 23;
            break;
          }

          throw new Error("Invalid dayOfWeek '".concat(dayOfWeek, "' received in slotKey '").concat(slot.slotKey, "'"));

        case 23:
          startTime = slot.startTime;
          startTimeDate = new Date("1970-01-01T".concat(startTime, "Z"));
          startTimeDate.setHours(startTimeDate.getHours() + parseInt(duration, 10));
          endTime = startTimeDate.toISOString().substr(11, 5);
          name = "".concat(req.body.userName, " and ").concat(trainer.name, " personal");
          description = "Personal training session with ".concat(trainer.name);
          queryText = "\n        INSERT INTO Classes (name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id, approval_status)\n        VALUES ($1, $2, $3, $4, $5, $6, $7, 1, 'personal', 1, false)\n        RETURNING id\n      ";
          values = [name, description, trainerId, startTime, endTime, day, totalCost]; // Insert class and capture the returned class ID

          _context20.next = 33;
          return regeneratorRuntime.awrap(pool.query(queryText, values));

        case 33:
          classResult = _context20.sent;
          classId = classResult.rows[0].id; // Insert record into Classes_Members

          insertClassMemberQuery = "\n        INSERT INTO Classes_Members (class_id, member_id)\n        VALUES ($1, $2)\n      ";
          _context20.next = 38;
          return regeneratorRuntime.awrap(pool.query(insertClassMemberQuery, [classId, userId]));

        case 38:
          _iteratorNormalCompletion2 = true;
          _context20.next = 16;
          break;

        case 41:
          _context20.next = 47;
          break;

        case 43:
          _context20.prev = 43;
          _context20.t0 = _context20["catch"](14);
          _didIteratorError2 = true;
          _iteratorError2 = _context20.t0;

        case 47:
          _context20.prev = 47;
          _context20.prev = 48;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 50:
          _context20.prev = 50;

          if (!_didIteratorError2) {
            _context20.next = 53;
            break;
          }

          throw _iteratorError2;

        case 53:
          return _context20.finish(50);

        case 54:
          return _context20.finish(47);

        case 55:
          res.status(200).json({
            message: "Registration successful"
          });
          _context20.next = 62;
          break;

        case 58:
          _context20.prev = 58;
          _context20.t1 = _context20["catch"](2);
          console.error("Registration failed:", _context20.t1);
          res.status(500).json({
            error: "Failed to process registration: " + _context20.t1.message
          });

        case 62:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[2, 58], [14, 43, 47, 55], [48,, 50, 54]]);
};

var getRooms = function getRooms(req, res) {
  var roomsQuery, roomsResult;
  return regeneratorRuntime.async(function getRooms$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          roomsQuery = "SELECT id, name, description FROM Rooms;";
          _context21.next = 4;
          return regeneratorRuntime.awrap(pool.query(roomsQuery));

        case 4:
          roomsResult = _context21.sent;
          res.status(200).json(roomsResult.rows);
          _context21.next = 12;
          break;

        case 8:
          _context21.prev = 8;
          _context21.t0 = _context21["catch"](0);
          console.error("Failed to fetch rooms:", _context21.t0);
          res.status(500).json({
            error: "Failed to fetch rooms"
          });

        case 12:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getTrainerSchedule = function getTrainerSchedule(req, res) {
  var trainerId, scheduleQuery, scheduleResult;
  return regeneratorRuntime.async(function getTrainerSchedule$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          trainerId = parseInt(req.params.id); // Assuming the ID is passed as a URL parameter

          _context22.prev = 1;
          scheduleQuery = "\n      SELECT day, start_time, end_time\n      FROM Schedule\n      WHERE trainer_id = $1;\n    ";
          _context22.next = 5;
          return regeneratorRuntime.awrap(pool.query(scheduleQuery, [trainerId]));

        case 5:
          scheduleResult = _context22.sent;
          res.status(200).json(scheduleResult.rows);
          _context22.next = 13;
          break;

        case 9:
          _context22.prev = 9;
          _context22.t0 = _context22["catch"](1);
          console.error("Failed to fetch schedule for trainer ".concat(trainerId, ":"), _context22.t0);
          res.status(500).json({
            error: "Failed to fetch schedule for trainer ".concat(trainerId)
          });

        case 13:
        case "end":
          return _context22.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

var createClassSession = function createClassSession(req, res) {
  var _req$body8, name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id, approval_status, query, _ref19, rows;

  return regeneratorRuntime.async(function createClassSession$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _req$body8 = req.body, name = _req$body8.name, description = _req$body8.description, trainer_id = _req$body8.trainer_id, start_time = _req$body8.start_time, end_time = _req$body8.end_time, day = _req$body8.day, cost = _req$body8.cost, capacity = _req$body8.capacity, type = _req$body8.type, room_id = _req$body8.room_id, approval_status = _req$body8.approval_status;
          console.log("Received class session details:", req.body);
          _context23.prev = 2;
          query = "\n      INSERT INTO Classes (name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id, approval_status)\n      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)\n      RETURNING *;\n    ";
          _context23.next = 6;
          return regeneratorRuntime.awrap(pool.query(query, [name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id, approval_status]));

        case 6:
          _ref19 = _context23.sent;
          rows = _ref19.rows;
          res.status(201).json(rows[0]);
          _context23.next = 17;
          break;

        case 11:
          _context23.prev = 11;
          _context23.t0 = _context23["catch"](2);
          console.error("Error creating new class:", _context23.t0);

          if (!(_context23.t0.code === "P0001")) {
            _context23.next = 16;
            break;
          }

          return _context23.abrupt("return", res.status(500).send(_context23.t0.message));

        case 16:
          res.status(500).send("Server error while creating a new class.");

        case 17:
        case "end":
          return _context23.stop();
      }
    }
  }, null, null, [[2, 11]]);
};

module.exports = {
  getUserById: getUserById,
  getMemberById: getMemberById,
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
  getTrainerDetailById: getTrainerDetailById,
  registerPersonalTraining: registerPersonalTraining,
  getRooms: getRooms,
  getTrainerSchedule: getTrainerSchedule,
  createClassSession: createClassSession
};