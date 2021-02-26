import React, { useEffect } from "react"
import { useState } from "react/cjs/react.development";
import { database } from "../firebase";
import SinglePost from "./singlePost"


function OtherUserPosts({uid}){

    const [postIdArr,setPostIdArr] = useState([])

    const [postArr,setPostArr] = useState([])


    useEffect(()=>{

        database.ref("users/"+uid+"/posts").on("value",(snapshot)=>{
            setPostIdArr(snapshot.val())
        })

    },[])

    useEffect(()=>{
       console.log(postIdArr)
        if( postIdArr && postIdArr.length !== 0){
           
                database.ref("posts/").on("value",(snapshot)=>{
                    setPostArr([])
                    snapshot.forEach((snap)=>{
                        if(postIdArr.includes(snap.val().postID)){
                            setPostArr(prevState => [snap.val(),...prevState])
                        }
                    })
                    
                })
            
        }

    },[postIdArr])

   
   
    var posts = postArr.map((obj,i) => {
        return(<SinglePost obj={obj} i={i}/>)
        
    })
    

    return(
    <div >
        {postIdArr && postIdArr.length !== 0 ?  posts : <h1 style={{color:"#0A7BFF"}}>No posts yet by this user..</h1>}
    </div>)
}

export default OtherUserPosts;