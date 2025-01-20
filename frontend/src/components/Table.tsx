// src/components/Table.tsx
import React, { useEffect, useState } from 'react';
import { getFormData } from '../api/api.ts'; // API to fetch form data
import { IFormData, IQuery } from '../types/index.ts'; // Types for form data and query
import QueryRow from './QueryRow.tsx'; // Component for each row
import QueryModal from './QueryModal.tsx'; // Modal for creating queries

const Table: React.FC = () => {
  const [formData, setFormData] = useState<IFormData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormDataId, setSelectedFormDataId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFormData();
        setFormData(response.formData); // Set form data from backend
      } catch (err) {
        console.error('Error fetching form data:', err);
      }
    };
    fetchData();
  }, []);

  const openModal = (formDataId: string) => {
    setSelectedFormDataId(formDataId); // Set the ID for the selected FormData
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFormDataId(null); // Reset formDataId when closing the modal
  };

  // When the query is created, update the frontend state immediately
  const handleQueryCreated = (newQuery: IQuery) => {
    setFormData((prevData) =>
      prevData.map((item) =>
        item.id === selectedFormDataId
          ? { ...item, query: newQuery } // Add the new query to the selected FormData row
          : item
      )
    );
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Queries</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((item) => (
            <QueryRow
              key={item.id}
              data={item}
              openModal={openModal}
              setQueries={setFormData} // Pass setQueries function to QueryRow
            />
          ))}
        </tbody>
      </table>

      <QueryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formDataId={selectedFormDataId || ''}
        onQueryCreated={handleQueryCreated} // Pass the callback to update the frontend state
      />
    </div>
  );
};

export default Table;
