import React from 'react'
import { useLocation, Navigate, Outlet } from "react-router-dom"; 

const PageNotFoundRedirect = () => {
    let location = useLocation();
    return(
        <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default PageNotFoundRedirect;