import { Navigate, Outlet } from "react-router-dom";
import { useAccess } from "../context/useAccess";

const ProtectedRoute: React.FC = () => {
    const { allowed } = useAccess();
    const hasAccess = allowed || sessionStorage.getItem("hasAccess") === "true"; // Check sessionStorage

    if (!hasAccess) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
