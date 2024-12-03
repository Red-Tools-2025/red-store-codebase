"use client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  value: Socket | null;
}

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket | null => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useRef<Socket | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    
    if (session) {
      console.log(`Socket Session ${JSON.stringify(session, null, 2)}` );
      
      socket.current = io("http://localhost:8000", {
        transports: ["websocket"],
        withCredentials: true,
        query:{userId: (session?.user as {id:string})?.id }
      });
      socket.current.on("userStatus", (data) => {
        console.log(`User with ID ${data.userId} is now ${data.status}`);
        // Update frontend with the status (online/offline)
      });
      return () => {
        socket.current?.disconnect();
      };
    }
  }, [session]);

  return (
    <SocketContext.Provider value={ socket.current }>
      {children}
    </SocketContext.Provider>
  );
};
