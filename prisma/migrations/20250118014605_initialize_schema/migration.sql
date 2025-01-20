-- CreateTable
CREATE TABLE "FormData" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "FormData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Query" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "formDataId" TEXT NOT NULL,

    CONSTRAINT "Query_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormData_question_key" ON "FormData"("question");

-- CreateIndex
CREATE UNIQUE INDEX "Query_formDataId_key" ON "Query"("formDataId");

-- AddForeignKey
ALTER TABLE "Query" ADD CONSTRAINT "Query_formDataId_fkey" FOREIGN KEY ("formDataId") REFERENCES "FormData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
