import React ,{useContext} from "react"
import logo from "../logo.png"
import {useLocation} from "react-router-dom"
import {auth} from "../firebase";
import {socialContext} from "../socialContext"

function Navbar(){
    let location = useLocation();

    const {handleAuthentication} = useContext(socialContext)

    function handleSignOut(){
        auth().signOut().then(() => {
            // Sign-out successful.
           
            handleAuthentication(false)
          }).catch((error) => {
           console.log(error)
          });
          
          
    }
    
    

    return( 
    <div className="navbar">
        <div className="logo"><img src={logo} /><h1>React Social</h1></div>
        {location.pathname == "/home" ? <div className="logins"> <a href="/login" onClick={handleSignOut}>Sign Out</a></div> 
        : 
         <div className="logins"><a href="/login">Login</a><a href="/">Sign-Up</a></div>}

       
    </div>
)
}

export default Navbar;