-- Reaction roles
CREATE TABLE reaction_messages (
  id BIGINT PRIMARY KEY,
  -- guild the reaction role is in
  guild BIGINT NOT NULL,
  --message that will be listened on
  message BIGINT NOT NULL,
  -- emoji that users react with
  emoji TEXT NOT NULL,
  -- role the user is assigned
  role BIGINT NOT NULL
);
