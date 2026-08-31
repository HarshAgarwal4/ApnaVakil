import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8000";

let socket = null;

export const getSocket = (userId = "", role = "user", email = "") => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      query: {
        userId: userId || "",
        role: role || "user",
        email: email || "",
      },
    });
  } else if (userId && socket.io.opts.query.userId !== userId) {
    socket.io.opts.query = {
      userId: userId || "",
      role: role || "user",
      email: email || "",
    };
    if (!socket.connected) {
      socket.connect();
    }
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
