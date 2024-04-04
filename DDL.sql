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

CREATE TABLE Availability (
    trainer_id INTEGER,
    day INTEGER, -- or TEXT, e.g., 'Monday', 'Tuesday', etc.
    start_time TIME DEFAULT '09:00',
    end_time TIME DEFAULT '17:00',
    FOREIGN KEY(trainer_id) REFERENCES Trainers(id) ON DELETE CASCADE
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
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    day INTEGER NOT NULL,
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

CREATE OR REPLACE FUNCTION check_trainer_availability(
    tid INTEGER,
    class_day INTEGER,
    class_start_time TIME,
    class_end_time TIME
)
RETURNS BOOLEAN AS $$  
DECLARE
    time_slot Availability%ROWTYPE;
BEGIN
    FOR time_slot IN
        SELECT *
        FROM Availability
        WHERE trainer_id = tid
        AND day = class_day
    LOOP
        IF (time_slot.start_time, time_slot.end_time) OVERLAPS (class_start_time, class_end_time) THEN
            RETURN TRUE;
        END IF;
    END LOOP;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;


-- when inserting a new class, check if the room and trainer is available
CREATE OR REPLACE FUNCTION check_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT check_trainer_availability(NEW.trainer_id, NEW.day, NEW.start_time, NEW.end_time) THEN
        RAISE EXCEPTION 'Trainer is not available at that time';
    END IF;

    --check if class room is available
    IF EXISTS (
        SELECT 1
        FROM Classes
        WHERE room_id = NEW.room_id
        AND day = NEW.day
        AND (start_time, end_time) OVERLAPS (NEW.start_time, NEW.end_time)
    ) THEN
        RAISE EXCEPTION 'Room is not available at that time';
    END IF;
    RETURN NEW;
    
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_availability
BEFORE INSERT ON Classes
FOR EACH ROW
EXECUTE FUNCTION check_availability();

-- after a class is created, change the trainer's availability
CREATE OR REPLACE FUNCTION split_trainer_availability()
RETURNS TRIGGER AS $$
DECLARE
    existing_start TIME;
    existing_end TIME;
BEGIN
    -- Find the overlapping availability
    SELECT start_time, end_time INTO existing_start, existing_end
    FROM Availability
    WHERE trainer_id = NEW.trainer_id
    AND day = NEW.day
    AND start_time < NEW.end_time
    AND end_time > NEW.start_time
    LIMIT 1; -- Assuming only one entry overlaps

    -- If an overlapping availability was found
    IF FOUND THEN
        -- Update the existing entry to end right before the class starts, if the class does not start at the existing start time
        IF existing_start < NEW.start_time THEN --eg if existing_start = 9:00 and new start time = 10:00
            UPDATE Availability
            SET end_time = NEW.start_time
            WHERE trainer_id = NEW.trainer_id
            AND day = NEW.day
            AND start_time = existing_start;
        ELSE
            -- eg if existing_start = 10:00 and new start time = 10:00
            -- Delete the existing entry if the class starts at the same time as the availability starts
            DELETE FROM Availability
            WHERE trainer_id = NEW.trainer_id
            AND day = NEW.day
            AND start_time = existing_start;
        END IF;
        
        -- Insert a new availability entry for the period after the class, if the class does not end at the existing end time
        -- eg if existing_end = 17:00 and new end time = 16:00
        IF existing_end > NEW.end_time THEN
            INSERT INTO Availability (trainer_id, day, start_time, end_time)
            VALUES (NEW.trainer_id, NEW.day, NEW.end_time, existing_end);
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER split_trainer_availability
AFTER INSERT ON Classes
FOR EACH ROW
EXECUTE FUNCTION split_trainer_availability();



-- when completion status of a goal is updated, update the completion date as well
CREATE OR REPLACE FUNCTION update_completion_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = TRUE THEN
        NEW.completion_date := CURRENT_DATE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_completion_date
BEFORE UPDATE ON Fitness_Goals
FOR EACH ROW
EXECUTE FUNCTION update_completion_date();


 