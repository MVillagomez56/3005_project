-- Insert a user with the role of trainer
INSERT INTO
  Users (password, email, name, date_of_birth, role)
VALUES
  (
    'password123',
    'trainer@example.com',
    'John Doe',
    '1990-01-01',
    'trainer'
  );

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


  ----------------

-- Attempt to create a class within the trainer's availability and when the room is free
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
    'Yoga Class',
    'A beginner yoga session.',
    1,
    '13:00',
    '14:00',
    1,
    50,
    15,
    'group',
    1
  );

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
