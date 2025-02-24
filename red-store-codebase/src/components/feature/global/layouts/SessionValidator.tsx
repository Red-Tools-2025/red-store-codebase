import { Session } from "@supabase/supabase-js";
import React from "react";

interface SessionValidatorProps {
  session: Session | null;
  isLoading: boolean;
  children: React.ReactNode;
}

const SessionValidator: React.FC<SessionValidatorProps> = ({
  children,
  isLoading,
  session,
}) => {
  if (isLoading) {
    return <div>Fetching Session details</div>;
  }

  if (!session) {
    // Redirect to /auth/login if no session
    window.location.href = "/auth/login";
    return null; // Important: Return null to prevent rendering anything else
  }

  // Session exists, render children
  return <>{children}</>;
};

export default SessionValidator;
