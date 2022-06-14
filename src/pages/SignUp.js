import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { doc , setDoc , getFirestore, collection, addDoc, updateDoc} from "firebase/firestore";
import uploadFile from "../functions/Files";
import { useNavigate } from "react-router";
export default function SignUpPage(){

    
    const auth = getAuth();
    const firestore = getFirestore() ; 
    const [authDocs, setAuthDocs] = useState(false);
    const navigate  = useNavigate(); 

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

        <div>
            {
                authDocs ?
                    <div>

                        <form onSubmit={handleDocsSubmit}>
                            <p>Provide Supporting Documents</p> 
                            <input name="license" type="file"/>
                            <input name="aadhar" placeholder="Enter Aadhar Number"/>
                            <input name="Vno" placeholder="Vechile Number"/>
                            <button type="submit">Submit</button>
                        </form>
                        
                    </div>
                :
                <div>
                    <form onSubmit={handleSubmit}>
                        <input name="email" placeholder="email" />
                        <input name="password" placeholder="password" type="password" />
                        <input  name="mobileNo" placeholder="Mobile Number" />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
            }
        </div>
        
        
    )
}