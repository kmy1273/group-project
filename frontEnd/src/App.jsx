import React, { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('http://localhost:8888/TBBS0013D')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err))
  }, [])
  return (
    <div>
      <table style={{border: "1px solid #000"}}>
        <thead>
          <th>global_kind</th>
          <th>mixrt_no</th>
          <th>mixrt_item_no</th>
          <th>cpnt_no</th>
        </thead>
        <tbody>
          {data.map((d, global_kind, mixrt_no, mixrt_item_no) => (
            <tr key={[global_kind, mixrt_no, mixrt_item_no]}>
              <td>{d.global_kind}</td>
              <td>{d.mixrt_no}</td>
              <td style={{textAlign: "right"}}>{d.mixrt_item_no}</td>
              <td>{d.cpnt_no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App