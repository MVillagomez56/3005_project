-- Insert Users
INSERT INTO Users (password, email, name, date_of_birth, role) VALUES
('password1', 'admin@example.com', 'Admin User', '1980-01-01', 'admin'),
('password2', 'member@example.com', 'Member User', '1990-02-02', 'member'),
('password3', 'trainer@example.com', 'Trainer User', '1985-03-03', 'trainer'),
('password4', 'admin1@example.com', 'Admin User4', '1980-02-01', 'admin'),
('password5', 'member1@example.com', 'Member User5', '1990-03-02', 'member'),
('password6', 'trainer1@example.com', 'Trainer User6', '1985-04-03', 'trainer'),
('password7', 'member2@example.com', 'Member User7', '1999-09-03', 'member');

UPDATE Members SET weight = 75, height = 180, muscle_mass = 32, body_fat = 15 WHERE id = 2;
UPDATE Members SET weight = 65, height = 170, muscle_mass = 28, body_fat = 20 WHERE id = 5;
UPDATE Members SET weight = 85, height = 175, muscle_mass = 35, body_fat = 10 WHERE id = 7;



INSERT INTO Rooms (name, description, capacity) VALUES
('Yoga Studio', 'A serene space for yoga classes, equipped with mats and mirrors.', 20),
('Cardio Zone', 'Features the latest in treadmills, ellipticals, and stationary bikes.', 15),
('Weight Room', 'Contains free weights, bench presses, and squat racks for strength training.', 25),
('Aerobics Hall', 'Spacious area for aerobics, dance classes, and group fitness sessions.', 30);

INSERT INTO Classes (name, description, trainer_id, duration, cost, capacity, type, room_id) VALUES
('Yoga Basics', 'Introduction to yoga, focusing on basic poses and breathing techniques.', 3, '[2024-01-21 08:00, 2024-01-21 09:00]', 150, 20, 'group', 1),
('Advanced Pilates', 'Challenging pilates class designed for experienced individuals.', 6, '[2024-01-21 10:00, 2024-01-21 11:30]', 200, 15, 'group', 2),
('HIIT Circuit', 'High-Intensity Interval Training for maximum calorie burn.', 3, '[2024-01-22 07:00, 2024-01-22 08:00]', 250, 10, 'personal', 1),
('Strength Training', 'Comprehensive strength training covering all major muscle groups.', 6, '[2024-01-23 09:00, 2024-01-23 10:00]', 20, 15, 'personal', 2),
('Cardio Kickboxing', 'Energetic kickboxing class combining cardio and strength.', 3, '[2024-01-23 18:00, 2024-01-23 19:00]', 18, 25, 'group', 3);

INSERT INTO Classes_Members (class_id, member_id, isPaymentProcessed) VALUES
(1, 2, TRUE),
(2, 5, FALSE),
(3, 7, TRUE);

INSERT INTO Fitness_Goals (member_id, goal, completion_date, status) VALUES
(2, 'Lose 5kg', '2024-06-01', FALSE),
(5, 'Run a marathon', '2024-12-01', FALSE),
(7, 'Increase muscle mass by 10%', '2025-01-01', FALSE);

INSERT INTO Payments (member_id, amount, date, service, completion_status) VALUES
(2, 500, '2024-01-01', 'membership', TRUE),
(5, 200, '2024-01-10', 'personal fitness class', FALSE),
(7, 300, '2024-01-20', 'group fitness class', TRUE);

INSERT INTO Equipment (name, description, status) VALUES
('Treadmill', 'A high-speed treadmill for cardiovascular workouts.', 'available'),
('Exercise Bike', 'A stationary bike with multiple resistance levels.', 'maintenance'),
('Rowing Machine', 'Simulates the action of watercraft rowing for full-body workouts.', 'available'),
('Dumbbells Set', 'A set of adjustable dumbbells for strength training.', 'unavailable'),
('Yoga Mats', 'High-quality mats suitable for yoga and stretching exercises.', 'available');
