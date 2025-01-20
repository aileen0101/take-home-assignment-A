// src/components/QueryDetailsModal.tsx
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
