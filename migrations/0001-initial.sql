-- Create table needed for guild configuration
CREATE TABLE guild_config (
  -- ID of guild
  id BIGINT PRIMARY KEY,
  -- # of reactions needed to pin a message
  pin_limit INT DEFAULT 0,
  -- the reaction to be used for pins
  pin_reaction TEXT DEFAULT '📌'
);
