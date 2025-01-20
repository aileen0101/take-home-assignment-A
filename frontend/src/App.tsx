// src/App.tsx
import React from 'react';
import './App.css'; // Import the global styles
import Table from './components/Table.tsx';

const App: React.FC = () => {
  return (
    <div>
      <h1>Query Management App</h1>
      <Table />
    </div>
  );
};

export default App;
