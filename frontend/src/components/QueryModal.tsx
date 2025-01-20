// src/components/QueryModal.tsx

/**
 * QueryModal Component
 * 
 * This component displays a modal dialog for creating a new query.
 * 
 * Features:
 * - Allows users to input a description for the query.
 * - Automatically generates a title for the query based on the associated form data's title.
 * - Validates the input to ensure the description is not empty.
 * - Displays an error message if the description is missing.
 * - Submits the new query to the backend and updates the parent component's state upon successful creation.
 * 
 * Props:
 * - `isOpen` (boolean): Determines if the modal is open or closed.
 * - `onClose` (function): Callback to close the modal.
 * - `formDataId` (string): The ID of the form data for which the query is being created.
 * - `formDataTitle` (string): The title of the form data, used to generate the query title.
 * - `onQueryCreated` (function): Callback to update the parent component's state with the newly created query.
 * 
 * Dependencies:
 * - React Modal library for displaying the modal.
 * - API function `createQuery` for handling query creation.
 * 
 * Validation:
 * - Ensures the query description is provided by the user.
 * - Displays an error message (`"Must submit query description"`) if validation fails.
 */

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
