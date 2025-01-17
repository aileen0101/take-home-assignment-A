import { PrismaClient } from '@prisma/client'

import { getSeedData } from './data'

const client = new PrismaClient()

const deleteAllRecords = async () => {
  // Deletion order is important due to non-null relation constraints.

  await client.formData.deleteMany()

  console.log('All records deleted')
}

const createAllRecords = async () => {
  const data = await getSeedData();

  // Create FormData records
  const createdFormData = await Promise.all(
    data.formData.map((entry) =>
      client.formData.create({ data: { question: entry.question, answer: entry.answer } })
    )
  );

  console.log('FormData records created');

  // Create Query records (sample data)
  await client.query.createMany({
    data: [
      {
        title: 'Verify allergy information',
        description: 'Please confirm if the patient is allergic to penicillin.',
        formDataId: createdFormData[2].id, // Reference the third FormData entry
      },
      {
        title: 'Exercise routine clarification',
        description: 'Ask the patient for more details on their daily physical activity.',
        formDataId: createdFormData[4].id, // Reference the fifth FormData entry
      },
    ],
  });

  console.log('Query records created');
};


async function seed() {
  await deleteAllRecords()
  await createAllRecords()
}

seed()
  .then(async () => {
    await client.$disconnect()
    console.log('database disconnected')
    process.exit(0)
  })
  .catch(async e => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })
