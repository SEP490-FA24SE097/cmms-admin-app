"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";

// Define the context type
interface RoleContextType {
  role: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Create the RoleProvider component
export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const token = session?.user?.accessToken;

    if (token) {
      try {
        const decodedToken = jwtDecode<any>(token);
        const userRole =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || "No role found";
        setRole(userRole);
      } catch (error) {
        console.error("Error decoding token:", error);
        setRole("Error decoding role");
      }
    } else {
      console.error("Token is undefined");
      setRole("No role");
    }
  }, [session]);

  return (
    <RoleContext.Provider value={{ role }}>{children}</RoleContext.Provider>
  );
};

// Hook to use the role in components
export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
