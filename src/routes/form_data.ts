import { FastifyInstance } from 'fastify';
import prisma from '../db/db_client';
import { ApiError } from '../errors';
import { ICountedFormData } from './schemas/formData.interface';

async function formDataRoutes(app: FastifyInstance) {
  app.get<{ Reply: ICountedFormData }>('/', {
    async handler(req, reply) {
      try {
        const formData = await prisma.formData.findMany({
          include: { query: true }, // Include the query relation
        });

        reply.send({
          total: formData.length,
          formData: formData.map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            query: item.query
              ? {
                  id: item.query.id,
                  title: item.query.title,
                  description: item.query.description,
                  createdAt: item.query.createdAt,
                  updatedAt: item.query.updatedAt,
                  status: item.query.status as 'OPEN' | 'RESOLVED', // Cast the status
                  formDataId: item.query.formDataId,
                }
              : null,
          })),
        });
      } catch (err) {
        throw new ApiError('Failed to fetch form data', 500);
      }
    },
  });
}

export default formDataRoutes;
