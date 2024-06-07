import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <head>
        <meta charSet="utf-8" />
        <meta name="Author" content="" />
        <meta name="Keywords" content="" />
        <meta name="Description" content="" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta httpEquiv="Cache-Control" content="No-Cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>(주)BOMSOFT MES SYSTEM</title>
      </head>
      <body>
        <form action="act_login.php" method="post" className="login_f" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="blind">(주)BOMSOFT MES SYSTEM</legend>
            <p>
              <label htmlFor="project">접속서버</label>
              <select name="project" id="project" style={{ width: '250px', height: '28px', textAlign: 'left' }}>
                <option value="BOMIS">BOMS_MES</option>
                {/* <option value="BOMAI">BOMS_APS</option> */}
                {/* <option value="BOMDS">BOMS_DAS</option> */}
                {/* <option value="BOMPL">BOMS_PLC</option> */}
                {/* <option value="BOMEN">BOMS_ENG</option> */}
                {/* <option value="CLOUD">클라우드</option> */}
              </select>
            </p>
            <p>
              <label htmlFor="user_id">사원 ID</label>
              <input type="text" name="user_id" id="user_id" placeholder="사원 ID 입력" />
            </p>
            <br />
            <p>
              <label htmlFor="user_pw">비밀번호</label>
              <input type="password" name="user_pw" id="user_pw" placeholder="비밀번호 입력" />
            </p>
            <button type="submit" style={{ background: 'none', border: 'none', padding: 0 }}>
              <img src="/images/login/btn_login.png" alt="로그인" style={{ marginTop: '20px' }} />
            </button>
          </fieldset>
        </form>
      </body>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
