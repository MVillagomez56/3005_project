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


----------- MEMBER TRIGGERS ------------------------------
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

------------------- TRAINER TRIGGERS ------------------------------
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

------------------- AVAILABILITY FUNCTIONS  ------------------------------

-- trigger function to check if a room is available at a given time
CREATE OR REPLACE FUNCTION is_room_available(
    room_id_arg INTEGER,
    day_arg INTEGER,
    start_time_arg TIME,
    end_time_arg TIME
)
RETURNS BOOLEAN AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM Classes
        WHERE room_id = room_id_arg
        AND day = day_arg
        AND (start_time, end_time) OVERLAPS (start_time_arg, end_time_arg)
    ) THEN
        RETURN FALSE;
    END IF;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- function to check if a trainer is available at a given time
CREATE OR REPLACE FUNCTION is_trainer_available(
    tid INTEGER,
    class_day INTEGER,
    class_start_time TIME,
    class_end_time TIME
)
RETURNS BOOLEAN AS $$  
BEGIN   
    -- check if the proposed time is within the trainer's schedule
    IF NOT EXISTS (
        SELECT 1
        FROM Schedule
        WHERE trainer_id = tid
        AND day = class_day
        AND (start_time, end_time) OVERLAPS (class_start_time, class_end_time)
    ) THEN
        RETURN FALSE;
    END IF;
    IF EXISTS (
        SELECT 1
        FROM Classes
        WHERE trainer_id = tid
        AND day = class_day
        AND (start_time, end_time) OVERLAPS (class_start_time, class_end_time)
    ) THEN
        RETURN FALSE;
    END IF;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


-------------------CLASS TRIGGERS------------------------------------------------
------- INSERT 

-- when inserting a new class, check if the room and trainer is available
CREATE OR REPLACE FUNCTION check_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT is_trainer_available(NEW.trainer_id, NEW.day, NEW.start_time, NEW.end_time) THEN
        RAISE EXCEPTION 'Trainer is not available at that time';
    END IF;

    IF NOT is_room_available(NEW.room_id, NEW.day, NEW.start_time, NEW.end_time) THEN
        RAISE EXCEPTION 'Room is not available at that time';
    END IF;
    RETURN NEW;
    
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_availability
BEFORE INSERT ON Classes
FOR EACH ROW
EXECUTE FUNCTION check_availability();

--------- UPDATE 

 -- when the admin updates the time of a class, check if the room and trainer is available
CREATE OR REPLACE FUNCTION update_class_time()
RETURNS TRIGGER AS $$
BEGIN
    -- in theory they shouldnt be able to select a new timeslot that the trainer is not available for
    IF NOT is_trainer_available(NEW.trainer_id, NEW.day, NEW.start_time, NEW.end_time) THEN
        RAISE EXCEPTION 'Trainer is not available at that time';
    END IF;

    IF NOT is_room_available(NEW.room_id, NEW.day, NEW.start_time, NEW.end_time) THEN
        RAISE EXCEPTION 'Room is not available at that time';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_class_time
BEFORE UPDATE ON Classes
FOR EACH ROW
EXECUTE FUNCTION update_class_time();

-------------------FITNESS GOAL TRIGGERS------------------------------------------------

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

---------------------PAYMENT TRIGGERS---------------------------------------------------

-- when Payment completion_status is updated, update classes_members isPaymentProcessed
-- if the associated class is a personal class, update the Class approval_status to true
-- once class approval_status is true, update the trainer's availability

CREATE OR REPLACE FUNCTION update_payment_status()
RETURNS TRIGGER AS $$
DECLARE
    t_id INTEGER;
    r_id INTEGER;
    d INTEGER;
    s_time TIME;
    e_time TIME;
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

            SELECT trainer_id, day, start_time, end_time, room_id
            INTO t_id, d, s_time, e_time, r_id
            FROM Classes
            WHERE id = NEW.class_id;
            
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_status
BEFORE UPDATE ON Payments
FOR EACH ROW
EXECUTE FUNCTION update_payment_status();

-- if user deregisters before their payment is processed, delete the payment
CREATE OR REPLACE FUNCTION delete_payment()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.isPaymentProcessed = FALSE THEN
        DELETE FROM Payments
        WHERE member_id = OLD.member_id
        AND class_id = OLD.class_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_payment
AFTER DELETE ON Classes_Members
FOR EACH ROW
EXECUTE FUNCTION delete_payment();  