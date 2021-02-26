import React,{useContext, useEffect} from "react"
import Posts from "./posts"
import ProfileCard from "./profileCard"
import {database} from "../firebase"
import { socialContext } from "../socialContext"


function Home(){

    const {handleCurrentUser} = useContext(socialContext)

      //WEhn you refresh compnent mounts again, so get UID from local storage to set currentUser
      useEffect(()=>{
        console.log("compnentn moutns")
        if(localStorage.currentUser){

            var currentUserUID = localStorage.getItem("currentUser")
           

             //Add a listeneer to listen to changes in your database in real time
            database.ref("users/"+ currentUserUID).on("value",(snapshot) => {
                console.log("url updated")
                const {username,email,userpic,uid,location,bio} = snapshot.val()

                handleCurrentUser({username:username,email:email,userpic:userpic,uid:uid,location:location,bio :bio})

            })

        }


    },[])
    
    return(
    <div className="home-container">

        <Posts />
        <ProfileCard />
        
    </div>)
}

export default Home