import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router";
import React from "react";

export default function Navbar(){


    const auth = getAuth(); 
    const navigate  = useNavigate();

    const handleLogout = ()=>{
        localStorage.clear();
        auth.signOut();

        setTimeout(() => {
        navigate("/login");
        }, 200);
    }

    return (
        <div>
            <button>Profile</button>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    )
}