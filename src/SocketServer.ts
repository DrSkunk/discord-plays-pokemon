import http from 'http';
import fs from 'fs';
import { WebPort } from './Config';
import WebSocket from 'ws';
import { getGameboyInstance } from './GameboyClient';
import { Log } from './Log';
import { SocketCommand } from './enums/SocketCommand';

export class SocketServer {
  start() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'content-type': 'text/html' });
      fs.createReadStream('./debug/index.html').pipe(res);
    });

    server.listen(WebPort || 2020, function () {
      Log.info('webserver started');
    });

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
      ws.on('message', (rawData) => {
        Log.info('received from socket client:', rawData);
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
          default:
            Log.warn('Received invalid socket command', data);
            break;
        }
      });
    });

    setInterval(() => {
      if (wss.clients.size != 0) {
        wss.clients.forEach((client) => {
          const imageString = getGameboyInstance()
            .getFrame()
            .toString('base64');
          client.send(JSON.stringify({ command: 'frame', imageString }));
        });
      }
    }, 100); // send 10 frames each second
  }
}
