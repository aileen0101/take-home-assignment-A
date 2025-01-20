# take-home-assignment-A

## Getting Started
- copy the .env.example file into a .env file
- `docker-compose build`
- `docker-compose up`
- `npm run migrate`
- `npm run seed`
- if you view your database, you should be able to see a populated form data table
- running the following in your terminal will perform a GET request to fetch the form data
```bash
curl --location 'http://127.0.0.1:8080/form-data' --header 'Content-Type: application/json'
```

## Introduction
The purpose of this project is to evaluate your full stack web development skills with an example project that closely resembles your day to day tasks at Vial. 

You will build a simple **Query Management Application** where users can create queries. Each query will have a title, description, date, and a status (OPEN, RESOLVED). The application will consist of a simple frontend (UI), a backend API, and a database to persist the query data.

Queries in the context of an EDC (electronic data capture) system help identify and flag incorrect data entries for patients and alert effected data managers/ users when a query needs to be resolved.

**NOTE: Images provided in the assignment are just examples, and the frontend does not need to look the same as the provided mock. Be creative with your design!**

- for example some images show the username information, this is not required to submit the assignment

Some helpful links:

- https://medrio.com/blog/query-management-in-clinical-trials/
- [https://www.biopharmaservices.com/blog/data-cleaning-and-query-management-importance-in-edc/#:~:text=Query management is essential for,risk of regulatory non-compliance](https://www.biopharmaservices.com/blog/data-cleaning-and-query-management-importance-in-edc/#:~:text=Query%20management%20is%20essential%20for,risk%20of%20regulatory%20non%2Dcompliance)

## Preferred workflow
* Fork the repository
* Create as many commits as needed, with the corresponding descriptive message/description

## Tech stack
* [Node](https://nodejs.org/en/)
* [Typescript](www.google.com)
* [Fastify](https://www.fastify.io/)
* [Prisma ORM](https://www.prisma.io/)
* [PostgreSQL](https://www.postgresql.org/)
* [Docker and Compose](https://www.docker.com/)

### Requirements

1. **Frontend (UI)**:
    - Use TypeScript / React or other framework to build a single-page web application.
    - Implement a table view to display data that can be queried (for example below)
        
        ![table-view.png](./assets/table-view.png)
        
        - the key here is to implement a view that contains
            - **Question Column**
            - **Answer Column**
            - **Queries Column**
                - the User should be able to hover over this column and “Create Query” if no query exists (e.g. the data does not have a query associated with it)
                    - a “+” icon should be displayed with a tooltip “Create Query”
                - otherwise the query is either
                    - “OPEN” - Red Status with question mark icon
                    - “RESOLVED” - Green Status with checkmark icon
        - the table view is fetched from the form-data endpoint
    - User should be able to add a new query using the “Create Query” button which opens a modal like below:
        
        ![create-query.png](./assets/create-query.png)
        
        - User should be able to edit the description textbox and submit the form
        - This data should then be saved in the backend
            - Payload information
                - Title (based on the **question** of clicked on data, e.g. “What was the Individual Dose of the Medication”)
                - Description (from user input)
                - form data id
    - If the User is viewing a query that already exists and has a status “OPEN”
        
        ![open-query.png](./assets/open-query.png)
        
        - User should view something similar to this indicating that the query status is open
        - User should see what the description of the query is
        - User should see a button to “Resolve” this query
            - when “resolve” button is clicked the api should send a request to the backend to update the query status to “RESOLVED”
    - User should be able to view a “resolved” query
        
        ![resolved-query.png](./assets/resolved-query.png)
        
        - should clearly indicate that the query is resolved
        - should clearly display the description text of the query
        - should clearly display the date the query was created or updated
2. **Backend (API)**:
    - Build a RESTful API for the queries, a simple application skeleton is provided for the BE with seed data for the form data
    - The API should have the following endpoints:
        - ENDPOINT 1: Retrieve a list of all form data and related query data.
          - the list endpoint is already implemented but you will have to include the query relation
        - ENDPOINT 2: Create a new query.
        - ENDPOINT 3: Update an existing query by ID.
        - (BONUS ENDPOINT): Delete a query by ID.
3. **Database**:
    - (Given) The **form data model** should have the following fields:
      - `id`: Unique identifier (auto-increment or UUID).
      - `question`: String, required
      - `answer`: String, required
    - The **query model** should have the following fields:
        - `id`: Unique identifier (auto-increment or UUID).
        - `title`: String, required.
        - `description`: String, optional.
        - `createdAt`: Date or string (ISO format), required.
            - Indicates when the query was created.
        - `updatedAt`: Date or string (ISO format), required.
            - Indicates when the query was last updated.
        - `status`: String, possible values (OPEN, RESOLVED).
        - `formData`: relational field to a formData
        - `formDataId`: the relational foreign key id of the formData

### Guidelines

- **Tech Stack**: You are free to choose any technologies or libraries you prefer, but please stick to modern web development practices.
- **Code Quality**: Please ensure your code is clean, well-organized, and well-documented. Add comments where necessary to explain key decisions.
- **Time Management**: This is intended to be a 4+ hour assignment. Focus on getting the basic functionality working first, and add optional features if you have time.
- **(OPTIONAL) API Documentation**: Provide basic API documentation (e.g., using Swagger or in README.md).
- **(OPTIONAL) Deployment**: If possible, deploy your application to a service like Heroku, Vercel, or Netlify, and share the live URL with us.

### Submission Instructions

- Share a GitHub repository with your code and provide instructions for how to run the project locally.
- (OPTIONAL) If you deploy the application, include the live link in the repository’s README.
- Ensure that your submission includes clear documentation on how to set up and run the backend and frontend.

---

We hope you have fun with the assignment and we look forward to hearing from you!

-------------------------------------------------------------------------------------------------------
### API Documentation
API Documentation

Base URL

Base URL: http://localhost:8080

## 1. GET /form-data

Fetches all the form data entries, including associated queries.

Request

Method: GET

URL: /form-data

Headers:

Content-Type: application/json

Response

Status: 200 OK

Body:

{
  "total": 10,
  "formData": [
    {
      "id": "uuid",
      "question": "Question text",
      "answer": "Answer text",
      "query": {
        "id": "uuid",
        "title": "Query title",
        "description": "Query description",
        "status": "OPEN",
        "createdAt": "2025-01-01T12:00:00Z",
        "updatedAt": "2025-01-02T12:00:00Z",
        "formDataId": "uuid"
      }
    }
  ]
}


Fields:

total: The total number of FormData entries.

formData: An array of FormData entries. Each entry contains:

id: The unique identifier of the form data.

question: The question text associated with the form data.

answer: The answer text associated with the form data.

query: The associated query object (if any), including its status and details. null if no query exists.

## 2. POST /queries

Creates a new query for a specific form data entry.

Request

Method: POST

URL: /queries

Headers:

Content-Type: application/json

Body:

{
  "title": "Query Title",
  "description": "Query Description",
  "formDataId": "uuid"
}


Fields:

title: The title of the query.

description: A detailed description of the query.

formDataId: The unique ID of the form data to associate with the query.

Response

Status: 201 Created

Body:

{
  "id": "uuid",
  "title": "Query Title",
  "description": "Query Description",
  "status": "OPEN",
  "createdAt": "2025-01-01T12:00:00Z",
  "updatedAt": "2025-01-01T12:00:00Z",
  "formDataId": "uuid"
}


Fields:

id: The unique identifier of the created query.

title: The title of the query.

description: The description of the query.

status: The status of the query (OPEN by default).

createdAt: The timestamp when the query was created.

updatedAt: The timestamp when the query was last updated.

formDataId: The ID of the associated form data.

## 3. PATCH /queries/:id

Updates the status of an existing query to RESOLVED.

Request

Method: PATCH

URL: /queries/:id

Headers:

Content-Type: application/json

URL Parameters:

id: The unique ID of the query to update.

Body:

{
  "status": "RESOLVED"
}


Fields:

status: The new status of the query (OPEN or RESOLVED).

Response

Status: 200 OK

Body:

{
  "id": "uuid",
  "title": "Query Title",
  "description": "Query Description",
  "status": "RESOLVED",
  "createdAt": "2025-01-01T12:00:00Z",
  "updatedAt": "2025-01-02T12:00:00Z",
  "formDataId": "uuid"
}


Fields:

Same as the response from POST /queries, but with the updated status.

## 4. DELETE /queries/:id

Deletes a query by its ID.

Request

Method: DELETE

URL: /queries/:id

Headers:

Content-Type: application/json

URL Parameters:

id: The unique ID of the query to delete.

Response

Status: 200 OK

Body:

{
  "message": "Query deleted successfully",
  "deletedQuery": {
    "id": "uuid",
    "title": "Query Title",
    "description": "Query Description",
    "status": "OPEN",
    "createdAt": "2025-01-01T12:00:00Z",
    "updatedAt": "2025-01-01T12:00:00Z",
    "formDataId": "uuid"
  }
}


Fields:

message: A confirmation message that the query has been successfully deleted.

deletedQuery: The details of the deleted query.

Error Responses

If an error occurs, the backend will return a JSON response with an appropriate error message:

Example Error Response

{
  "message": "Query not found"
}


Common Errors:

400 Bad Request: When the request body is invalid.

404 Not Found: When the query or form data does not exist.

500 Internal Server Error: When something goes wrong on the server side.

## 5. Running and Testing the API

Once your backend is running:

Make sure the backend API is running on port 8080.

docker-compose up


Test API endpoints using curl or Postman.

To create a new query: POST /queries

To update a query's status: PATCH /queries/:id

To delete a query: DELETE /queries/:id


### Instructions on how to set up backend and frontend

## Setting up the Backend (API)

Prerequisites

Make sure you have Docker and Docker Compose installed.

You need Node.js and npm to be installed on your machine.

# 1. Clone the Repository (if not already done)

If you haven’t already, clone the repository to your local machine:

git clone https://github.com/aileen0101/take-home-assignment-A.git
cd take-home-assignment-A

# 2. Build Docker Containers

Build the Docker containers by running the following command in the root of the backend project:

docker-compose build

Start the Docker containers (including your PostgreSQL database and the backend API):

docker-compose up

This will run both the backend API and PostgreSQL.

You should now have both services running, with PostgreSQL running on port 5432 and the backend running on port 8080.

# 3. Running Migrations

Run the Prisma migrations to create the database tables for your backend API:

docker exec -it vial-backend-api npx prisma migrate deploy

# 4. Seeding the Database

To seed the database with initial data (form data and queries), run:

docker exec -it vial-backend-api npx prisma db seed

# 5. Test the Backend API (OPTIONAL)

Your backend API should now be running and listening on port 8080. You can test the endpoints using curl or Postman. Some example API tests:

GET form data:

curl http://localhost:8080/form-data


POST a new query (replace formDataId with a valid ID):

curl --location --request POST 'http://localhost:8080/queries' \
--header 'Content-Type: application/json' \
--data-raw '{
  "title": "Invalid dosage",
  "description": "The dosage value seems incorrect. Please verify.",
  "formDataId": "replace_with_formData_id"
}'


PATCH (resolve) an existing query (replace queryId with an actual query ID):

curl --location --request PATCH 'http://localhost:8080/queries/queryId' \
--header 'Content-Type: application/json' \
--data-raw '{
  "status": "RESOLVED"
}'


DELETE a query (replace queryId with an actual query ID):

curl --location --request DELETE 'http://localhost:8080/queries/queryId'


## Setting up the Frontend (React App)

# 1. Install Dependencies

Navigate to the frontend directory in your project.

Install the necessary dependencies using npm:

npm install

If you encounter issues with dependencies, you can install them manually:

npm install axios react-modal

# 2. Start the Frontend Application

To start the frontend, run:

npm start

This will:

Start the React development server.

The app should now be running at http://localhost:3000.

## Frontend Features 

# 1. Display Form Data and Associated Queries

Form data is fetched from the backend API and displayed in a table format.

If no query exists, a button will allow the user to create a new query for that form data.

If a query exists, the query is shown with its status, and the user can click to view the details.

# 2. Create Query

Clicking the “+ Add Query” button opens a modal to create a new query.

The new query is immediately updated on the frontend without requiring a reload.

# 3. Resolve Query

If the query is unresolved (OPEN), a “Resolve Query” button appears.

Clicking Resolve updates the query's status to RESOLVED on both the frontend and backend.

# 4. View Query Details

Clicking on an existing query opens a modal with the query details (title, status, description, etc.).

If the query is OPEN, the user can click “Resolve Query” to resolve it.

If the query is RESOLVED, it will show the resolved status and details.

# 5. Delete Query

If the query exists, a “Delete Query” button is shown in the query details modal.

Clicking Delete removes the query from the backend and updates the frontend immediately to reflect the change.

## Troubleshooting

If you run into any issues while running the backend or frontend, here are some common solutions:

# Backend Database Not Connecting:

Check if the Docker container for PostgreSQL is running properly.

Ensure the DATABASE_URL in the .env file is correct.

# API Call Errors:

Check if the backend API server is running and accessible at http://localhost:8080.

Make sure you have run the Prisma migrations to set up the database schema (npx prisma migrate deploy).

# Frontend Issues:

Ensure all dependencies are correctly installed (npm install).

If using react-modal, make sure it's initialized correctly and no JavaScript errors appear in the browser's console.


