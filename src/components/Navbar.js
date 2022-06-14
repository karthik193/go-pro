import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router";
import React from "react";
import '../style/common.css'

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
        <div align="right">
                <div className="Navbar" 
                    style={{
                        width : "200px"
                    }}>
                <button className="btn btn-warning" onClick={handleLogout}>Log Out</button>
            </div>
        </div>
        
    )
}