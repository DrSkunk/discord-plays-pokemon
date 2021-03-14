import http from 'http';
import fs from 'fs';
import { WebPort } from './Config';
import WebSocket from 'ws';
import { getGameboyInstance } from './GameboyClient';
import { Log } from './Log';
import { SocketCommand } from './enums/SocketCommand';
import { DEFAULT_WEB_PORT } from './Constants';

export class SocketServer {
  private _wss: WebSocket.Server;
  constructor() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'content-type': 'text/html' });
      fs.createReadStream('./debug/index.html').pipe(res);
    });
    const port = WebPort || DEFAULT_WEB_PORT;
    server.listen(port, function () {
      Log.info('Webserver started on port ' + WebPort);
    });

    this._wss = new WebSocket.Server({ server });

    this._wss.on('connection', (ws) => {
      ws.on('message', (rawData) => {
        Log.info('Received from socket client:', rawData);
        let data;
        try {
          data = JSON.parse(rawData.toString());
        } catch (e) {
          Log.warn('Received invalid JSON');
          return;
        }
        switch (data.command as SocketCommand) {
          case SocketCommand.SaveState:
            getGameboyInstance().newSaveState();
            break;
          case SocketCommand.LoadState:
            const fileName = data.name;
            try {
              getGameboyInstance().loadSaveState(fileName);
            } catch (error) {
              Log.error('Failed to load savestate', fileName, error);
            }

            break;
          case SocketCommand.GetStates:
            const saveStates = getGameboyInstance().getSaveStates();
            ws.send(JSON.stringify({ command: 'saveStates', saveStates }));
            break;
          case SocketCommand.PressKey:
            getGameboyInstance().pressKey(data.key);
            break;
          case SocketCommand.Memory:
            // getGameboyInstance().getMemory();
            break;
          default:
            Log.warn('Received invalid socket command', data);
            break;
        }
      });
    });
  }

  sendMessage(imageString: string): void {
    if (this._wss.clients.size != 0) {
      this._wss.clients.forEach((client) => {
        client.send(JSON.stringify({ command: 'frame', imageString }));
      });
    }
  }
}
