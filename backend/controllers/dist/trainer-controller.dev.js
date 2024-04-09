"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var pool = require("../db");

var getTrainerSchedule = function getTrainerSchedule(req, res, next) {
  var trainerId, query, _ref, rows;

  return regeneratorRuntime.async(function getTrainerSchedule$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          trainerId = parseInt(req.params.id);
          query = "\n          SELECT * FROM Schedule \n          WHERE trainer_id = $1;\n        ";
          _context.next = 5;
          return regeneratorRuntime.awrap(pool.query(query, [trainerId]));

        case 5:
          _ref = _context.sent;
          rows = _ref.rows;
          res.json(rows);
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).send("Server error while retrieving trainer schedule.");

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getAllValidTrainers = function getAllValidTrainers(req, res, next) {
  var queryText, _ref2, rows;

  return regeneratorRuntime.async(function getAllValidTrainers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // Query to select trainers with both specialization and cost defined
          queryText = "\n      SELECT t.id, u.name, t.specialization, t.cost\n      FROM Trainers t\n      INNER JOIN Users u ON t.id = u.id\n      WHERE t.specialization IS NOT NULL AND t.cost IS NOT NULL;\n    "; // Execute query

          _context2.next = 4;
          return regeneratorRuntime.awrap(pool.query(queryText));

        case 4:
          _ref2 = _context2.sent;
          rows = _ref2.rows;
          // Send response back with trainers
          res.status(200).json({
            status: 'success',
            data: {
              trainers: rows
            }
          });
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          // Log and forward the error if any
          console.error(_context2.t0.message);
          next(_context2.t0);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getTrainerAvailableTimeSlots = function getTrainerAvailableTimeSlots(req, res, next) {
  var trainerId, query, _ref3, scheduleTime, query2, _ref4, classTime, availableTimeSlots, _loop, i;

  return regeneratorRuntime.async(function getTrainerAvailableTimeSlots$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          trainerId = parseInt(req.params.id);
          query = "\n          SELECT * FROM Schedule \n          WHERE trainer_id = $1;\n        ";
          _context3.next = 5;
          return regeneratorRuntime.awrap(pool.query(query, [trainerId]));

        case 5:
          _ref3 = _context3.sent;
          scheduleTime = _ref3.rows;
          query2 = "\n          SELECT start_time, end_time, day FROM Classes\n          WHERE trainer_id = $1;\n        ";
          _context3.next = 10;
          return regeneratorRuntime.awrap(pool.query(query2, [trainerId]));

        case 10:
          _ref4 = _context3.sent;
          classTime = _ref4.rows;
          availableTimeSlots = [];

          _loop = function _loop(i) {
            var schedule = scheduleTime.find(function (schedule) {
              return schedule.day === i;
            });
            var classes = classTime.filter(function (classTime) {
              return classTime.day === i;
            });

            if (!schedule) {
              availableTimeSlots.push({
                day: i,
                timeSlots: [{
                  start: 0,
                  end: 24
                }]
              });
            } else {
              availableTimeSlots.push({
                day: i,
                timeSlots: []
              });
              var start = schedule.start_time;
              var end = schedule.end_time;
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = classes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var _classTime = _step.value;

                  if (_classTime.start_time >= start && _classTime.start_time < end) {
                    availableTimeSlots[i].timeSlots.push({
                      start: start,
                      end: _classTime.start_time
                    });
                  }

                  start = _classTime.end_time;
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                    _iterator["return"]();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              if (start < end) {
                availableTimeSlots[i].timeSlots.push({
                  start: start,
                  end: end
                });
              }
            }
          };

          for (i = 0; i < 7; i++) {
            _loop(i);
          }

          console.log(availableTimeSlots);
          res.json(availableTimeSlots);
          _context3.next = 23;
          break;

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).send("Server error while retrieving trainer schedule.");

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var updateTrainerSchedule = function updateTrainerSchedule(req, res, next) {
  var _req$body, start_time, end_time, trainerId, day, query, _ref5, rowCount;

  return regeneratorRuntime.async(function updateTrainerSchedule$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, start_time = _req$body.start_time, end_time = _req$body.end_time;
          trainerId = parseInt(req.params.id);
          day = parseInt(req.body.day); // Ensure 'day' is parsed as an integer if it's not already

          _context4.prev = 3;
          query = "\n        UPDATE Schedule\n        SET start_time = $1, end_time = $2\n        WHERE trainer_id = $3 AND day = $4;\n      ";
          _context4.next = 7;
          return regeneratorRuntime.awrap(pool.query(query, [start_time, end_time, trainerId, day]));

        case 7:
          _ref5 = _context4.sent;
          rowCount = _ref5.rowCount;

          if (rowCount > 0) {
            res.send("Schedule updated successfully.");
          } else {
            res.status(404).send("Schedule not found.");
          }

          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](3);
          console.error(_context4.t0);
          res.status(500).send("Failed to update the schedule.");

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[3, 12]]);
};

var getTrainerCourses = function getTrainerCourses(req, res, next) {
  var trainerId, query, _ref6, rows;

  return regeneratorRuntime.async(function getTrainerCourses$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          trainerId = parseInt(req.params.id);
          query = "\n          SELECT * FROM Classes\n          WHERE trainer_id = $1;\n        ";
          _context5.next = 5;
          return regeneratorRuntime.awrap(pool.query(query, [trainerId]));

        case 5:
          _ref6 = _context5.sent;
          rows = _ref6.rows;
          res.json(rows);
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(500).send("Server error while retrieving trainer courses.");

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var updateTrainer = function updateTrainer(req, res, next) {
  var id, _req$body2, specialization, cost, query, _ref7, rows;

  return regeneratorRuntime.async(function updateTrainer$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = parseInt(req.params.id);
          _context6.prev = 1;
          _req$body2 = req.body, specialization = _req$body2.specialization, cost = _req$body2.cost;
          query = "\n      UPDATE Trainers\n      SET specialization = $1, cost = $2\n      WHERE id = $3\n      RETURNING *;\n    ";
          _context6.next = 6;
          return regeneratorRuntime.awrap(pool.query(query, [specialization, cost, id]));

        case 6:
          _ref7 = _context6.sent;
          rows = _ref7.rows;

          if (rows.length == 0) {
            res.status(404).send("Trainer not found");
          }

          res.status(200).json(rows[0]);
          _context6.next = 16;
          break;

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](1);
          console.error(_context6.t0);
          res.status(500).send("Failed to update trainer.");

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 12]]);
};

var addTrainerSchedule = function addTrainerSchedule(req, res, next) {
  var scheduledHours, trainerId, i, query;
  return regeneratorRuntime.async(function addTrainerSchedule$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          scheduledHours = req.body.scheduledHours;
          trainerId = parseInt(req.params.id);
          _context7.prev = 2;
          i = 0;

        case 4:
          if (!(i < scheduledHours.length)) {
            _context7.next = 12;
            break;
          }

          if (!scheduledHours[i]) {
            _context7.next = 9;
            break;
          }

          query = "\n        INSERT INTO Schedule (trainer_id, day, start_time, end_time)\n        VALUES ($1, $2, $3, $4)\n        ;";
          _context7.next = 9;
          return regeneratorRuntime.awrap(pool.query(query, [trainerId, i, scheduledHours[i].start_time, scheduledHours[i].end_time]));

        case 9:
          i++;
          _context7.next = 4;
          break;

        case 12:
          res.status(200).send("Schedule added successfully.");
          _context7.next = 19;
          break;

        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](2);
          console.error(_context7.t0);
          res.status(500).send("Failed to add the schedule.");

        case 19:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 15]]);
};

