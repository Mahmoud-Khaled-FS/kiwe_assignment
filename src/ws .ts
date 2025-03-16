import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import logger from './shared/utils/logger';
import { WebSocketHandler } from './types/ws';
import { currentWeatherWs } from './features/weather/routes/ws';

export function setupWebSocket(app: Server) {
  const router = new WebSocketRouter();
  // NOTE (MAHMOUD) - Subscribe Events Here
  router.register('weather', currentWeatherWs);

  const wss = new WebSocketServer({ noServer: true });
  app.on('upgrade', (request, socket: any, head: any) => {
    // NOTE (MAHMOUD) - This is HTTP Server Error
    socket.on('error', onWsError);

    wss.handleUpgrade(request, socket, head, (ws) => {
      socket.removeListener('error', onWsError);
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    // NOTE (MAHMOUD) - This is WebSocket Error
    ws.on('error', onWsError);

    ws.on('message', async (message) => {
      // NOTE (MAHMOUD) - Handle Events Here
      try {
        const data = JSON.parse(message.toString());
        if (!data.route) {
          ws.send(JSON.stringify({ error: 'Event type is required' }));
          return;
        }
        await router.handle(data.route, ws, data.data);
      } catch (e) {
        logger.error(e);
        ws.send(JSON.stringify({ error: 'Invalid event data' }));
      }
    });
  });
}

function onWsError(err: Error) {
  logger.warn(err.message);
}

class WebSocketRouter {
  private routers: Map<string, WebSocketHandler>;
  constructor() {
    this.routers = new Map();
  }

  register(event: string, callback: WebSocketHandler) {
    this.routers.set(event, callback);
  }

  handle(event: string, ws: WebSocket, args: unknown) {
    const callback = this.routers.get(event);
    if (!callback) {
      ws.send(JSON.stringify({ error: 'Event not found' }));
      return;
    }
    callback(ws, args);
  }
}
