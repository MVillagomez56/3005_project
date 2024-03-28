
----DML.sql

-- Initialise an admin, a member and a trainer

INSERT INTO Users (password, email, name, date_of_birth, role)
VALUES ('admin', 'admin@mail.com', 'admin', '1990-01-01', 'admin');

INSERT INTO Users (password, email, name, date_of_birth, role)
VALUES ('member', 'member@mail.com', 'member', '2003-12-18', 'member');

INSERT INTO Users (password, email, name, date_of_birth, role)
VALUES ('trainer', 'trainer@mail.com', 'trainer', '1995-01-01', 'trainer');

-- create 2 rooms
INSERT INTO Rooms (name, description, capacity)
VALUES ('Room 1', 'Room 1', 10);

INSERT INTO Rooms (name, description, capacity)
VALUES ('Room 2', 'Room 2', 20);

-- create 2 classes
INSERT INTO Classes (name, description, trainer_id, duration, cost, capacity, type, room_id)
VALUES ('Class 1', 'Class 1', 3, '[2021-01-01 9:00, 2021-01-01 10:00]', 10, 10, 'group', 1);

<<<<<<< HEAD
-- this class should not be created because the trainer is not available
INSERT INTO Classes (name, description, trainer_id, duration, cost, capacity, type, room_id)
VALUES ('Class 2', 'Class 2', 3, '[2021-01-01 9:00, 2021-01-01 10:00]', 10, 10, 'group', 2);
=======
-- -- this class should not be created because the trainer is not available
-- INSERT INTO Classes (name, description, trainer_id, duration, cost, capacity, type, room_id)
-- VALUES ('Class 2', 'Class 2', 3, '[2021-01-01 9:00, 2021-01-01 10:00]', 10, 10, 'group', 2);
>>>>>>> 7d8605674b909fc582c7265d06ac77dc1647624b

-- create a personal fitness class
INSERT INTO Classes (name, description, trainer_id, duration, cost, capacity, type, room_id)
VALUES ('Class 3', 'Class 3', 3, '[2021-01-01 11:00, 2021-01-01 12:00]', 10, 10, 'personal', 1);

-- update classes_members for the personal fitness class
INSERT INTO Classes_Members (class_id, member_id)
VALUES (3, 2);


-- create a fitness goal
INSERT INTO Fitness_Goals (member_id, goal, completion_date, status)
VALUES (2, 'lose weight', '2021-12-31', FALSE);



-- create a payment
INSERT INTO Payments (member_id, amount, date, service)
VALUES (2, 10, '2021-01-01', 'membership');

-- create an equipment
INSERT INTO Equipment (name, description)
VALUES ('Treadmill', 'Treadmill');

