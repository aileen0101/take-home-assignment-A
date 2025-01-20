
/**
 * FormData Routes
 * 
 * This module defines the route for fetching all form data and their associated queries.
 * 
 * Features:
 * - Fetches all form data entries from the database.
 * - Includes the related query (if any) for each form data entry.
 * - Formats the data to match the `ICountedFormData` interface.
 * 
 * Route:
 * - **GET /form-data**: Fetches all form data entries, including their associated queries.
 * 
 * Dependencies:
 * - **Prisma**: Used for database interactions to fetch form data and query relations.
 * - **Fastify**: Framework for defining and managing the route.
 * - **ApiError**: Custom error handling utility to handle unexpected failures.
 * 
 * Validation:
 * - Ensures the `query` relation is included for each form data entry.
 * - Handles cases where no query exists by setting `query` to `null`.
 * 
 * Error Handling:
 * - Returns `500 Internal Server Error` if there is a failure during data fetching or processing.
 */

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
