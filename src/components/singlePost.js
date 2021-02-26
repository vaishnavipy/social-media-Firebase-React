
import {MdDelete,MdComment} from "react-icons/md"
import {FiHeart} from "react-icons/fi"
import {FaHeart} from "react-icons/fa"
import { useHistory } from "react-router-dom";
import { socialContext } from "../socialContext";
import React, { useContext, useEffect } from "react"
import { useState } from "react/cjs/react.development"
import { database } from "../firebase"


function SinglePost({obj,i}){

    const {currentUser,postComment} = useContext(socialContext);

    const [input,setInput] = useState({comment:""});

    const history = useHistory()


    function deletePost(postID,uid){
        console.log("delete",postID)
        database.ref("posts/"+ postID).remove();

        //now delete the postID from that user
        database.ref("users/"+uid+"/posts").once("value",(snapshot)=>{
            let tempArr = snapshot.val();
            database.ref("users/"+uid+"/posts").set(tempArr.filter( ids => ids !== postID))
        })
    }

    function handleLike(postID){

        var postRef= database.ref("posts/"+postID)
        postRef.transaction((post) => {

            if(post.likes && post.likes[currentUser.uid]){
                post.likeCount--;
                post.likes[currentUser.uid] = null;
            }else{
                post.likeCount++;
                if(!post.likes){
                    post.likes = {};
                }
                post.likes[currentUser.uid] = true;
            }
            return post;
        })


    }

    function handlePostComment(postID){
        //Call post comment in the context and then clear the input
        postComment(postID,input.comment);
            
        setInput({comment:""})
    

    }

    function handleChange(e){
        setInput({comment: e.target.value})
    }

    function handleViewComments(postID){
        history.push(`/comments/${postID}`)
    }

    function gotoProfile(uid){
        history.push(`/profile/${uid}`)
    }




    return(
        <div key={i} className="single-post">
            <div className="post-author-details">
                <div >
                    <div className="post-author-img"><img src={obj.userpic}/></div>
                    <h4 className="post-author-name" onClick={ ()=>{gotoProfile(obj.uid)} }>{obj.username}</h4>
                </div>
              {obj.uid === localStorage.currentUser ? <p className="delete-post">Delete <span className="icons" onClick={() => {deletePost(obj.postID,obj.uid)}}><MdDelete/> </span></p> : <p></p>}  
                
            </div>
            {obj.postPhoto ? <div className="post-img"><img src={obj.postPhoto}/></div>:""}
           
            <div className="post-caption"><h4 className="post-author-name">{obj.username} &nbsp; </h4> <p>{obj.caption}</p></div>

            { obj.likes && obj.likes[currentUser.uid] ?

             <div className="likes-div"><span className="icons" onClick={() => {handleLike(obj.postID)}} style={{color:"red"}}><FaHeart/></span> {obj.likeCount} Likes  &nbsp; &nbsp;<span className="icons"><MdComment /></span> {obj.commentCount} Comments</div>
             :
             <div className="likes-div"><span className="icons" onClick={() => {handleLike(obj.postID)}}><FiHeart/></span> {obj.likeCount} Likes  &nbsp; &nbsp;<span className="icons"><MdComment /></span> {obj.commentCount} Comments</div>
            
            }
            {obj.commentCount ? <p className="view-comment" onClick={() => {handleViewComments(obj.postID)}}>View all {obj.commentCount} comments</p> :"" } 
            
            <div className="post-comment-div">
                <div className="post-comment-pic"><img src={currentUser.userpic}/></div>
                <div className="comment-input"><input type="text" placeholder="Add a comment.." name="comment" value={input.comment} onChange={handleChange}/></div>
                <div className="post" onClick={ () => {handlePostComment(obj.postID)}}>Post</div>
            </div>
           
        </div>
    )
}

export default SinglePost;