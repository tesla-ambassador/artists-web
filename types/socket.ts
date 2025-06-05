type callbackType = (socket: WebSocket) => void;
export type websocketType = (
  objectPath: string,
  callback: callbackType
) => void;
