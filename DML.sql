-- Insert Users
-- Trainers
INSERT INTO Users (password, email, name, date_of_birth, role) VALUES
('trainerpass1', 'john.doe@example.com', 'John Doe', '1980-01-01', 'trainer'),
('trainerpass2', 'jane.smith@example.com', 'Jane Smith', '1982-02-01', 'trainer');

-- Members and Admin
INSERT INTO Users (password, email, name, date_of_birth, role) VALUES
('memberpass1', 'alice.wonder@example.com', 'Alice Wonder', '1990-03-01', 'member'),
('memberpass2', 'bob.marley@example.com', 'Bob Marley', '1988-04-01', 'member'),
('adminpass123', 'admin@example.com', 'Admin User', '1980-05-01', 'admin');

-- Update specialization and cost for each trainer
UPDATE Trainers SET specialization = 'Yoga', cost = 50 WHERE id = 1;
UPDATE Trainers SET specialization = 'Cardio', cost = 45 WHERE id = 2;

-- Update details for Alice Wonder
UPDATE Members
SET weight = 65, 
    height = 165, 
    muscle_mass = 30, 
    body_fat = 20, 
    cc_number = '1111222233334444', 
    ccv = 123, -- Example CCV
    cc_expiry_date = '2025-12-31' 
WHERE id = 3;

-- Update details for Bob Marley
UPDATE Members
SET weight = 80, 
    height = 175, 
    muscle_mass = 25, 
    body_fat = 15, 
    cc_number = '4444333322221111', 
    ccv = 321,
    cc_expiry_date = '2026-11-30' 
WHERE id = 4;


-- Insert Rooms
INSERT INTO Rooms (name, description, capacity) VALUES
('Yoga Studio', 'A peaceful space for yoga classes', 15),
('Cardio Room', 'Equipped with state-of-the-art cardio machines', 20);

-- Insert Schedules for trainers
INSERT INTO Schedule (trainer_id, day, start_time, end_time) VALUES
(1, 1, '09:00', '17:00'), -- Monday
(1, 2, '09:00', '17:00'), -- Tuesday
(1, 3, '09:00', '17:00'), -- Wednesday
(2, 4, '09:00', '17:00'), -- Thursday
(2, 5, '09:00', '17:00'); -- Friday

-- Insert Yoga Class with John Doe
INSERT INTO Classes (name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id, approval_status)
VALUES ('Morning Yoga', 'Start your day with energizing yoga', 1, '09:30', '10:30', 1, 50, 15, 'group', 1, true);

-- Insert Cardio Class with Jane Smith
INSERT INTO Classes (name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id, approval_status)
VALUES ('Evening Cardio Blast', 'High intensity cardio to end your day strong', 2, '13:00', '14:00', 4, 45, 20, 'group', 2, false);

-- Insert a personal training class with John Doe and Alice Wonder
INSERT INTO Classes (name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id, approval_status)
VALUES ('Personal Yoga Session', 'Tailored yoga session for individual needs', 1, '11:00', '12:00', 2, 70, 1, 'personal', 1, true);

-- Insert Memberships and Payments (assuming member IDs are 3 and 4)
INSERT INTO Classes_Members (class_id, member_id, isPaymentProcessed) VALUES
(1, 3, TRUE),
(2, 4, TRUE);

-- Payment for Alice Wonder's Yoga Class
INSERT INTO Payments (member_id, class_id, amount, date, service, completion_status) 
VALUES (3, 1, 50, '2023-04-05', 'personal fitness class', TRUE);

-- Payment for Bob Marley's Cardio Class
INSERT INTO Payments (member_id, class_id, amount, date, service, completion_status) 
VALUES (4, 2, 45, '2023-04-05', 'group fitness class', TRUE);


-- Fitness Goals for members
INSERT INTO Fitness_Goals (member_id, goal, completion_date, status) VALUES
(3, 'Improve flexibility', '2023-12-01', FALSE),
(4, 'Increase stamina', '2023-11-01', FALSE);

-- Equipment for classes
INSERT INTO Equipment (name, description, status) VALUES
('Yoga Mats', 'High-quality yoga mats for class participants', 'available'),
('Treadmill', 'Latest model treadmills for cardio workouts', 'available');

