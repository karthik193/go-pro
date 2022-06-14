import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { doc , setDoc , getFirestore, collection, addDoc} from "firebase/firestore";
export default function SignUpPage(){

    
    const auth = getAuth();
    const firestore = getFirestore() ; 
    const [authDocs, setAuthDocs] = useState(false);

    const verifyinputs = (inputs) =>{
        return null ;
    }

    const addUsertoFirebase = async (email, password, mobileNo)=>{

        // add new user
        createUserWithEmailAndPassword(auth , email , password).then((userCredential)=>{
            const user = userCredential.user ; 
            console.log("<CREATED USER>", user); 

            const providerCollection = collection(firestore , "provider")

            addDoc(providerCollection, {
                email : email,
                password : password,
                mobileNo : mobileNo, 
                holdingAmt: 0, 
                free: true,
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

    const handleDocsSubmit = (event) =>{
        // upload files to firebase
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