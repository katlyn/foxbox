CREATE TABLE gang_messages (
  id BIGINT PRIMARY KEY,
  -- Guild this gang is from
  guild_id BIGINT NOT NULL
);

-- Create Users table
--   Store user's configuration and options
CREATE TABLE gangs (
  id BIGINT PRIMARY KEY,
  -- Gang Message this gang is for
  gang_message BIGINT NOT NULL,
  -- Gang role
  role_id BIGINT NOT NULL,
  -- Gang emoji
  emoji TEXT NOT NULL,

  -- Remove gang if guild configuration is removed
  CONSTRAINT fk_gang_message
    FOREIGN KEY (gang_message)
      REFERENCES gang_messages(id)
      ON DELETE CASCADE
);
