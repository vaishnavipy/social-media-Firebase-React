

import React, { useContext, useEffect } from "react"
import { useState } from "react/cjs/react.development"
import { database } from "../firebase"
import CreatePost from "./createPost"
import SinglePost from "./singlePost"


function Posts(){

    const [postArr,setPostArr] = useState([]);

   

    useEffect(()=>{
       
        database.ref("posts").on("value",(snapshot)=>{
            setPostArr([])
            snapshot.forEach((snap)=>{
                setPostArr(prevState => [snap.val(),...prevState])
            })

        })


    },[])

   
    const posts = postArr.map((obj,i) => {
        return(<SinglePost obj={obj} i={i}/>)
        
    })


    return(
    <div className="posts-container">
        <CreatePost />
        {posts}
    </div>)
}





export default Posts