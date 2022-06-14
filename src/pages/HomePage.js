import { getAuth } from "firebase/auth";
import { update } from "firebase/database";
import { collection,getDocs, getDoc, doc,getFirestore, query, setDoc, where, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import getNewProvider, { getUserDetails } from "../functions/database";
import getcurrentLoc from "../functions/Location";

export default function HomePage(){

    const [request , setRequest] = useState(null);
    const auth = getAuth(); 
    const firestore = getFirestore();

    useEffect(()=>{
        
        const providerId = localStorage.getItem("email"); 
        const requestsCollection = collection(firestore, "requests");
        const getRequest = async ()=>{
            const q  = query(requestsCollection , where("providerId" , "==" , providerId));
            const querySnapshot = await getDocs(q); 
            querySnapshot.forEach(doc =>{
                setRequest({
                    ...doc.data(),
                    id: doc.id,
                    
                }
                );
            })
        }

        getRequest();

    }, []);

    
    const addtoDeclineList = async ()=>{

        const updatedData = { 
            "declinedList": [
                ...request.declinedList,
                localStorage.getItem("email")
            ], 
            providerId : await getNewProvider(request.id).then(res=>res)
        }

        console.log(updatedData , "UPDATED DATA")

        await updateDoc(doc(firestore , "requests" , request.id), updatedData);
    }

    const handleFreeStatus = async (freeStatus)=>{
        await updateDoc(doc(firestore , "provider" , localStorage.getItem("id")) , {
            free : freeStatus
        })
    }

    const handleAcceptDecline = async (ad) =>{

        if(ad){
             
            const updatedRequest  = {
                ...request, 
                providerLoc : await getcurrentLoc().then(pos => pos),
                providerMno : localStorage.getItem("mobileNo"),
                status : 1, 

            };

            await setDoc(doc(firestore , "requests" , request.id), updatedRequest).then(()=>{
                setRequest(updatedRequest);
                handleFreeStatus(false);
            })

        }else{
            addtoDeclineList();
            setRequest(null);
        }
    }


    const updateStatus = async (newStatus)=>{

        
        if(newStatus <= 3){
            const updatedRequest  = {
                ...request, 
                status : newStatus, 
    
            };
    
            await setDoc(doc(firestore , "requests" , request.id), updatedRequest).then(()=>{
                setRequest(updatedRequest);
            })
        }else{
            await deleteDoc(doc(firestore , "requests" , request.id)).then(()=>{
                setRequest(null);
            })
        }
        
    }

    console.log(request , "request");
    return (

        <div>
        <div>
            <Navbar />
        </div>
        {
            request ? 
            <div>
                <p>Request</p>

                {
                    request.status == 0 ?
                    <div>
                        <button  onClick={()=>handleAcceptDecline(1)}>Accept</button>
                        <button onClick={()=>handleAcceptDecline(0)}>Decline</button>
                    </div> 
                    : null 
                }
                

                <div>
                    <p>Id</p>
                    <p>{request.userId}</p>
                    
                    <p>Location</p>
                    <p><a href={"https://www.google.com/maps/search/" + request.userLoc} target="#">{request.userLoc} </a></p>

                    <p>Charge Requested</p>
                    <p>{request.chargeAmt}</p>

                    <p>Amount to be Paid</p>
                    <p>{request.amt}</p>

                    <p>Contact</p>
                    <p>{request.userMno}</p>
                    
                </div>

                <div>

                {(request.status === 1) ? 
                    <button onClick={()=> updateStatus(2)}>start delivery</button>    
                :null} 

                {(request.status === 2) ? 
                    <button onClick={()=> updateStatus(3)}>Reached User Location</button>    
                :null}    

                {(request.status === 3) ? 
                    <button onClick={()=> updateStatus(4)}>Delivery Done</button>    
                :null}  
                </div>
            </div>
            : <p> no requests </p>
        }
        </div>
        
    );
}


// 0 - waiting 
// 1 - accepted 
// 2 - started
// 3 - reached location
// 4 - delivered