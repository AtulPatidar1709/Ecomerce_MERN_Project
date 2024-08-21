import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedProps {

    children?: ReactElement;
    isAuthenticated: boolean;
    adminRoute?: boolean;
    isAdmin?: boolean;
    redirect?: string;
}

const ProtectedRoute = ({ isAuthenticated, children, adminRoute, isAdmin, redirect = "/" }: ProtectedProps) => {

    if (!isAuthenticated) return <Navigate to={redirect} />

    if (adminRoute && !isAdmin) return <Navigate to={redirect} />

    return children ? children : <Outlet />;
}

export default ProtectedRoute;