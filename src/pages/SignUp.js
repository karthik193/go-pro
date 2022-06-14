import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { doc , setDoc , getFirestore, collection, addDoc, updateDoc} from "firebase/firestore";
import uploadFile from "../functions/Files";
import { useNavigate } from "react-router";
import "../style/common.css" ; 

export default function SignUpPage(){

    
    const auth = getAuth();
    const firestore = getFirestore() ; 
    const [authDocs, setAuthDocs] = useState(false);
    const navigate  = useNavigate(); 

    if(localStorage.getItem("email")){
        navigator("/");
    }
    
    const verifyinputs = (inputs) =>{
        return null ;
    }

    const addUsertoFirebase = async (email, password, mobileNo)=>{

        // add new user
        createUserWithEmailAndPassword(auth , email , password).then((userCredential)=>{
            const user = userCredential.user ; 
            console.log("<CREATED USER>"); 

            const providerCollection = collection(firestore , "provider")

            addDoc(providerCollection, {
                email : email,
                password : password,
                mobileNo : mobileNo, 
                holdingAmt: 0, 
                free: true,
            }).then((doc)=>{
                localStorage.setItem("email", email); 
                localStorage.setItem("mobileNo" , mobileNo);
                localStorage.setItem("id" , doc.id);
            });
            setAuthDocs(true);
        })
        .catch((error)=>{
            console.log(error);
        })

        // add to firestore/providers


    }
    const handleSubmit =  (event) =>{

        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const mobileNo = event.target.mobileNo.value;

        verifyinputs([email, password, mobileNo]); 

        addUsertoFirebase(email, password, mobileNo); 
    }

    const handleDocsSubmit = async (event) =>{

        event.preventDefault();
        // upload files to firebase
        const AadharNo  = event.target.aadhar.value ; 
        const Vno = event.target.Vno.value ; 
        const ImageFile = event.target.license.files[0];


        console.log("<ID>" , localStorage.getItem("id")); 
        if(ImageFile && AadharNo !== "" && Vno !== "" ){
            await uploadFile(ImageFile , localStorage.getItem("id"));
            const providerId  = localStorage.getItem("id") ; 

            updateDoc(doc(firestore , "provider" , providerId) , {
                "Ano" : AadharNo, 
                "Vno" : Vno
            }).catch(err =>{
                console.log(err);
            })

            navigate("/");
        }
        else{
            alert("Provide All Necessary Inputs");
        }

    }

    return(

        <div className="mainContainer" >
            
            {
                authDocs ?
                    <div className="container LoginForm">

                        <form onSubmit={handleDocsSubmit} className="form-group">
                            <p>Provide Supporting Documents</p> 
                            <input className="form-control" name="license" type="file"/>
                            <input className="form-control" name="aadhar" placeholder="Enter Aadhar Number"/>
                            <input className="form-control" name="Vno" placeholder="Vechile Number"/>
                            <button className="btn btn-primary" type="submit">Submit</button>
                        </form>
                        
                    </div>
                :
                <div className="container LoginForm">
                    <h1>GO PRO</h1>
                    <form onSubmit={handleSubmit} className="form-group">
                        <input className="form-control"  name="email" placeholder="email" />
                        <input className="form-control"  name="password" placeholder="password" type="password" />
                        <input className="form-control"  name="mobileNo" placeholder="Mobile Number" />
                        <button className="btn btn-primary"  type="submit">Sign Up</button>
                    </form>
                </div>
            }
            <div>
                <img src="/2.png" />
            </div>
        </div>
        
        
    )
}