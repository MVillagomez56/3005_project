-- Insert a user with the role of trainer
INSERT INTO
  Users (password, email, name, date_of_birth, role)
VALUES
  ('password123', 'john.doe@example.com', 'John Doe', '1980-01-01', 'trainer'),
('password456', 'jane.smith@example.com', 'Jane Smith', '1985-02-01', 'trainer');

INSERT INTO Trainers (id, specialization, cost) VALUES
(1, 'Yoga', 50),
(2, 'Cardio', 60);


  

-- Assuming the id generated for the trainer is 1
-- Insert a room
INSERT INTO
  Rooms (name, description, capacity)
VALUES
  ('Room 1', 'A spacious room', 20);

-- Assuming the id generated for the room is 1
-- Insert availability for the trainer
INSERT INTO
  Availability (trainer_id, day, start_time, end_time)
VALUES
  (1, 1, '09:00', '17:00');

INSERT INTO Schedule (trainer_id, day, start_time, end_time) VALUES
(1, 1, '09:00', '17:00'),
(1, 2, '09:00', '17:00'),
(1, 3, '09:00', '17:00'),
(1, 4, '09:00', '16:00'),
(1, 5, '09:00', '17:00'),
(2, 2, '09:00', '17:00'),
(2, 4, '09:00', '17:00');

  ----------------

-- Attempt to create a class within the trainer's availability and when the room is free
-- Assuming Room IDs 1 and 2 for Room 101 and Room 102, respectively
-- Inserting Classes for John Doe
INSERT INTO Classes (name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id, approval_status) VALUES
('Morning Yoga', 'Early morning yoga session', 1, '10:00', '11:00', 1, 15, 15, 'group', 1, TRUE),
('Morning Yoga', 'Late afternoon yoga session', 1, '16:00', '17:00', 2, 15, 15, 'group', 1, TRUE),
('Advanced Yoga', 'Advanced poses and stretches', 1, '14:00', '15:30', 3, 20, 10, 'group', 1, TRUE),
('Advanced Yoga', 'Advanced poses and stretches', 1, '14:00', '15:30', 4, 20, 10, 'group', 1, TRUE),

-- Inserting Classes for Jane Smith
('Cardio Blast', 'High intensity cardio workout', 2, '10:00', '11:00', 2, 15, 20, 'group', 2, TRUE),
('Evening Cardio', 'Wind down with evening cardio', 2, '16:00', '17:00', 4, 15, 20, 'group', 2, TRUE);

-- Attempt to create a class outside the trainer's availability
INSERT INTO
  Classes (
    name,
    description,
    trainer_id,
    start_time,
    end_time,
    day,
    cost,
    capacity,
    type,
    room_id
  )
VALUES
  (
    'Pilates Class',
    'An intermediate Pilates session.',
    1,
    '18:00',
    '20:00',
    1,
    50,
    15,
    'personal',
    1
  );
  


  -- First, create a class that books Room 1
INSERT INTO Classes (name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id) VALUES ('Spin Class', 'High-intensity spin class.', 1, '14:00', '15:00', 1, 30, 10, 'group', 1);

-- Then, attempt to create another class in the same room and overlapping time
INSERT INTO Classes (name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id) VALUES ('Zumba Class', 'Fun and energetic Zumba.', 1, '14:30', '16:30', 1, 40, 20, 'group', 1);
