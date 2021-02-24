import React from "react"
import { useState } from "react/cjs/react.development"

const socialContext = React.createContext()


function SocialContextProvider({children}){


    const [authentication,setAunthentication] = useState(false);

    const [currentUser,setCurrentUser] = useState({username:"",email:""})

    function handleAuthentication(auth){
        setAunthentication(auth)
    }

    function handleCurrentUser(user){
       
        setCurrentUser(user)
    }

    return(
    <socialContext.Provider value={{authentication,handleAuthentication,currentUser,handleCurrentUser}}>
        {children}
    </socialContext.Provider>)

}

export {socialContext,SocialContextProvider}