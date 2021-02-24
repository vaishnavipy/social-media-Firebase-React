
import './App.css';
import Navbar from "./components/navbar"
import {Route,Switch} from "react-router-dom"
import SignUp from "./components/signup"
import Login from "./components/login"
import PublicRoute from './helpers/publicRoute';
import Home from "./components/home"

function App() {

  

  return (
    <div >
      <Navbar />

      <Switch>
        <PublicRoute exact path="/" component={SignUp} ></PublicRoute>
        
        <PublicRoute exact path="/login" component={Login}  ></PublicRoute>

        <Route exact path="/home"><Home /></Route>
      </Switch>
     
    </div>
  );
}

export default App;
