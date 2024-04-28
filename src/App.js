import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import PoolReq from './screens/PoolReq';
import PoolPage from './screens/PoolPage';
import DriverHome from './screens/DriverHome';
import DriverPage from './screens/DriverPage';
import DriverStatus from './screens/DriverStatus';

function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route exact path = "/" element = {<Home></Home>}></Route>
          <Route exact path = "/poolpage" element = {<PoolPage></PoolPage>}></Route>
          <Route exact path = "/login" element = {<Login></Login>}></Route>
          <Route exact path = "/signup" element = {<Signup></Signup>}></Route>
          <Route exact path = "/poolreq" element = {<PoolReq></PoolReq>}></Route>
          <Route exact path = "/dhome" element = {<DriverHome></DriverHome>}></Route>
          <Route exact path = "/dpage" element = {<DriverPage></DriverPage>}></Route>
          <Route exact path = "/dstatus" element = {<DriverStatus></DriverStatus>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
