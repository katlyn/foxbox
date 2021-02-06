-- Create table for images
-- owowowowo

CREATE TABLE owo_images (
  -- ID of the image
  id BIGINT PRIMARY KEY,
  -- Link to the image
  link TEXT NOT NULL,
  -- Any tags the image should have (author, medium, etc)
  tags TEXT[] DEFAULT '{}'
);
