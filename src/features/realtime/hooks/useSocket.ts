import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"; // your backend base URL

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setconneted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // or Zustand store
    const socket = io(SERVER_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      auth: { token },
    });
    socketRef.current = socket;
    socket.on("connect", () => {
      console.log("connected");
      setconneted(true);
    });
    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected:", reason);
      setconneted(false);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const emit = (event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  };
const on = (event: string, handler: (...args: any[]) => void) => {
  socketRef.current?.on(event, (...args) => {
    const data = args[0];
    console.log("📩 New notification:", data);

    // show browser notification for every message
    if (Notification.permission === "granted") {
      new Notification("🔔 New Notification", {
        body: data?.text || "You have a new message!",
        icon: "/logo.png",
        tag: Date.now().toString(), // unique tag
      });
    }

    handler(...args); // pass it to your component-level handler
  });
};

  return { socket: socketRef.current, connected, emit, on };
}
