import React from 'react'
import { Navigate } from 'react-router-dom'
export default function PrivateRoute({ children }) {

    if (!localStorage.getItem("admin")) {
        return <Navigate to="/login" />
    }
    else {
        return children
    }
}
