import React, { useContext, useState } from "react"
import { Button } from 'reactstrap';
import validateEmail from "../helpers/validateEmail"
import {auth, database,storage} from "../firebase" 
import {socialContext} from "../socialContext"
import {Link} from "react-router-dom";
import personImg from "./person.png"



function SignUp(){

    const [input,setInput] = useState({email:"",password:"",c_password:"",handle:""})

    const [error,setError] = useState({email:"",password:"",auth_error:"",handle:""})

    const {handleAuthentication,currentUser,handleCurrentUser} = useContext(socialContext)

    function handleChange(e){
        const {name,value} = e.target;

        setInput(prevState => ({...prevState,[name]:value}) )

    }

   
    function checkPasswords(){
        if( input.password && input.password === input.c_password){
            setError(prevState => ({...prevState,password:""}) ) 
            return true
        }else{
            setError(prevState => ({...prevState,password:"Please Enter a valid password"}) )
            return (false)
        }
    }


    function handleSignIn(){

        setError(prevState => ({...prevState,email: validateEmail(input.email)}) ) ;
       
        let samePassword = checkPasswords();

        let sameHandle = checkHandle();
        console.log(sameHandle,"result")

        if(sameHandle){
            setError(prevState => ({...prevState,handle: "Username already exsits, choose a different name."}) ) ;
        }

        if(!input.handle){
            setError(prevState => ({...prevState,handle: "Fill Out the username"}) ) ;
        }

        if(!error.email && samePassword && !sameHandle && input.handle){
          
            auth().createUserWithEmailAndPassword(input.email, input.password)
                .then((userCredential) => {
                   
                    // Signed in 
                    var user = userCredential.user;
                    // ...

                    //Create a ref to image in cloud storage and get the download url

                    var storageRef = storage.ref();

                    var personRef = storageRef.child("images/person.png")

                    //Now upload the file to the ref
                    var uploadTask=personRef.put(personImg)

                    uploadTask.on("state_changed",(snapshot)=>{},(error)=>{console.log(error)},()=> {

                        uploadTask.snapshot.ref.getDownloadURL((url) => {
                            console.log(url)
                        })

                    })

                    //Add the user to the Real-time database , every time a new user signs-in
                    database.ref("users/"+user.uid).set({
                        username : input.handle,
                        email : user.email,
                        uid : user.uid,
                        userpic : personImg 
                    })

                    
                    //Every time user signs-up set currentUser in local cache
                    localStorage.setItem("currentUser",user.uid)

                    setError(prevState => ({...prevState,auth_error:""}) )
                    handleAuthentication(true)
                })
                .catch((error) => {
                    setError(prevState => ({...prevState,auth_error:error.message}) )
                    handleAuthentication(false)
                  
                });

        }

    }

    function checkHandle(){
        let returnValue=false;
        database.ref("users").once("value",(snapshot)=>{
            snapshot.forEach(snap => {
                console.log(snap.val().username,input.handle,snap.val(),"hi")
              if(snap.val().username === input.handle ){
                    console.log(true)
                    returnValue = true;
              }
            })
        })
        return returnValue
    }

    return(
    <div className="container">
        <form>
            <p className="form-txt">Sign Up</p>
            <input type="eamil" placeholder="Email" required name="email" value={input.email}  onChange={handleChange}/>
            {error.email ? <p className="error">{error.email}</p> : ""}
            <input type="password" placeholder="Password" required name="password" value={input.password} onChange={handleChange}/>
            <input type="password" placeholder="Confirm Password" required   name="c_password" value={input.c_password} onChange={handleChange}  />
            {error.password ? <p className="error">{error.password}</p> : ""}
            <input type="text" placeholder="Your Handle, eg:@me"  name="handle" value={input.handle} onChange={handleChange} required/>
            {error.auth_error ? <p className="error">{error.auth_error}</p> : ""}
            {error.handle ? <p className="error">{error.handle}</p> : ""}
            <Button color="primary" className="btn" onClick={handleSignIn}>Sign Up</Button>
           
            <p>Already have an account ? Sign In <Link to="/login">here</Link> </p>
        </form>

    </div>)
}

export default SignUp