/**
 * QueryRow Component
 * 
 * This component represents a single row in the table, displaying information about a form data entry
 * and its associated query (if one exists).
 * 
 * Features:
 * - Displays the question and answer from the form data.
 * - Shows the query status (OPEN or RESOLVED) with appropriate visual cues.
 * - Allows the user to:
 *   - Add a new query if none exists.
 *   - View query details by opening a modal.
 *   - Resolve an open query.
 *   - Delete an existing query.
 * - Provides hover effects and smooth transitions for enhanced user experience.
 * 
 * State Management:
 * - `isDetailsModalOpen` (boolean): Tracks whether the query details modal is open or closed.
 * 
 * Props:
 * - `data` (IFormData): The form data entry for the current row, including its associated query.
 * - `openModal` (function): Callback to open the query creation modal for this form data entry.
 * - `setQueries` (function): Callback to update the parent component's state when a query is resolved or deleted.
 * 
 * Event Handlers:
 * - `openQueryDetails`: Opens the query details modal for the current query.
 * - `closeQueryDetails`: Closes the query details modal.
 * - `handleResolve`: Marks the current query as resolved, updates the backend, and reflects changes in the parent component.
 * - `handleDelete`: Deletes the current query, updates the backend, and reflects changes in the parent component.
 * 
 * Dependencies:
 * - `QueryDetailsModal`: A modal component for viewing, resolving, and deleting queries.
 * - API functions `updateQueryStatus` and `deleteQuery` for interacting with the backend.
 */

import React, { useState } from 'react';
import { IFormData, IQuery } from '../types/index.ts';
import { updateQueryStatus, deleteQuery } from '../api/api.ts';
import QueryDetailsModal from './QueryDetailsModal.tsx';

interface Props {
  data: IFormData;
  openModal: (formData: IFormData) => void;
  setQueries: React.Dispatch<React.SetStateAction<IFormData[]>>;
}

const QueryRow: React.FC<Props> = ({ data, openModal, setQueries }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const openQueryDetails = () => setIsDetailsModalOpen(true);
  const closeQueryDetails = () => setIsDetailsModalOpen(false);

  const handleResolve = async (queryId: string) => {
    try {
      await updateQueryStatus(queryId, { status: 'RESOLVED' });
      setQueries((prevData) =>
        prevData.map((item) =>
          item.id === data.id
            ? { ...item, query: { ...item.query, status: 'RESOLVED' } }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to resolve query:', err);
    }
  };

  const handleDelete = async (queryId: string) => {
    try {
      await deleteQuery(queryId);
      setQueries((prevData) =>
        prevData.map((item) =>
          item.id === data.id ? { ...item, query: null } : item
        )
      );
    } catch (err) {
      console.error('Failed to delete query:', err);
    }
  };

  return (
    <tr>
      <td>{data.question}</td>
      <td>{data.answer}</td>
      <td>
        {data.query ? (
          <div
            style={{
              color: data.query.status === 'OPEN' ? 'red' : 'green',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: '#f0f0f0',
              transition: 'background-color 0.3s ease',
            }}
            onClick={openQueryDetails}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0'; // Slightly darker background on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'; // Revert background color
            }}
          >
            {data.query.status === 'OPEN' ? '❓ Open' : '✅ Resolved'}
          </div>
        ) : (
          <button onClick={() => openModal(data)}>+ Add Query</button>
        )}
        <QueryDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeQueryDetails}
          query={data.query}
          handleResolve={handleResolve}
          handleDelete={handleDelete}
        />
      </td>
    </tr>
  );
};

export default QueryRow;
