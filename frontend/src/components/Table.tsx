// src/components/Table.tsx

/**
 * Table Component
 * 
 * This component serves as the main table view for displaying form data and associated queries.
 * 
 * Features:
 * - Fetches form data from the backend API and displays it in a tabular format.
 * - Allows users to create a new query for specific form data by opening a modal.
 * - Updates the frontend immediately when a new query is created.
 * - Passes necessary data (form data details) to child components like `QueryRow` and `QueryModal`.
 * 
 * State Management:
 * - `formData` (IFormData[]): Holds the list of form data entries fetched from the backend.
 * - `isModalOpen` (boolean): Tracks whether the query creation modal is open or closed.
 * - `selectedFormData` (IFormData | null): Tracks the currently selected form data for which the query is being created.
 * 
 * Props for Child Components:
 * - `QueryRow`: Displays individual form data rows with associated query information.
 * - `QueryModal`: Handles the creation of a new query for the selected form data.
 * 
 * Dependencies:
 * - API function `getFormData` for fetching form data from the backend.
 * - `QueryRow` component for rendering individual rows in the table.
 * - `QueryModal` component for creating new queries.
 */

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
