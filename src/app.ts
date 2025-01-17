import fastify from 'fastify'

import formDataRoutes from './routes/form_data'
import queryRoutes from './routes/queries';

import errorHandler from './errors'
// Function to build the Fastify application
function build(opts = {}) {
  // Create a Fastify instance with options if given
  const app = fastify(opts)

  // Register formDataRoutes and queryRoutes with a specific route prefix
  app.register(formDataRoutes, { prefix: '/form-data' })
  app.register(queryRoutes, {prefix: '/queries'})

  // Ready event to log routes once the app is initialized
  app.setErrorHandler(errorHandler)
  app.ready(err => {
    if (err) throw err;
    console.log(app.printRoutes());
  });
  

  return app
}
export default build
