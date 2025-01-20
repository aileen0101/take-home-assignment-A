import React from 'react';
import Table from './components/Table.tsx';

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Query Management App</h1>
      <Table />
    </div>
  );
};

export default App;
