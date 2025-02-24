import { useNavigate } from "react-router-dom";
import { useAccess } from "@/components/context/useAccess";

export const useNavigateToPPTViewer = () => {
    const { allowAccess } = useAccess();
    const navigate = useNavigate();

    return () => {
        allowAccess(); // Allow access before navigating
        navigate("/ppt-viewer");
    };
};
