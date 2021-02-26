import React,{useContext, useEffect} from "react"
import { useParams } from "react-router-dom"
import ProfileCard from "./profileCard"
import {database} from "../firebase"
import { socialContext } from "../socialContext"
import { useState } from "react/cjs/react.development"
import Moment from "react-moment"


function Comments(){

    const {slug} = useParams();

    const {handleCurrentUser,currentUser,postComment} = useContext(socialContext);

    const [input,setInput] = useState({comment:""});

    const [actualPost,setActualPost] = useState({});

    const [commentArr,setCommentArr] = useState([])

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

        database.ref("posts/"+slug).on("value",(snapshot)=> {
            setActualPost(snapshot.val());
            setCommentArr(snapshot.val().comments);
        })


    },[])

    function handleChange(e){
        setInput({comment:e.target.value})
    }

    function handlePostComment(){

        postComment(slug,input.comment);

        setInput({comment:""});
        
    }

    const comments = commentArr.map((obj,i) => {
        return(
        <div>
            <div className="comments-grid" key={i}>
                <div>
                        <div className="post-author-img"><img src={obj.userpic}/></div>
                </div>
                <div className="post-flex">
                        <h4 className="post-author-name" style={{alignSelf:"flex-start"}}>{obj.username}</h4>
                        <p className="timeStamp"><Moment format="hh:mm a , D MMM YYYY" withTitle>{obj.timeStamp}</Moment></p>
                        <p>{obj.comment}</p>
                    
                </div>
            </div>
            <hr />

        </div>)
    })
   
    return(
    <div className="home-container">

        <div className="comments-container">
            <div className="comments-grid">
                <div>
                        <div className="post-author-img"><img src={actualPost.userpic}/></div>
                </div>
                <div className="post-flex">
                        <h4 className="post-author-name" style={{alignSelf:"flex-start"}}>{actualPost.username}</h4>
                        <p>{actualPost.caption}</p>
                    
                </div>
            </div>
            <hr />

            <div className="post-comment">
               
               <div className="comment-input"><input type="text" placeholder="Add a comment.." name="comment" value={input.comment} onChange={handleChange}/></div>
               <div className="post" onClick={ handlePostComment}>Post</div>
           </div>

            {comments}

        </div>
        <ProfileCard />
        
    </div>)
}



export default Comments;