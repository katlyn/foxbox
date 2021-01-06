-- Table to track user relative data
CREATE TABLE users (
  -- ID of user
  id BIGINT PRIMARY KEY,
  -- Number of times the user has uwud
  uwus BIGINT DEFAULT 0
);
