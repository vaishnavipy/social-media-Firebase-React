import React, { useContext,useRef,useEffect,useState } from "react"
import { socialContext } from "../socialContext"
import {MdEdit} from "react-icons/md"
import {AiFillCalendar} from "react-icons/ai"
import {database,storage} from "../firebase"


function ProfileCard(){
    const {currentUser,handleCurrentUser} = useContext(socialContext)
    const d = new Date();
    const months =[ "January","February","March", "April","May","June", "July","August", "September", "October","November","December"]

    const imgRef = useRef(null)

    

    function handleImageUpload(e){


         //Create a ref to image in cloud storage and get the download url

         var storageRef = storage.ref();

         var updatedRef = storageRef.child("images/updated.jpg")

         //Now upload the file to the ref
         var uploadTask=updatedRef.put(e.currentTarget.files[0])

         // Only when the upload is complete, then get the downloadurl from the cloud, then update the url in the realtime database
         uploadTask.on('state_changed', (snapshot) => {}, (error) => console.log(error), () => {
           
            updatedRef.getDownloadURL().then((url) => {
                console.log(url,"hi")

                var updates = {};
      
                updates['/users/' + currentUser.uid + '/userpic'] = url ;
        
               database.ref().update(updates)
        


            }).catch((err) => console.log(err))

         } )
        
       
    }


   

   
  
    return(
    <div className="profile-card">
        <p className="edit-profile"><MdEdit style={{color:"#0A7BFF"}}/></p>
        <div className="profile-pic"><img src={currentUser.userpic} className="person-img"  ref={imgRef} /></div>
        <p ><label for="file" className="edit-pic"><MdEdit style={{color:"#0A7BFF"}}/></label></p>
        <input type="file"  accept="image/jpeg, image/png" name="image" id="file" style={{display: "none"}} onChange={handleImageUpload}/>

        <p className="username">{currentUser.username}</p>
        <p className="location"></p>
        <p className="user-email">{currentUser.email}</p>
        <p className="join-date"><AiFillCalendar style={{color:"#0A7BFF"}}/> Joined {months[d.getMonth()]} {d.getFullYear()}</p>
       
    </div>)
}

export default ProfileCard