-- Create the FormData table with a unique constraint
CREATE TABLE "FormData" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(), -- UUID as primary key
    "question" TEXT NOT NULL UNIQUE,             -- Add unique constraint to 'question'
    "answer" TEXT NOT NULL,
    PRIMARY KEY ("id")                           -- Set 'id' as the primary key
);

-- Create the Query table with a foreign key relationship to FormData
CREATE TABLE "Query" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),  -- UUID as primary key
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "formDataId" UUID NOT NULL,                   -- Foreign key referencing FormData.id
    PRIMARY KEY ("id"),
    CONSTRAINT "fk_formDataId" FOREIGN KEY ("formDataId") REFERENCES "FormData" ("id") ON DELETE CASCADE
);

-- Add an index to the foreign key for faster lookups
CREATE INDEX "idx_formDataId" ON "Query" ("formDataId");
