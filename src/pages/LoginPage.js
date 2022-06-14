import {React} from "react";
import { useNavigate } from "react-router";
import firebaseApp from '../firebase';
import { getAuth , signInWithEmailAndPassword } from "firebase/auth";
import { getUserDetails } from "../functions/database";
import '../style/common.css';


export default function LoginPage(){

    const navigator = useNavigate();
    const auth = getAuth();

    if(localStorage.getItem("email")){
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
                localStorage.setItem("Vno" , ud.Vno);
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
        <div className="mainContainer">
            <div className="container LoginForm">
                <h1>GO PRO</h1>
                <form  onSubmit={handleSubmit} className="form-group">
                    <input className ="form-control" type="text" name="email" placeholder="Enter Email"/>
                    <input className ="form-control" type="password" name="password" placeholder="Enter Password"/>
                    <button type="submit" className="btn btn-primary">Log in</button>
                </form>
                <button onClick={handleSignUp} className="btn">Sign Up</button>
            </div>

            <div>
                <img src="/2.png"/>
            </div>
        </div>
    );
}