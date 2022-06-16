import { getAuth } from "firebase/auth";
import { update } from "firebase/database";
import { collection,getDocs, getDoc, doc,getFirestore, query, setDoc, where, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import getNewProvider, { getUserDetails } from "../functions/database";
import OTPInput from "otp-input-react";
import getcurrentLoc from "../functions/Location";

export default function HomePage(){

    const [request , setRequest] = useState(null);
    const auth = getAuth(); 
    const firestore = getFirestore();
    const [otp , setOTP] = useState('');

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
            providerId : await getNewProvider(request.id).then(res=>res), 
            
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
                providerVno: localStorage.getItem("Vno"),
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

        
        if(newStatus <= 4){
            const updatedRequest  = {
                ...request, 
                status : newStatus, 
    
            };
    
            await setDoc(doc(firestore , "requests" , request.id), updatedRequest).then(()=>{
                setRequest(updatedRequest);
            })
        }else{
            await deleteDoc(doc(firestore , "requests" , request.id)).then(()=>{
                handleFreeStatus(true);
                setRequest(null);
            })
        }
        
    }

    const verifyOTP = ()=>{
        if(request.otp === otp){
            alert("OTP VERIFIED"); 
            updateStatus(4);
        }
        else{
            alert("INVALID OTP");
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
            <div align="center">
                {
                    request.status == 0 ?
                    <div>
                        <button  onClick={()=>handleAcceptDecline(1)}>Accept</button>
                        <button onClick={()=>handleAcceptDecline(0)}>Decline</button>
                    </div> 
                    : null 
                }
                

                <div class="card assignCard" align="center">
                    <h1>REQUEST</h1>
                    <table className="detailsSection">
                        <tr>
                            <td><h4>Id</h4></td>
                            <td>{request.userId}</td>
                        </tr>
                        <tr>
                            <td><h4>Location</h4></td>
                            <td><a href={"https://www.google.com/maps/search/" + request.userLoc} target="#">{request.userLoc} </a></td>
                        </tr>
                        <tr>
                            <td><h4>Charge Requested</h4></td>
                            <td>{request.chargeAmt}</td>
                        </tr>
                        <tr>
                            <td><h4>Amount to be Paid</h4></td>
                            <td>{request.amt}</td>
                        </tr>
                        <tr>
                            <td><h4>Contact</h4></td>
                            <td>{request.userMno}</td>
                        </tr>
                    </table>
                </div>

                <div>

                {(request.status === 1) ? 
                    <button className="btn btn-info" onClick={()=> updateStatus(2)}>start delivery</button>    
                :null} 

                {(request.status === 2) ? 
                    <button className="btn btn-primary" onClick={()=> updateStatus(5)}>Reached User Location</button>    
                :null} 

                {(request.status === 3) ? 
                    <div className="otpInput" align="center"> 
                        <OTPInput value={otp} onChange={setOTP} autoFocus OTPLength={4} otpType="number" disabled={false}  />
                        <button className="btn btn-default" onClick={verifyOTP}>Verify</button>
                    </div>     
                :null}   

                {(request.status === 4) ? 
                    <button className="btn btn-success" onClick={()=> updateStatus(5)}>Delivery Done</button>    
                :null}  
                </div>
            </div>
            : <div align="center"> <h1>NO REQUESTS</h1></div>
        }
        </div>
        
    );
}


// 0 - waiting 
// 1 - accepted 
// 2 - started
// 3 - otp verified
// 4 - delivered