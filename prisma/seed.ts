import { PrismaClient } from '@prisma/client';
import { getSeedData } from './data';

const client = new PrismaClient();

const deleteAllRecords = async () => {
  // Deletion order is important due to non-null relation constraints.
  await client.query.deleteMany();
  await client.formData.deleteMany();

  console.log('All records deleted');
};

const createAllRecords = async () => {
  const data = await getSeedData();

  // Create FormData records and associate each with a Query (if applicable)
  for (const [index, entry] of data.formData.entries()) {
    const createdFormData = await client.formData.create({
      data: {
        question: entry.question,
        answer: entry.answer,
      },
    });

    // Add queries for specific FormData entries (e.g., 3rd and 5th)
    if (index === 2) {
      await client.query.create({
        data: {
          title: 'Verify allergy information',
          description: 'Please confirm if the patient is allergic to penicillin.',
          formData: { connect: { id: createdFormData.id } },
        },
      });
    } else if (index === 4) {
      await client.query.create({
        data: {
          title: 'Exercise routine clarification',
          description: 'Ask the patient for more details on their daily physical activity.',
          formData: { connect: { id: createdFormData.id } },
        },
      });
    }
  }

  console.log('FormData and Query records created');
};

async function seed() {
  await deleteAllRecords();
  await createAllRecords();
}

seed()
  .then(async () => {
    await client.$disconnect();
    console.log('database disconnected');
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });
