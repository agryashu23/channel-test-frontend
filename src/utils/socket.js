import { io } from "socket.io-client";
import { hostUrl } from "./globals";

const socket = io(`${hostUrl}`, {
  path: "/ws",
  transports: ["websocket"],
  autoConnect: false,
  withCredentials: true,
});

export const connectSocketWithUser = (userId) => {
  if (!userId) return;
  socket.auth = { userId };
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
export default socket;
