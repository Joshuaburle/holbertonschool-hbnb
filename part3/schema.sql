-- HBnB - Task 9: Full Database Schema + Initial Data
-- Compatible with: SQLite (development) and MySQL (production)
-- Run with:  sqlite3 hbnb_dev.db < schema.sql
--            mysql -u user -p hbnb_prod < schema.sql

-- Drop tables in reverse FK order to avoid constraint errors
DROP TABLE IF EXISTS place_amenity;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS users;

-- 1. users

CREATE TABLE users (
    id         CHAR(36)     NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    is_admin   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- 2. places

CREATE TABLE places (
    id          CHAR(36)       NOT NULL,
    title       VARCHAR(255)   NOT NULL,
    description TEXT,
    price       DECIMAL(10, 2) NOT NULL,
    latitude    FLOAT,
    longitude   FLOAT,
    owner_id    CHAR(36)       NOT NULL,
    created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT fk_places_owner
        FOREIGN KEY (owner_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- 3. reviews

CREATE TABLE reviews (
    id         CHAR(36) NOT NULL,
    text       TEXT     NOT NULL,
    rating     INT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
    user_id    CHAR(36) NOT NULL,
    place_id   CHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    -- A user can only leave one review per place
    CONSTRAINT uq_user_place_review UNIQUE (user_id, place_id),
    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    CONSTRAINT fk_reviews_place
        FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);

-- 4. amenities

CREATE TABLE amenities (
    id         CHAR(36)     NOT NULL,
    name       VARCHAR(255) NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uq_amenities_name UNIQUE (name)
);

-- 5. place_amenity (association table & many-to-many)

CREATE TABLE place_amenity (
    place_id   CHAR(36) NOT NULL,
    amenity_id CHAR(36) NOT NULL,

    PRIMARY KEY (place_id, amenity_id),
    CONSTRAINT fk_pa_place
        FOREIGN KEY (place_id)   REFERENCES places(id)    ON DELETE CASCADE,
    CONSTRAINT fk_pa_amenity
        FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- 6. Initial Data

-- Password: admin1234 -> bcrypt2 hash (cost 12)
-- To regenerate the hash yourself:
--   python3 -c "import bcrypt; print(bcrypt.hashpw(b'admin1234', bcrypt.gensalt(12)).decode())"

INSERT INTO users (id, first_name, last_name, email, password, is_admin)
VALUES (
    '36c9050e-ddd3-4c3b-9731-9f487208bbc1',
    'Admin',
    'HBnB',
    'admin@hbnb.io',
    '$2b$12$8sKMnZXqbWH1xSZ1xjxFCe9Xg4kHhCqJZrYpUlVOXX7VdFdGKqU6y',  -- admin1234
    TRUE
);

-- Initial amenities (random UUID4s)

INSERT INTO amenities (id, name) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'WiFi'),
    ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Swimming Pool'),
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Air Conditioning');


-- 7. Quick smoke-test queries:
-- SELECT * FROM users;
-- SELECT * FROM amenities;
-- SELECT COUNT(*) AS user_count FROM users;
-- SELECT COUNT(*) AS amenity_count FROM amenities;
