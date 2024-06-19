import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import DriverHome from './screens/DriverHome';

function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route exact path = "/" element = {<Home></Home>}></Route>
          <Route exact path = "/login" element = {<Login></Login>}></Route>
          <Route exact path = "/signup" element = {<Signup></Signup>}></Route>
          <Route exact path = "/dhome" element = {<DriverHome></DriverHome>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
