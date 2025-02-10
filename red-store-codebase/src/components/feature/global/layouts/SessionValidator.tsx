import { Session } from "@supabase/supabase-js";
import React from "react";

interface SessionValidator {
  session: Session | null;
  isLoading: boolean;
  children: React.ReactNode;
}

const SessionValidator: React.FC<SessionValidator> = ({
  children,
  isLoading,
  session,
}) => {
  return (
    <div>
      {isLoading ? (
        <div>Fetching Session details</div>
      ) : session ? (
        <>{children}</>
      ) : (
        <div>Session not found or expired</div>
      )}
    </div>
  );
};

export default SessionValidator;
