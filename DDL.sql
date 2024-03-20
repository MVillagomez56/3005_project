-- enum for role
CREATE TYPE classType AS ENUM ('personal', 'group');
CREATE TYPE status AS ENUM ('available', 'unavailable', 'maintenance');
CREATE TYPE service AS ENUM ('membership', 'personal fitness class', 'group fitness class');
CREATE TYPE role AS ENUM ('admin', 'member', 'trainer');


CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  role role NOT NULL
);

CREATE TABLE Trainers (
    id SERIAL PRIMARY KEY,
    specialization TEXT NOT NULL,
    monday_availability DATERANGE,
    tuesday_availability DATERANGE,
    wednesday_availability DATERANGE,
    thursday_availability DATERANGE,
    friday_availability DATERANGE,
    saturday_availability DATERANGE,
    sunday_availability DATERANGE,
    cost INTEGER NOT NULL,
    FOREIGN KEY(id) REFERENCES Users(id)
);

CREATE TABLE Members (
    id SERIAL PRIMARY KEY ,
    weight INTEGER,
    height INTEGER,
    muscle_mass INTEGER,
    body_fat INTEGER,
    FOREIGN KEY(id) REFERENCES Users(id)
);

CREATE TABLE Rooms (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL
);

CREATE TABLE Classes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    trainer_id INTEGER NOT NULL,
    duration DATERANGE NOT NULL,
    cost INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    type classType NOT NULL,
    room_id INTEGER NOT NULL,
    FOREIGN KEY(room_id) REFERENCES Rooms(id), 
    FOREIGN KEY(trainer_id) REFERENCES Trainers(id)
);

CREATE TABLE Classes_Members (
    class_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    FOREIGN KEY(member_id) REFERENCES Members(id),
    FOREIGN KEY(class_id) REFERENCES Classes(id)
);

CREATE TABLE Fitness_Goals (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    goal TEXT NOT NULL,
    completion_date DATE NOT NULL,
    status BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY(member_id) REFERENCES Members(id)
);

CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    date DATE NOT NULL,
    service TEXT NOT NULL,
    completion_status BOOLEAN NOT NULL DEFAULT FALSE, -- 0 for pending, 1 for completed
    FOREIGN KEY(member_id) REFERENCES Members(id)
);

CREATE TABLE Equipment(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    status status NOT NULL
    );