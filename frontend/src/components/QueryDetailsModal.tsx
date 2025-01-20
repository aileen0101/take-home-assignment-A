// src/components/QueryDetailsModal.tsx
import React from 'react';
import Modal from 'react-modal'; // Modal library for displaying the query details

interface Props {
  isOpen: boolean;
  onClose: () => void;
  query: IQuery; // This should always be passed from the parent component
  handleResolve: (queryId: string) => void; // Function to resolve the query
}

const QueryDetailsModal: React.FC<Props> = ({ isOpen, onClose, query, handleResolve }) => {
  if (!query) return null; // Return null if the query is undefined or invalid

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

      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default QueryDetailsModal;
