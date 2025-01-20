// src/components/QueryRow.tsx
import React, { useState, useEffect } from 'react';
import { IFormData, IQuery } from '../types/index.ts';
import { updateQueryStatus } from '../api/api.ts'; // Function to update query status
import QueryDetailsModal from './QueryDetailsModal.tsx'; // Modal to show query details

interface Props {
  data: IFormData;
  openModal: (formDataId: string) => void;
  setQueries: React.Dispatch<React.SetStateAction<IFormData[]>>; // This is passed from Table.tsx
}

const QueryRow: React.FC<Props> = ({ data, openModal, setQueries }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // For opening query details modal
  const [queries, setLocalQueries] = useState<IQuery[]>(data.query ? [data.query] : []); // Local state for queries

  useEffect(() => {
    // Ensure local state is synchronized when the data prop changes
    if (data.query) {
      setLocalQueries([data.query]);
    }
  }, [data.query]); // Depend on data.query to re-sync state

  const openQueryDetails = () => {
    setIsDetailsModalOpen(true); // Open the modal when the query is clicked
  };

  const closeQueryDetails = () => {
    setIsDetailsModalOpen(false); // Close the modal
  };

  const handleResolve = async (queryId: string) => {
    try {
      // Update query status on the backend to "RESOLVED"
      await updateQueryStatus(queryId, { status: 'RESOLVED' });
      
      // Update the local state
      setLocalQueries((prevQueries) =>
        prevQueries.map((query) =>
          query.id === queryId ? { ...query, status: 'RESOLVED' } : query
        )
      );

      // Update the parent state (Table.tsx)
      setQueries((prevData) =>
        prevData.map((item) =>
          item.id === data.id
            ? { ...item, query: { ...item.query, status: 'RESOLVED' } } // Update the query status in the parent component
            : item
        )
      );
    } catch (err) {
      console.error('Failed to resolve query:', err);
    }
  };

  return (
    <tr>
      <td>{data.question}</td>
      <td>{data.answer}</td>
      <td>
        {queries.length > 0 ? (
          queries.map((query) => (
            <div
              key={query.id}
              style={{
                color: query.status === 'OPEN' ? 'red' : 'green',
                cursor: query.status === 'OPEN' ? 'pointer' : 'default',
              }}
              onClick={openQueryDetails} // Open the query details view when clicked
            >
              {query.status === 'OPEN' ? '❓ Open' : '✅ Resolved'}
            </div>
          ))
        ) : (
          <button onClick={() => openModal(data.id)}>+ Add Query</button>
        )}
      </td>

      <QueryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeQueryDetails}
        query={queries[0] || {}} // If query doesn't exist, pass an empty object
        handleResolve={handleResolve} // Pass handleResolve function to resolve the query from the modal
      />
    </tr>
  );
};

export default QueryRow;