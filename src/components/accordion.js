import React, { useContext,useEffect } from "react"
import { useHistory } from "react-router-dom";
import { useState } from "react/cjs/react.development"
import { database } from "../firebase"
import { socialContext } from "../socialContext";
import SinglePost from "./singlePost";

function Accordion(){

    const [postArr,setPostArr] = useState([]);

    const [followersObj,setFollowersObj] = useState({});

    const [followingObj,setFollowingObj] = useState({})

    const [followersArr,setFollowersArr]  = useState([])

    const [followingArr,setFollowingArr] = useState([])

    const history = useHistory()
   
    useEffect(()=>{

        let loggedInUser =  localStorage.getItem("currentUser");

        database.ref("posts").on("value",(snapshot)=>{
            setPostArr([])
           
            snapshot.forEach((snap)=>{
               
                if(snap.val().uid == loggedInUser){
                   
                    setPostArr(prevState => [snap.val(),...prevState])
                }
            })

            //Empty them before you cna fill them up
           
            database.ref("users/"+loggedInUser).on("value",(snapshot)=>{

                setFollowersObj(snapshot.val().followers)
                setFollowingObj(snapshot.val().following)

            })

        })


    },[])

    useEffect(()=>{

        if(followersObj && followingObj){

        database.ref("users").once("value",(snapshot)=>{
            setFollowersArr([]);
            setFollowingArr([]);
            snapshot.forEach((snap)=> {
                if(followersObj[snap.val().uid]){
                    setFollowersArr(prevState => [...prevState,snap.val()])
                }
                if(followingObj[snap.val().uid]){
                    setFollowingArr(prevState => [...prevState,snap.val()])
                }
            })
        })
    }

    },[followersObj,followingObj])

    function goToUserProfile(uid){
        history.push("/profile/"+uid);
    }


    const posts = postArr.map((obj,i) => {
        return(<SinglePost obj={obj} i={i} />)
    })

    const followers = followersArr.map((obj,i) => {
        return(
        <div key={i} className="followers-div" onClick={()=>{goToUserProfile(obj.uid)}}>
            <div><img src={obj.userpic} /></div>
            <h4>{obj.username}</h4>
        </div>)
    })

    const following = followingArr.map((obj,i) => {
        return( 
        <div key={i} className="followers-div" onClick={()=>{goToUserProfile(obj.uid)}}>
            <div><img src={obj.userpic} /></div>
            <h4>{obj.username}</h4>
        </div>)
    })

    function toggleAccordion(e,id){
        let tabs = document.querySelectorAll(".tab")
        tabs.forEach(elm => elm.classList.remove("active"));
        e.currentTarget.classList.add("active");


        let accordion_content = document.querySelectorAll(".accordion-content");
        accordion_content.forEach(elm => elm.style.display = "none")
        document.getElementById(id).style.display ="grid";
    }   

    return(
    <div>
        <div className="tabs">
            <div className="tab active"  onClick={(e)=>{toggleAccordion(e,"posts")}}> Recent Posts</div>
            <div className="tab" onClick={(e)=>{toggleAccordion(e,"followers")}}> Followers</div>
            <div className="tab" onClick={(e)=>{toggleAccordion(e,"following")}}> Following</div>
        </div>

        <div className="accordion-content-div">
            <div className="accordion-content " id="posts">{posts}</div>
            <div className="accordion-content" id="followers">{followers}</div>
            <div className="accordion-content " id="following" id="following">
              {following}
            </div>
        </div>
    </div>)
}

export default Accordion