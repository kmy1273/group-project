import "./App.css";
import DayList from "./component/DayList";
import Header from "./component/Header";
import Day from "./component/Day";
import CreateWord from "./component/CreateWord";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Header />
      <Routes>
        <Route exact path="/" element={<DayList />} />
        <Route path="/day/:day" element={<Day />} />
        <Route path="/create_word" element={<CreateWord />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;