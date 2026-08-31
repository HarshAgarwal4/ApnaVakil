import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:8000";

let socket = null;

export const getSocket = (userId = "", role = "user", email = "") => {
  const normEmail = email ? email.trim().toLowerCase() : "";
  const normUserId = userId ? userId.trim() : "";

  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      query: {
        userId: normUserId,
        role: role || "user",
        email: normEmail,
      },
    });

    socket.on("connect", () => {
      if (normUserId || normEmail) {
        socket.emit("register_user", {
          userId: normUserId,
          email: normEmail,
          role: role || "user",
        });
      }
    });
  } else {
    const currentQuery = socket.io?.opts?.query || {};
    const needsReconnect =
      (normUserId && currentQuery.userId !== normUserId) ||
      (normEmail && currentQuery.email !== normEmail);

    if (needsReconnect) {
      socket.io.opts.query = {
        userId: normUserId,
        role: role || "user",
        email: normEmail,
      };
      if (socket.connected) {
        socket.emit("register_user", {
          userId: normUserId,
          email: normEmail,
          role: role || "user",
        });
      } else {
        socket.connect();
      }
    } else if (socket.connected && (normUserId || normEmail)) {
      socket.emit("register_user", {
        userId: normUserId,
        email: normEmail,
        role: role || "user",
      });
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

