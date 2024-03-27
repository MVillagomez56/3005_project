-- enum for role
CREATE TYPE classType AS ENUM ('personal', 'group');
CREATE TYPE status AS ENUM ('available', 'unavailable', 'maintenance');
CREATE TYPE service AS ENUM ('membership', 'personal fitness class', 'group fitness class');
CREATE TYPE role AS ENUM ('admin', 'member', 'trainer');


CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  role role NOT NULL
);

CREATE TABLE Trainers (
    id INTEGER PRIMARY KEY,
    specialization TEXT,
    monday_availability TSRANGE,
    tuesday_availability TSRANGE,
    wednesday_availability TSRANGE,
    thursday_availability TSRANGE,
    friday_availability TSRANGE,
    saturday_availability TSRANGE,
    sunday_availability TSRANGE,
    cost INTEGER,
    FOREIGN KEY(id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Members (
    id INTEGER PRIMARY KEY ,
    weight INTEGER,
    height INTEGER,
    muscle_mass INTEGER,
    body_fat INTEGER,
    cc_number TEXT,
    ccv INTEGER,
    cc_expiry_date DATE,
    FOREIGN KEY(id) REFERENCES Users(id) ON DELETE CASCADE
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
    duration TSRANGE NOT NULL,
    cost INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    type classType NOT NULL,
    room_id INTEGER NOT NULL,
    FOREIGN KEY(room_id) REFERENCES Rooms(id) ON DELETE CASCADE,
    FOREIGN KEY(trainer_id) REFERENCES Trainers(id) ON DELETE CASCADE
);

CREATE TABLE Classes_Members (
    class_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    isPaymentProcessed BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY(member_id) REFERENCES Members(id) ON DELETE CASCADE,
    FOREIGN KEY(class_id) REFERENCES Classes(id) ON DELETE CASCADE,
    PRIMARY KEY(class_id, member_id)
);

CREATE TABLE Fitness_Goals (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    goal TEXT NOT NULL,
    completion_date DATE,
    status BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY(member_id) REFERENCES Members(id) ON DELETE CASCADE
);

CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    date DATE NOT NULL,
    service service NOT NULL,
    completion_status BOOLEAN NOT NULL DEFAULT FALSE, -- 0 for pending, 1 for completed
    FOREIGN KEY(member_id) REFERENCES Members(id) ON DELETE CASCADE
);

CREATE TABLE Equipment(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status status NOT NULL DEFAULT 'available'
    );


-- trigger function to make new users with member role a member
CREATE OR REPLACE FUNCTION make_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Members (id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER make_member
AFTER INSERT ON Users
FOR EACH ROW
WHEN (NEW.role = 'member')
EXECUTE FUNCTION make_member();

-- trigger function to make new users with trainer role a trainer
CREATE OR REPLACE FUNCTION make_trainer()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Trainers (id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER make_trainer
AFTER INSERT ON Users
FOR EACH ROW
WHEN (NEW.role = 'trainer')
EXECUTE FUNCTION make_trainer();

CREATE OR REPLACE FUNCTION check_trainer_availability(duration TSRANGE, trainer_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE 
    day_of_week TEXT;
    availability_range TSRANGE;
    is_available BOOLEAN := FALSE;
BEGIN
    -- Get the day of the week from the lower bound of the duration
    day_of_week := TO_CHAR(lower(duration), 'day');
    
    -- Adjust day_of_week to match the column names in the table
    day_of_week := TRIM(day_of_week);
    
    -- Dynamically get the trainer's availability for that day using EXECUTE statement
    EXECUTE format('SELECT %I FROM Trainers WHERE id = $1', day_of_week || '_availability')
    INTO availability_range
    USING trainer_id;
    
    -- Check if the duration overlaps with the trainer's availability for that day
    is_available := availability_range @> duration;
    
    RETURN is_available;
END;
$$ LANGUAGE plpgsql;


-- when inserting a new class, check if the room and trainer is available
CREATE OR REPLACE FUNCTION check_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM Classes WHERE room_id = NEW.room_id AND (duration && NEW.duration)) > 0 THEN
        RAISE EXCEPTION 'Room is not available';
    END IF;

    IF NOT check_trainer_availability(NEW.duration, NEW.trainer_id) THEN
        RAISE EXCEPTION 'Trainer is not available';
    END IF;
    IF (SELECT COUNT(*) FROM Classes WHERE trainer_id = NEW.trainer_id AND (duration && NEW.duration)) > 0 THEN
        RAISE EXCEPTION 'Trainer is not available';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_availability
BEFORE INSERT ON Classes
FOR EACH ROW
EXECUTE FUNCTION check_availability();


 