
import './App.css';
import Navbar from "./components/navbar"
import {Route,Switch} from "react-router-dom"
import SignUp from "./components/signup"
import Login from "./components/login"
import PublicRoute from './helpers/publicRoute';
import Home from "./components/home"
import Comments from "./components/comments"
import OthersProfile from "./components/othersProfile"
import MyProfile from "./components/myProfile"

function App() {

  

  return (
    <div  className="app-container">
      <Navbar />

      <Switch>
        <PublicRoute exact path="/" component={SignUp} ></PublicRoute>
        
        <PublicRoute exact path="/login" component={Login}  ></PublicRoute>

        <Route exact path="/home"><Home /></Route>

        <Route  path="/comments/:slug"><Comments /></Route>

        <Route path="/profile/:slug"><OthersProfile /></Route>

        <Route exact path="/profile"><MyProfile /></Route>
      </Switch>
     
    </div>
  );
}

export default App;
