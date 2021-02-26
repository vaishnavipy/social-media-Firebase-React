import React, { useContext } from "react"
import { useEffect } from "react/cjs/react.development";
import { database } from "../firebase";
import { socialContext } from "../socialContext";
import ProfileCard from "./profileCard"
import Accordion from "./accordion"


function MyProfile(){

    const {handleCurrentUser} = useContext(socialContext)

    useEffect(()=>{

        let currentUserId = localStorage.getItem("currentUser")

        database.ref("users/"+currentUserId).once("value",(snapshot)=>{

            const {username,email,userpic,uid,location,bio,followers,following} = snapshot.val()

            handleCurrentUser({username:username,email:email,userpic:userpic,uid:uid,location:location,bio :bio,followers:followers,following})

        })

    },[])

    return(
    <div> 
        <div className="home-container">

            <Accordion />
            <ProfileCard />
            
        </div>
    </div>)
}

export default MyProfile;