var updateOrInsertSchedule = function updateOrInsertSchedule(req, res) {
  var trainerId, _req$body3, startTime, endTime, day, timeToMinutes, classQuery, classResult, classes, startMinutes, endMinutes, hasConflict, updateQuery, insertQuery, updateResult, insertResult;

  return regeneratorRuntime.async(function updateOrInsertSchedule$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          trainerId = req.params.trainerId;
          _req$body3 = req.body, startTime = _req$body3.startTime, endTime = _req$body3.endTime, day = _req$body3.day; // Assuming day is sent in the request

          console.log("Received schedule for trainer ".concat(trainerId, " - Day: ").concat(day, ", Start: ").concat(startTime, ", End: ").concat(endTime));

          timeToMinutes = function timeToMinutes(time) {
            var _time$split$map = time.split(':').map(Number),
                _time$split$map2 = _slicedToArray(_time$split$map, 2),
                hours = _time$split$map2[0],
                minutes = _time$split$map2[1];

            return hours * 60 + minutes;
          };

          _context8.prev = 4;
          classQuery = "\n      SELECT start_time, end_time\n      FROM Classes\n      WHERE trainer_id = $1 AND approval_status = true AND day = $2;\n    ";
          _context8.next = 8;
          return regeneratorRuntime.awrap(pool.query(classQuery, [trainerId, day]));

        case 8:
          classResult = _context8.sent;
          classes = classResult.rows;
          console.log("Fetched ".concat(classes.length, " classes for conflict check."));
          startMinutes = timeToMinutes(startTime);
          endMinutes = timeToMinutes(endTime);
          console.log("Schedule times in minutes - Start: ".concat(startMinutes, ", End: ").concat(endMinutes));
          hasConflict = classes.some(function (classItem) {
            var classStartMinutes = timeToMinutes(classItem.start_time);
            var classEndMinutes = timeToMinutes(classItem.end_time);
            console.log("Checking against class - Start: ".concat(classStartMinutes, ", End: ").concat(classEndMinutes));
            var conflict = startMinutes >= classStartMinutes || endMinutes <= classEndMinutes;
            console.log("Conflict: ".concat(conflict));
            return conflict;
          });
          console.log("Conflict check result: ".concat(hasConflict));

          if (!hasConflict) {
            _context8.next = 18;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            message: 'Schedule conflicts with an existing class.'
          }));

        case 18:
          updateQuery = "\n      UPDATE Schedule\n      SET start_time = $1, end_time = $2\n      WHERE trainer_id = $3 AND day = $4;\n    ";
          insertQuery = "\n      INSERT INTO Schedule (trainer_id, day, start_time, end_time)\n      SELECT $1, $2, $3, $4\n      WHERE NOT EXISTS (\n        SELECT 1 FROM Schedule WHERE trainer_id = $1 AND day = $2\n      );\n    ";
          _context8.next = 22;
          return regeneratorRuntime.awrap(pool.query(updateQuery, [startTime, endTime, trainerId, day]));

        case 22:
          updateResult = _context8.sent;

          if (!(updateResult.rowCount === 0)) {
            _context8.next = 30;
            break;
          }

          _context8.next = 26;
          return regeneratorRuntime.awrap(pool.query(insertQuery, [trainerId, day, startTime, endTime]));

        case 26:
          insertResult = _context8.sent;
          console.log("Insert result:", insertResult);
          _context8.next = 31;
          break;

        case 30:
          console.log("Update result:", updateResult);

        case 31:
          res.status(200).json({
            message: 'Schedule updated successfully'
          });
          _context8.next = 38;
          break;

        case 34:
          _context8.prev = 34;
          _context8.t0 = _context8["catch"](4);
          console.error("Failed to update schedule for trainer ".concat(trainerId, ":"), _context8.t0);
          res.status(500).json({
            error: "Failed to update schedule for trainer ".concat(trainerId)
          });

        case 38:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[4, 34]]);
};

