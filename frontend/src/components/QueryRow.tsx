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
