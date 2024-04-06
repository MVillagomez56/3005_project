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

CREATE TABLE Schedule (
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
    approval_status BOOLEAN NOT NULL,
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
    class_id INTEGER,
    amount INTEGER NOT NULL,
    date DATE NOT NULL,
    service service NOT NULL,
    completion_status BOOLEAN NOT NULL DEFAULT FALSE, -- 0 for pending, 1 for completed
    FOREIGN KEY(member_id) REFERENCES Members(id) ON DELETE CASCADE,
    FOREIGN KEY(class_id) REFERENCES Classes(id) ON DELETE CASCADE
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


CREATE OR REPLACE FUNCTION update_trainer_schedule()
RETURNS TRIGGER AS $$
DECLARE
    time_slot Classes%ROWTYPE;
    availability_slot Availability%ROWTYPE;
BEGIN
   -- check if any of their classes fall outside this new schedule
    FOR time_slot IN
        SELECT *
        FROM Classes
        WHERE trainer_id = NEW.trainer_id
        AND day = NEW.day
    LOOP
        IF (NEW.start_time>time_slot.start_time OR NEW.end_time<time_slot.end_time) THEN
            RAISE EXCEPTION 'Trainer has a class at that time';
        END IF;
    END LOOP;

    -- get the first and the last availability slots for that day
    SELECT * INTO availability_slot
    FROM Availability
    WHERE trainer_id = NEW.trainer_id
    AND day = NEW.day
    ORDER BY start_time ASC
    LIMIT 1;

    -- if the new schedule starts before the first availability slot, update the first availability slot
    IF (NEW.start_time < availability_slot.start_time) THEN
        UPDATE Availability
        SET end_time = NEW.start_time
        WHERE trainer_id = NEW.trainer_id
        AND day = NEW.day
        AND start_time = availability_slot.start_time;
    END IF;

    --if the new schedule starts at the same time the first avail ends, delete the first avail
    IF (NEW.start_time = availability_slot.start_time) THEN
        DELETE FROM Availability
        WHERE trainer_id = NEW.trainer_id
        AND day = NEW.day
        AND start_time = availability_slot.start_time;
    END IF;

    -- get the last availability slot for that day

    SELECT * INTO availability_slot
    FROM Availability
    WHERE trainer_id = NEW.trainer_id
    AND day = NEW.day
    ORDER BY start_time DESC
    LIMIT 1;

    -- if the new schedule ends after the last availability slot, update the last availability slot
    IF (NEW.end_time > availability_slot.end_time) THEN
        UPDATE Availability
        SET start_time = NEW.end_time
        WHERE trainer_id = NEW.trainer_id
        AND day = NEW.day
        AND start_time = availability_slot.start_time;
    END IF;

    -- if the new schedule ends at the same time the last avail starts, delete the last avail
    IF (NEW.end_time = availability_slot.end_time) THEN
        DELETE FROM Availability
        WHERE trainer_id = NEW.trainer_id
        AND day = NEW.day
        AND start_time = availability_slot.start_time;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trainer_schedule
BEFORE UPDATE ON Schedule
FOR EACH ROW
EXECUTE FUNCTION update_trainer_schedule();


-- function to check if a trainer is available at a given time
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


-- after a GROUP class is created, change the trainer's availability
-- if it's not a group class, do nothing because the personal class is not approved yet
CREATE OR REPLACE FUNCTION update_trainer_availability(
    tid INTEGER,
    class_day INTEGER,
    class_start_time TIME,
    class_end_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE 
    existing_start TIME;
    existing_end TIME;
BEGIN
    SELECT start_time, end_time INTO existing_start, existing_end
    FROM Availability
    WHERE trainer_id = tid
    AND day = class_day
    AND start_time < class_end_time
    AND end_time > class_start_time
    LIMIT 1; -- Assuming only one entry overlaps

    -- If an overlapping availability was found
    IF FOUND THEN
        -- Update the existing entry to end right before the class starts, if the class does not start at the existing start time
        IF existing_start < class_start_time THEN --eg if existing_start = 9:00 and new start time = 10:00
            UPDATE Availability
            SET end_time = class_start_time
            WHERE trainer_id = tid
            AND day = class_day
            AND start_time = existing_start;
        ELSE
            -- eg if existing_start = 10:00 and new start time = 10:00
            -- Delete the existing entry if the class starts at the same time as the availability starts
            DELETE FROM Availability
            WHERE trainer_id = tid
            AND day = class_day
            AND start_time = existing_start;
        END IF;
        
        -- Insert a new availability entry for the period after the class, if the class does not end at the existing end time
        -- eg if existing_end = 17:00 and new end time = 16:00
        IF existing_end > class_end_time THEN
            INSERT INTO Availability (trainer_id, day, start_time, end_time)
            VALUES (tid, class_day, class_end_time, existing_end);
        END IF;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION split_trainer_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'group' THEN
        SELECT update_trainer_availability(NEW.trainer_id, NEW.day, NEW.start_time, NEW.end_time);
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


-- when Payment completion_status is updated, update classes_members isPaymentProcessed
-- if the associated class is a personal class, update the Class approval_status to true
-- once class approval_status is true, update the trainer's availability

CREATE OR REPLACE FUNCTION update_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completion_status = TRUE THEN
        UPDATE Classes_Members
        SET isPaymentProcessed = TRUE
        WHERE class_id = NEW.class_id
        AND member_id = NEW.member_id;

        IF EXISTS (
            SELECT 1
            FROM Classes
            WHERE id = NEW.class_id
            AND type = 'personal'
        ) THEN
            UPDATE Classes
            SET approval_status = TRUE
            WHERE id = NEW.class_id;
            SELECT update_trainer_availability(NEW.trainer_id, NEW.day, NEW.start_time, NEW.end_time);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_status
BEFORE UPDATE ON Payments
FOR EACH ROW
EXECUTE FUNCTION update_payment_status();


 

--- TESTING TRAINERS AVAILABILITY WITH GROUP AND PERSONAL CLASSES
--- ENSURE THAT TRAINER AVAILABILITY DOES NOT CHANGE WHEN A PERSONAL CLASS IS CREATED
--- ENSURE THAT TRAINER AVAILABILITY CHANGES WHEN A GROUP CLASS IS CREATED
--- ENSURE AVAILABILITY CHANGES WHEN PAYMENT IS PROCESSED FOR A PERSONAL CLASS

INSERT INTO Users (password, email, name, date_of_birth, role)
VALUES ('password', 'member@mail.com', 'member', '1990-01-01', 'member');

INSERT INTO Users (password, email, name, date_of_birth, role)
VALUES ('password', 'trainer@mail.com', 'trainer', '1990-01-01', 'trainer');

INSERT INTO Availability (trainer_id, day, start_time, end_time)
VALUES (6, 1, '09:00', '17:00');

INSERT INTO ROOMS (name, description, capacity)
VALUES ('Room 1', 'Room 1', 10);

-- A user would sign up for a personal class, which would first create a class, then add user to class_members, then create a payment

INSERT INTO Classes (name, description, trainer_id, start_time, end_time, day, cost, capacity, type, room_id, approval_status)
VALUES ('Personal Class', 'Personal Class', 6, '10:00', '11:00', 1, 100, 1, 'personal', 1, FALSE);

INSERT INTO Classes_Members (class_id, member_id, isPaymentProcessed)
VALUES (1, 5, FALSE);

INSERT INTO Payments (member_id, class_id, amount, date, service, completion_status)
VALUES (5, 1, 100, '2021-01-01', 'personal fitness class', FALSE);

-- check if trainer availability changes when a personal class is created
SELECT * FROM Availability;

-- Submit payment for the personal class
UPDATE Payments
SET completion_status = TRUE
WHERE id = 1;