// src/components/QueryDetailsModal.tsx

/**
 * QueryDetailsModal Component
 * 
 * This component displays the details of a specific query in a modal dialog.
 * 
 * Features:
 * - Displays key details about the query, such as title, status, description, and timestamps.
 * - Provides functionality to resolve an open query with a "Resolve Query" button.
 * - Includes a "Delete Query" button to remove the query from the database and update the frontend.
 * - Allows users to close the modal.
 * 
 * Props:
 * - `isOpen` (boolean): Determines if the modal is open or closed.
 * - `onClose` (function): Callback to close the modal.
 * - `query` (IQuery): The query object containing all relevant details (must be provided).
 * - `handleResolve` (function): Function to mark a query as resolved.
 * - `handleDelete` (function): Function to delete the query.
 * 
 * Dependencies:
 * - React Modal library for displaying the modal.
 * - API function `deleteQuery` for handling query deletion.
 */

import React from 'react';
import Modal from 'react-modal'; // Modal library for displaying the query details
import { deleteQuery } from '../api/api.ts'; // Assuming this API handles query deletion

interface Props {
  isOpen: boolean;
  onClose: () => void;
  query: IQuery; // This should always be passed from the parent component
  handleResolve: (queryId: string) => void; // Function to resolve the query
  handleDelete: (queryId: string) => void; // Function to delete the query
}

const QueryDetailsModal: React.FC<Props> = ({ isOpen, onClose, query, handleResolve, handleDelete }) => {
  if (!query) return null; // Return null if the query is undefined or invalid

  const handleDeleteClick = async () => {
    try {
      await handleDelete(query.id); // Delete the query on the backend
      onClose(); // Close the modal after successful deletion
    } catch (err) {
      console.error('Failed to delete query:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Query Details</h2>
      <div>
        <p><strong>Title:</strong> {query.title}</p>
        <p><strong>Status:</strong> {query.status === 'OPEN' ? '❓ Open' : '✅ Resolved'}</p>
        <p><strong>Description:</strong> {query.description || 'No description provided'}</p>
        <p><strong>Created At:</strong> {new Date(query.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(query.updatedAt).toLocaleString()}</p>
      </div>
      
      {/* Show the resolve button only if the query is still open */}
      {query.status === 'OPEN' && (
        <button onClick={() => handleResolve(query.id)}>Resolve Query</button>
      )}

      {/* Delete Query button */}
      <button onClick={handleDeleteClick} className="delete-btn">
        Delete Query
      </button>

      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default QueryDetailsModal;
