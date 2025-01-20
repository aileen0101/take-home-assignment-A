// src/components/QueryModal.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { createQuery } from '../api/api.ts';
import { IQuery } from '../types/index.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formDataId: string;
  formDataTitle: string;
  onQueryCreated: (query: IQuery) => void;
}

const QueryModal: React.FC<Props> = ({ isOpen, onClose, formDataId, formDataTitle, onQueryCreated }) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState(''); // State to hold error message

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Must submit query description'); // Show error if description is empty
      return;
    }

    try {
      const newQuery = await createQuery({
        title: `Query for ${formDataTitle}`,
        description,
        formDataId,
      });
      onQueryCreated(newQuery);
      onClose();
    } catch (err) {
      console.error('Failed to create query:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal-content">
      <h2>Create Query</h2>
      <textarea
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          if (error) setError(''); // Clear error when the user starts typing
        }}
        placeholder="Enter query description"
        className="textarea"
      />
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>} {/* Show error message */}
      <div>
        <button onClick={handleSubmit} className="submit-btn">Submit</button>
        <button onClick={onClose} className="cancel-btn">Cancel</button>
      </div>
    </Modal>
  );
};

export default QueryModal;
