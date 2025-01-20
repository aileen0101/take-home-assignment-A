// src/components/Table.tsx
import React, { useEffect, useState } from 'react';
import { getFormData } from '../api/api.ts';
import { IFormData, IQuery } from '../types/index.ts';
import QueryRow from './QueryRow.tsx';
import QueryModal from './QueryModal.tsx';

const Table: React.FC = () => {
  const [formData, setFormData] = useState<IFormData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState<IFormData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFormData();
        setFormData(response.formData);
      } catch (err) {
        console.error('Error fetching form data:', err);
      }
    };
    fetchData();
  }, []);

  const openModal = (formData: IFormData) => {
    setSelectedFormData(formData); // Set the selected FormData object
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFormData(null);
  };

  const handleQueryCreated = (newQuery: IQuery) => {
    setFormData((prevData) =>
      prevData.map((item) =>
        item.id === selectedFormData?.id
          ? { ...item, query: newQuery }
          : item
      )
    );
    closeModal();
  };

  return (
    <div className="table-container">
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
              setQueries={setFormData}
            />
          ))}
        </tbody>
      </table>

      {selectedFormData && (
        <QueryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          formDataId={selectedFormData.id}
          formDataTitle={selectedFormData.question} // Pass the form data title
          onQueryCreated={handleQueryCreated}
        />
      )}
    </div>
  );
};

export default Table;
