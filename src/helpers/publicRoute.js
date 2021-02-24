import React, { useContext } from "react"
import {Redirect, Route} from "react-router-dom"
import {socialContext} from "../socialContext"

function PublicRoute({component:Component,...rest}){

    const {authentication} = useContext(socialContext)

    return(<Route {...rest} render={ ({props}) => authentication ?  <Redirect  to="/home" /> : <Component {...props}/>  }   />)

}

export default PublicRoute