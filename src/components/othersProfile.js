import React, { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { database } from "../firebase"
import { socialContext } from "../socialContext"
import OtherUserPosts from "./otherUserPosts"
import ProfileCard from "./profileCard"

function OthersProfile(){

    const {slug} = useParams();
    const{handleCurrentUser} = useContext(socialContext)

    //WHen compoennt moutns get the current user from the slug 
    useEffect(()=>{

        database.ref("users/"+slug).on("value",(snapshot) => {

            const {username,email,userpic,uid,location,bio,followers} = snapshot.val()

            handleCurrentUser({username:username,email:email,userpic:userpic,uid:uid,location:location,bio :bio,followers:followers})

        })

    },[])


    return(
    <div className="home-container">
        <OtherUserPosts uid={slug}/>
        <ProfileCard />
    </div>)
}

export default OthersProfile;