var getApprovedClasses = function getApprovedClasses(req, res) {
  var trainerId, query, result;
  return regeneratorRuntime.async(function getApprovedClasses$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log("getApprovedClasses");
          trainerId = parseInt(req.params.trainerId);

          if (!isNaN(trainerId)) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            error: "Invalid trainer ID provided."
          }));

        case 4:
          _context9.prev = 4;
          query = "\n      SELECT \n        name, \n        description, \n        start_time, \n        end_time, \n        CASE day\n          WHEN 1 THEN 'Monday'\n          WHEN 2 THEN 'Tuesday'\n          WHEN 3 THEN 'Wednesday'\n          WHEN 4 THEN 'Thursday'\n          WHEN 5 THEN 'Friday'\n          WHEN 6 THEN 'Saturday'\n          WHEN 7 THEN 'Sunday'\n        END AS day,\n        room_id\n      FROM Classes\n      WHERE trainer_id = $1 AND approval_status = true;\n    ";
          _context9.next = 8;
          return regeneratorRuntime.awrap(pool.query(query, [trainerId]));

        case 8:
          result = _context9.sent;
          //console.log(result);
          res.status(200).json(result.rows);
          _context9.next = 16;
          break;

        case 12:
          _context9.prev = 12;
          _context9.t0 = _context9["catch"](4);
          console.error("Failed to fetch approved classes for trainer ".concat(trainerId, ":"), _context9.t0);
          res.status(500).json({
            error: "Failed to fetch approved classes for trainer ".concat(trainerId)
          });

        case 16:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[4, 12]]);
};

var getTrainerDetails = function getTrainerDetails(req, res, next) {
  var trainerId, query, _ref8, rows;

  return regeneratorRuntime.async(function getTrainerDetails$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          trainerId = parseInt(req.params.id);
          query = "\n      SELECT specialization, cost FROM Trainers\n      WHERE id = $1;\n    ";
          _context10.next = 5;
          return regeneratorRuntime.awrap(pool.query(query, [trainerId]));

        case 5:
          _ref8 = _context10.sent;
          rows = _ref8.rows;

          if (!(rows.length === 0)) {
            _context10.next = 9;
            break;
          }

          return _context10.abrupt("return", res.status(404).send('Trainer not found.'));

        case 9:
          res.json(rows[0]);
          _context10.next = 16;
          break;

        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          res.status(500).send('Server error while retrieving trainer details.');

        case 16:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getWorkingHours = function getWorkingHours(req, res) {
  var trainerId, query, _ref9, rows;

  return regeneratorRuntime.async(function getWorkingHours$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          trainerId = parseInt(req.params.trainer_id);
          query = "\n      SELECT day, start_time, end_time FROM Schedule\n      WHERE trainer_id = $1;\n    ";
          _context11.next = 5;
          return regeneratorRuntime.awrap(pool.query(query, [trainerId]));

        case 5:
          _ref9 = _context11.sent;
          rows = _ref9.rows;
          res.json(rows);
          _context11.next = 14;
          break;

        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          res.status(500).send('Server error while retrieving working hours.');

        case 14:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  getTrainerSchedule: getTrainerSchedule,
  getAllValidTrainers: getAllValidTrainers,
  updateTrainerSchedule: updateTrainerSchedule,
  getTrainerCourses: getTrainerCourses,
  getTrainerAvailableTimeSlots: getTrainerAvailableTimeSlots,
  getApprovedClasses: getApprovedClasses,
  updateOrInsertSchedule: updateOrInsertSchedule,
  addTrainerSchedule: addTrainerSchedule,
  updateTrainer: updateTrainer,
  getTrainerDetails: getTrainerDetails,
  getWorkingHours: getWorkingHours
};