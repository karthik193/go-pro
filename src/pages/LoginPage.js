import {React} from "react";
import { useNavigate } from "react-router";
import firebaseApp from '../firebase';
import { getAuth , signInWithEmailAndPassword } from "firebase/auth";
import { getUserDetails } from "../functions/database";



export default function LoginPage(){

    const navigator = useNavigate();
    const auth = getAuth();

    if(localStorage.getItem("admin") == "true"){
        navigator("/");
    }

    const verifyUser = async (email, password) =>{
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials)=>{
            console.log("<SIGNED IN>" , userCredentials.user); 
            localStorage.setItem("admin" , "true");
            localStorage.setItem("email" , email);

            // get user details
            getUserDetails().then(ud =>{
                localStorage.setItem("id" , ud.id);
                localStorage.setItem("mobileNo" , ud.mobileNo);
                console.log(ud , "UD" )
            }); 
    
            navigator('/');
        })
        .catch((error)=>{
            alert("Wrong Username or Password")
            console.log(error);
        })
    }
    const handleSubmit = (event)=>{

        event.preventDefault();

        // authenticate with firebase
        const email = event.target.email.value ; 
        const password = event.target.password.value ;
        verifyUser(email, password);

    }

    const handleSignUp = (event)=>{
        navigator('/signup')
    }
    return (
        <div>
            <form  onSubmit={handleSubmit}>
                <input type="text" name="email"/>
                <input type="password" name="password" />
                <button type="submit" >Log in</button>
            </form>
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
}