import React,{ useContext, useState } from "react"
import { useEffect } from "react/cjs/react.development";
import { Button } from 'reactstrap';
import {auth, database} from "../firebase" 
import { socialContext } from "../socialContext";


function Login(){

    const [input,setInput] = useState({email:"",password:""})

    const [error,setError] = useState("")

    const {handleAuthentication} = useContext(socialContext)

    function handleChange(e){
        const {name,value} = e.target;

        setInput(prevState => ({...prevState,[name]:value}) )

    }


    function handleLogin(){
       
       auth().signInWithEmailAndPassword(input.email, input.password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                
                // ...
               
                //Every time user logins set currentUser in local cache, now your currentuser will be set in profile card from local cache
                localStorage.setItem("currentUser",user.uid)
   
                handleAuthentication(true)
              
                setError("")
            })
            .catch((err) => {
               setError(err.message)
                console.log(err.message)
            });

       
    }
  
 
   
       


    return(
    <div className="container">
        <form>
            <p className="form-txt">Login</p>

            <input type="eamil" placeholder="Email" required name="email" value={input.email}  onChange={handleChange}/>
           

           <input type="password" placeholder="Confirm Password" required   name="password" value={input.password} onChange={handleChange}  />
           {error ? <p className="error">{error}</p> : ""}
            <Button color="primary" className="btn" onClick={handleLogin}>Login</Button>
           
            <p>Dont have an account? Sign Up <a href="/"> here</a></p>
        </form>
    </div>)
}

export default Login;