-- 1. Add the new columns and drop the old boolean column
ALTER TABLE Participant
DROP COLUMN hasFlintaParticipants,
    ADD COLUMN flintaParticipantsCount INT NOT NULL DEFAULT 0,
    ADD COLUMN professionalParticipantsCount INT NOT NULL DEFAULT 0;

-- 2. Clean and convert the data in participantCount
-- This handles non-numeric text by setting it to 0
UPDATE Participant
SET participantCount = CASE
   WHEN participantCount REGEXP '^[0-9]+$' THEN CAST(participantCount AS UNSIGNED)
   ELSE 0
END;

-- 3. Modify the participantCount column definition to the new type
ALTER TABLE Participant
    MODIFY COLUMN participantCount INT NOT NULL DEFAULT 0;
