import React, { useState, useEffect } from "react";
import { AccessContext } from "./AccessContext";

export const AccessProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [allowed, setAllowed] = useState<boolean>(() => {
        return sessionStorage.getItem("hasAccess") === "true"; // Load initial state
    });

    const allowAccess = () => {
        setAllowed(true);
        sessionStorage.setItem("hasAccess", "true"); // Persist access
    };

    const revokeAccess = () => {
        setAllowed(false);
        sessionStorage.removeItem("hasAccess"); // Remove access when leaving page
    };

    useEffect(() => {
        // Sync session storage on state change
        if (!allowed) {
            sessionStorage.removeItem("hasAccess");
        }
    }, [allowed]);

    return (
        <AccessContext.Provider value={{ allowed, allowAccess, revokeAccess }}>
            {children}
        </AccessContext.Provider>
    );
};
