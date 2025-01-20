// src/components/QueryModal.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { createQuery } from '../api/api.ts'; // Function to create query

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formDataId: string;
  onQueryCreated: (query: IQuery) => void; // Callback to update frontend immediately
}

const QueryModal: React.FC<Props> = ({ isOpen, onClose, formDataId, onQueryCreated }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      const newQuery = await createQuery({ title: `Query for ${formDataId}`, description, formDataId });
      onQueryCreated(newQuery); // Update frontend immediately with the new query
      onClose(); // Close the modal
    } catch (err) {
      console.error('Failed to create query:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Create Query</h2>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter query description"
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default QueryModal;
