import { websocketType } from "types/socket";

const websocket: websocketType = (objectPath, onMessage) => {
  const socket = new WebSocket(
    `${import.meta.env.ENV_WEBSOCKET_URL}?objectPath=${objectPath}`
  );
  socket.addEventListener("open", () => {
    socket.addEventListener("message", (socketEvent) => {
      const msg = JSON.parse(socketEvent.data);
      onMessage(msg);
    });
  });
  socket.onerror = (error) => {
    throw new Error(`Socket connection error occurred! ${error}`);
  };
};

export default websocket;
