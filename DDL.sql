-- enum for role
CREATE TYPE role AS ENUM ('admin', 'member', 'trainer');
CREATE TYPE classType AS ENUM ('personal', 'group');
CREATE TYPE status AS ENUM ('available', 'unavailable', 'maintenance');
CREATE TYPE service AS ENUM ('membership', 'personal fitness class', 'group fitness class');

CREATE TABLE 'Users' (
  'id' INTEGER PRIMARY KEY AUTOINCREMENT,
  'username' TEXT NOT NULL,
  'password' TEXT NOT NULL,
  'email' TEXT NOT NULL,
  'name' TEXT NOT NULL,
  'date_of_birth' DATE NOT NULL,
  'role' role NOT NULL
);

CREATE TABLE 'Trainers' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'user_id' INTEGER NOT NULL,
    'specialization' TEXT NOT NULL,
    'monday_availability' TEXT,
    'tuesday_availability' TEXT,
    'wednesday_availability' TEXT,
    'thursday_availability' TEXT,
    'friday_availability' TEXT,
    'saturday_availability' TEXT,
    'sunday_availability' TEXT,
    'cost' INTEGER NOT NULL,
    'FOREIGN KEY'('user_id') REFERENCES 'Users'('id'),
);

CREATE TABLE 'Members' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'user_id' INTEGER NOT NULL,
    'weight' INTEGER NOT NULL,
    'height' INTEGER NOT NULL,
    'muscle_mass' INTEGER NOT NULL,
    'body_fat' INTEGER NOT NULL,
    'FOREIGN KEY'('user_id') REFERENCES 'Users'('id'),
);

CREATE TABLE 'Rooms' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' TEXT NOT NULL,
    'description' TEXT,
    'capacity' INTEGER NOT NULL
);

CREATE TABLE 'Classes' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' TEXT NOT NULL,
    'description' TEXT,
    'trainer_id' INTEGER NOT NULL,
    'start_time' INTEGER NOT NULL,
    'end_time' INTEGER NOT NULL,
    'cost' INTEGER NOT NULL,
    'capacity' INTEGER NOT NULL,
    'type' classType NOT NULL,
    'room_id' INTEGER NOT NULL,
    'FOREIGN KEY'('room_id') REFERENCES 'Rooms'('id'), 
    'FOREIGN KEY'('trainer_id') REFERENCES 'Trainers'('id'),
);

CREATE TABLE 'Classes_Members' (
    'class_id' INTEGER NOT NULL,
    'member_id' INTEGER NOT NULL,
    'FOREIGN KEY'('member_id') REFERENCES 'Members'('id'),
    'FOREIGN KEY'('class_id') REFERENCES 'Classes'('id')
);

CREATE TABLE 'Fitness_Goals' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'member_id' INTEGER NOT NULL,
    'goal' TEXT NOT NULL,
    'completion_date' DATE NOT NULL,
    'status' BOOLEAN NOT NULL DEFAULT FALSE,
    'FOREIGN KEY'('member_id') REFERENCES 'Members'('id')
);

CREATE TABLE 'Payments' (
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'member_id' INTEGER NOT NULL,
    'amount' INTEGER NOT NULL,
    'date' DATE NOT NULL,
    'service' TEXT NOT NULL,
    'FOREIGN KEY'('member_id') REFERENCES 'Members'('id')
);

CREATE TABLE 'Equipment'(
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'name' TEXT NOT NULL,
    'description' TEXT,
    'cost' INTEGER NOT NULL,
    'status' status NOT NULL
    );