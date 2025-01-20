/**
 * Query Routes
 * 
 * This module defines the routes for managing queries in the Query Management Application.
 * 
 * Features:
 * - **Create a Query**: Allows creating a new query for a specific form data entry.
 * - **Update Query Status**: Enables updating the status of a query (e.g., resolving it).
 * - **Delete a Query**: Provides functionality to delete a query by its ID.
 * 
 * Routes:
 * 1. **POST /queries**: Create a new query for a specific form data entry.
 * 2. **PATCH /queries/:id**: Update the status of an existing query (OPEN or RESOLVED).
 * 3. **DELETE /queries/:id**: Delete a query by its ID.
 * 
 * Dependencies:
 * - **Prisma**: Used for database interactions (creating, updating, and deleting queries).
 * - **Fastify**: Framework for defining and managing routes.
 * - **ApiError**: Custom error handling utility.
 * 
 * Validation:
 * - Ensures that the associated form data exists before creating a query.
 * - Verifies that a query exists before updating or deleting it.
 * - Validates the query status (must be "OPEN" or "RESOLVED") before updating.
 * 
 * Error Handling:
 * - Returns `404 Not Found` if the form data or query does not exist.
 * - Returns `400 Bad Request` for invalid statuses or missing required fields.
 * - Returns `500 Internal Server Error` for unexpected issues during database operations.
 */

import { FastifyInstance } from 'fastify';
import prisma from '../db/db_client';
import { ApiError } from '../errors';

// Define interfaces for request body and params
interface CreateQueryBody {
  title: string;
  description: string | null;
  formDataId: string; // UUID
}

interface UpdateQueryParams {
  id: string; // UUID
}

interface UpdateQueryBody {
  status: string; // "OPEN" or "RESOLVED"
}

interface DeleteQueryParams {
  id: string; // UUID
}

async function queryRoutes(app: FastifyInstance) {
  // Create a new query: POST /queries
  app.post<{ Body: CreateQueryBody }>('/', {
    async handler(req, reply) {
      const { title, description, formDataId } = req.body;

      try {
        // Check if the associated FormData exists
        const formData = await prisma.formData.findUnique({
          where: { id: formDataId },
        });

        if (!formData) {
          reply.code(404).send({ message: 'FormData not found' });
          return;
        }

        // Create the query
        const newQuery = await prisma.query.create({
          data: {
            title,
            description,
            formData: { connect: { id: formDataId } },
          },
        });

        reply.code(201).send(newQuery);
      } catch (err: any) {
        app.log.error(err, err.message);
        reply.code(500).send({ message: 'Failed to create query' });
      }
    },
  });

  // Update query status: PATCH /queries/:id
  app.patch<{ Params: UpdateQueryParams; Body: UpdateQueryBody }>('/:id', {
    async handler(req, reply) {
      const { id } = req.params;
      const { status } = req.body;

      if (!['OPEN', 'RESOLVED'].includes(status)) {
        reply.code(400).send({ message: 'Invalid status. Allowed values are "OPEN" or "RESOLVED".' });
        return;
      }

      try {
        // Check if the query exists
        const existingQuery = await prisma.query.findUnique({
          where: { id },
        });

        if (!existingQuery) {
          reply.code(404).send({ message: 'Query not found' });
          return;
        }

        // Update the query
        const updatedQuery = await prisma.query.update({
          where: { id },
          data: { status },
        });

        reply.code(200).send(updatedQuery);
      } catch (err: any) {
        app.log.error(err, err.message);
        reply.code(500).send({ message: 'Failed to update query' });
      }
    },
  });

  // Delete a query: DELETE /queries/:id
  app.delete<{ Params: DeleteQueryParams }>('/:id', {
    async handler(req, reply) {
      const { id } = req.params;

      try {
        // Check if the query exists
        const existingQuery = await prisma.query.findUnique({
          where: { id },
        });

        if (!existingQuery) {
          reply.code(404).send({ message: 'Query not found' });
          return;
        }

        // Delete the query
        await prisma.query.delete({
          where: { id },
        });

        // Return a confirmation message
        reply.code(200).send({ message: 'Query deleted successfully' });
      } catch (err: any) {
        app.log.error(err, err.message);
        reply.code(500).send({ message: 'Failed to delete query' });
      }
    },
  });
}

export default queryRoutes;
