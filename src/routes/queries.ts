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
        reply.code(400).send({ message: 'Invalid status' });
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
  
        reply.send(updatedQuery);
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
        const deletedQuery = await prisma.query.delete({
          where: { id },
        });
  
        // Return confirmation message with details of the deleted query
        reply.code(200).send({
          message: 'Query deleted successfully',
          deletedQuery,
        });
      } catch (err: any) {
        app.log.error(err, err.message);
        reply.code(500).send({ message: 'Failed to delete query' });
      }
    },
  });
  
}

export default queryRoutes;
