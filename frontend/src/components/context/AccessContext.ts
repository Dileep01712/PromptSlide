import { createContext } from "react";

export interface AccessContextType {
    allowed: boolean;
    allowAccess: () => void;
    revokeAccess: () => void;
}

export const AccessContext = createContext<AccessContextType | undefined>(undefined);
