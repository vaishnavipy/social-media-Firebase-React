import React from "react"
import { useState } from "react/cjs/react.development";
import {database} from "./firebase"

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

    function postComment(postID,comment){
       
        var postRef= database.ref("posts/"+postID);
        postRef.transaction((post) => {
            if(post.comments){
                post.commentCount++;
                post.comments.push({
                    username:currentUser.username , 
                    comment: comment,
                    userpic:currentUser.userpic,
                    uid:currentUser.uid,
                    timeStamp : Date.now()
                })

            }else{
                post.commentCount++;
                post.comments = [];
                post.comments.push({username : currentUser.username, comment : comment,userpic:currentUser.userpic,uid:currentUser.uid,  timeStamp : Date.now()})

            }

            return post;
        }, (err,committed,snapshot)=> {
            //If commetn posted , clear the input
            if(err){
                console.log(err)
            }
            if(committed){
               console.log(committed)
            }
        })
       
    }

    return(
    <socialContext.Provider value={{authentication,handleAuthentication,currentUser,handleCurrentUser,postComment}}>
        {children}
    </socialContext.Provider>)

}

export {socialContext,SocialContextProvider}