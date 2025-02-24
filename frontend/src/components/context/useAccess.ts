import { useContext } from "react";
import { AccessContext } from "./AccessContext";

export const useAccess = () => {
    const context = useContext(AccessContext);
    if (!context) {
        throw new Error("useAccess must be used within an AccessProvider");
    }
    return context;
};
