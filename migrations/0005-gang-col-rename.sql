-- Renames the columns used for gangs to match their names in code
-- This makes things cleaner overall
ALTER TABLE gang_messages
  RENAME COLUMN guild_id TO guild;

ALTER TABLE gangs
  RENAME COLUMN gang_message TO message;

ALTER TABLE gangs
  RENAME COLUMN role_id TO role;
