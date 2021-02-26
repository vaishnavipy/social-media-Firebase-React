import React, { useContext, useEffect, useState } from "react"
import {IoMdCamera} from "react-icons/io"
import {HiUpload} from "react-icons/hi"
import {database,storage} from "../firebase"
import { socialContext } from "../socialContext"

function CreatePost(){

    const [input,setInput] = useState({caption:""})

    const [postImg,setPostImg] = useState({file:"",url:""});

    const {currentUser} = useContext(socialContext)

    function handleChange(e){
        const {name,value} = e.target
        if(name !== "postPhoto"){
       
        setInput(prevState => ({...prevState,[name]:value}) )
        }else{
            setPostImg({file:e.target.files[0], url: URL.createObjectURL( e.target.files[0])})

        }
        
    }

    function removeImg(){
        setPostImg({file:"",url:""})
    }


    function handleUpload(){
        var postRef=database.ref("posts").push();


        if(postImg.file){

            var storageRef =storage.ref();

           var uploadTask= storageRef.child(`images/${postRef.key}.jpg`).put(postImg.file)

           uploadTask.on("state_changed",(snapshot) => {},(err)=>console.log(err),()=>{

            storageRef.child(`images/${postRef.key}.jpg`).getDownloadURL().then((url)=>{

                postRef.set({
                    caption: input.caption,
                    postPhoto : url,
                    username :  currentUser.username,
                    likeCount : 0,
                    commentCount : 0,
                    postID : postRef.key,
                    uid : currentUser.uid,
                    userpic : currentUser.userpic
                })


            }).catch(err => console.log(err))

            setInput({caption:""})
            setPostImg({file:"",url:""})
           })
        

        }else if(input.caption){

            postRef.set({
                caption: input.caption,
                postPhoto : postImg.file,
                username :  currentUser.username,
                likeCount : 0,
                commentCount : 0,
                postID : postRef.key,
                uid : currentUser.uid,
                userpic : currentUser.userpic
            })

            setInput({caption:""})
            setPostImg({file:"",url:""})

        }

        //Now add the postID to the users list, 
         database.ref("users/"+currentUser.uid+"/posts").once("value",(snapshot)=>{
             if(snapshot.exists()){
                database.ref("users/"+currentUser.uid+"/posts").set([...snapshot.val(),postRef.key])
               
             }else{
                 console.log(snapshot.val())
                 database.ref("users/"+currentUser.uid+"/posts").set([postRef.key])

             }
         })
        

    }

    



    return(
    <div className="create-post">
        <h5>Create A Post</h5>
        <textarea value={input.caption} onChange={handleChange} name="caption" placeholder="Enter a caption.." className="txt-area" rows="4"/>
        
        {postImg.url ? <div className="post-img-display"><img src={postImg.url} /><span className="remove-img" onClick={removeImg}>X</span></div> : ""}

        <div className="caption-upload-flex">
            <label for="post-photo"><span className="icons"><IoMdCamera/></span></label>
            <input type="file" accept="image/jpeg, image/png" id="post-photo" name="postPhoto"   style={{display:"none"}} onChange={handleChange}/>
            <span className="upload" onClick={handleUpload}>Upload <span className="icons"><HiUpload /></span> </span>
        </div>
    </div>)
}

export default CreatePost