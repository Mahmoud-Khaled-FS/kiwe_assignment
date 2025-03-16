import { WebSocket } from 'ws';

export type WebSocketHandler = (ws: WebSocket, data: unknown) => void | Promise<void>;
