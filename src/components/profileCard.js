import React, { useContext,useRef,useEffect,useState, Fragment } from "react"
import { socialContext } from "../socialContext"
import {MdEdit} from "react-icons/md"
import {AiFillCalendar} from "react-icons/ai"
import {database,storage} from "../firebase"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {IoLocation} from "react-icons/io5"


function ProfileCard(){
    const {currentUser,handleCurrentUser} = useContext(socialContext)
    const d = new Date();
    const months =[ "January","February","March", "April","May","June", "July","August", "September", "October","November","December"]

    const imgRef = useRef(null);

    const [modal,setModal] = useState(false);

    const [input,setInput] = useState({userhandle:"",userbio:"",userlocation:""})

   

    function toggleModal(){
        setModal(prevState => !prevState)
    }

    function handleChange(e){
        const {name,value} = e.target;
        setInput(prevState => ({...prevState,[name]:value}));
    }

    

    function handleImageUpload(e){


         //Create a ref to image in cloud storage and get the download url

         var storageRef = storage.ref();

         var updatedRef = storageRef.child(`images/${currentUser.uid}.jpg`)

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

    function updateUserProfile(){
        var updates ={};
        if(input.userhandle || input.userbio || input.userlocation){

            if(input.userhandle){
            updates['users/' + currentUser.uid + "/username"] = input.userhandle;
            }
            if(input.userbio){
            updates["users/" + currentUser.uid + "/bio"] = input.userbio;
            }
            if(input.userlocation){
            updates["users/" + currentUser.uid + "/location"] = input.userlocation;
            }
            database.ref().update(updates);

            setInput({userhandle:"",userbio:"",userlocation:""})
        }
        toggleModal();
    }

    function toggleFollow(userID){
       
        // Now we need to change the followers and following data in both the logged in user and also the user you are trying to follow
        //Change in logged-in user
        
        database.ref("users/"+localStorage.currentUser).once("value",(snapshot)=>{
            let tempFollowing={};
            var updates ={};
            tempFollowing = snapshot.val().following;
            if(snapshot.val().following && snapshot.val().following[userID]){
                
                 updates["users/"+localStorage.currentUser+"/following"] = {...tempFollowing,[userID] : null}
            }else{
               
                updates["users/"+localStorage.currentUser+"/following"] = {...tempFollowing,[userID] : true}
            }
            database.ref().update(updates);

        })

         //Now change the followers of the user you are trying to follow
         console.log(userID)
        var userToFollow = database.ref("users/"+userID)
        userToFollow.transaction((user) => {
            if(user.followers && user.followers[localStorage.currentUser]){
                user.followers[localStorage.currentUser] = null;
            }else{
                if(!user.followers){
                    user.followers ={};
                }
                user.followers[localStorage.currentUser] = true;
            }
            return user;
        })



    }

   
  
    return(
        <div>
            <div className="profile-card">

                {/* If the current user is the same as the user who has logged in then let them edit their own profile */}
                {localStorage.currentUser === currentUser.uid ? 
                  <p className="edit-profile " onClick={toggleModal}>
                  <MdEdit style={{color:"#0A7BFF"}}/>
                </p>
                : ""
                } 
              
                <div className="profile-pic"><img src={currentUser.userpic} className="person-img"  ref={imgRef} /></div>
                {localStorage.currentUser === currentUser.uid ? 
                <Fragment><p ><label for="file" className="edit-pic"><MdEdit style={{color:"#0A7BFF"}}/></label></p>
                <input type="file"  accept="image/jpeg, image/png" name="image" id="file" style={{display: "none"}} onChange={handleImageUpload}/></Fragment>
                : ""
                }
                <p className="username" style={{color:"#0A7BFF"}}>{currentUser.username}</p>
                {currentUser.bio ? <p className="location">{currentUser.bio}</p> :""}
                
                {/*Add a flollow and un-follow button on ther user profiles*/}

                {localStorage.currentUser !== currentUser.uid ? 
                currentUser.followers && currentUser.followers[localStorage.currentUser] ? <Button color="primary" onClick={() => {toggleFollow(currentUser.uid)}}>Unfollow</Button> :  <Button color="primary"  onClick={()=>{toggleFollow(currentUser.uid)}} >Follow</Button> :
                ""   
                }


                {currentUser.location ? <p className="location"><IoLocation style={{color:"#0A7BFF"}} /> {currentUser.location}</p> :""}
                <p className="user-email">{currentUser.email}</p>
                <p className="join-date"><AiFillCalendar style={{color:"#0A7BFF"}}/> Joined {months[d.getMonth()]} {d.getFullYear()}</p>

                {/*  Modal component  */}
                
                <Modal isOpen={modal} toggle={toggleModal} >
                <ModalHeader toggle={toggleModal}>Edit Your Details</ModalHeader>
                <ModalBody className="modal-flex">
                    <label for="handle">User Handle</label>
                    <input type="text" id="handle" name="userhandle" value={input.userhandle} onChange={handleChange}/>

                    <label for="bio">Bio</label>
                    <input type="text" id="bio" name="userbio" value={input.userbio} onChange={handleChange} />

                    <label for="locatiom">Location</label>
                    <input type="text" id="location"  placeholder="Eg: London,United Kingdom" name="userlocation" value={input.userlocation} onChange={handleChange}  />


                </ModalBody>
                <ModalFooter>
                <Button color="success" onClick={updateUserProfile}>Save</Button>{' '}
                <Button color="primary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
            
            </div>
    </div>)
}

export default ProfileCard