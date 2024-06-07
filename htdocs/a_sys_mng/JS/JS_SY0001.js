import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const SY0001 = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/data-dao_sy0001_s_01')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      });
  }, []);

  return (
    <div>
      <h1>SQL Query Results for SY0001:</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SY0001 />);
}
