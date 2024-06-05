import React, { useState, useEffect }  from 'react';
import { Axios } from 'axios';

// axios 추가
import axios from 'axios';
function App () {
 
	// 서버에서 받은 데이터를 console로 찍어서 확인한다.
  useEffect(() => {
    axios.get('/api/test')
      .then(res => console.log(res));
  })
 
  return (
    <div className="App">
        <button onClick={() => {
            // npm i axios | yarn add axios
            axios.get("http://localhost:3001/api/TBBS0013D")
                .then((res) => {
                    console.log(res);
                });
        }}>api 호출하기</button>
    </div>
  )
}
 
export default App;