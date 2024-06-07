import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const SY0001 = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [globalKind, setGlobalKind] = useState('');
  const [sysCd, setSysCd] = useState('');
  const [sysCdNm, setSysCdNm] = useState('');
  const [pageNext, setPageNext] = useState(0);
  const [pageRow, setPageRow] = useState(10);

  const fetchData = () => {
    // API 호출
    fetch('http://192.168.0.54:3000/api/query', { // 서버의 IP 주소 사용
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dir: 'a_sys_mng/DAO',
        file: 'DAO_SY0001_S_01',
        params: {
          global_kind: globalKind,
          sys_cd: sysCd,
          sys_cd_nm: sysCdNm,
          page_next: pageNext,
          page_row: pageRow,
        }
      }),
    })
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
  };

  useEffect(() => {
    fetchData(); // 컴포넌트가 마운트될 때 데이터 가져오기
  }, [globalKind, sysCd, sysCdNm, pageNext, pageRow]); // 조건이 변경될 때마다 API 호출

  return (
    <div>
      <h1>SQL Query Results:</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <div>
        <input
          type="text"
          value={globalKind}
          onChange={(e) => setGlobalKind(e.target.value)}
          placeholder="Enter global_kind"
        />
        <input
          type="text"
          value={sysCd}
          onChange={(e) => setSysCd(e.target.value)}
          placeholder="Enter sys_cd"
        />
        <input
          type="text"
          value={sysCdNm}
          onChange={(e) => setSysCdNm(e.target.value)}
          placeholder="Enter sys_cd_nm"
        />
        <button onClick={fetchData}>Fetch Data</button>
      </div>
    </div>
  );
};

// 'root' 아이디를 가진 DOM 요소를 가져옵니다.
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<SY0001 />);
}
