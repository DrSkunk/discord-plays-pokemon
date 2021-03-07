// import WebSocket from 'ws';
// import { WebPort } from './Config';
// const wss = new WebSocket.Server({ port: WebPort });

// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//   // setInterval(() => {
//   //   gameboyClient.getFrame();
//   // }, 1000/60);

//   setInterval(() => {
//     const imageString = gameboyClient.getFrame().toString('base64');
//     ws.send(imageString);
//   }, 1000 / 60);
//   // ws.send('something');
// });

import http from 'http';
import fs from 'fs';
import { WebPort } from './Config';
import WebSocket from 'ws';
import { WebSocketManager } from 'discord.js';
import { GameboyClient } from './GameboyClient';

export class SocketServer {
  private gameboyClient: GameboyClient;

  constructor(gameboyClient: GameboyClient) {
    this.gameboyClient = gameboyClient;
  }

  start() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'content-type': 'text/html' });
      fs.createReadStream('./debug/index.html').pipe(res);
    });

    server.listen(WebPort || 2020, function () {
      console.log('webserver started');
    });

    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        console.log('received: %s', message);
        if (message.toString() === 'SAVESTATE') {
          console.log('savestate');
          const saveState = this.gameboyClient.gameboy.saveState();
          console.log('saveState', saveState);
          fs.writeFileSync('./saveState.sav', JSON.stringify(saveState));
        } else if (message.toString() === 'LOADSTATE') {
          console.log('loadstate');
          const saveState = JSON.parse(
            fs.readFileSync('./saveState.sav').toString()
          );
          this.gameboyClient.gameboy.returnFromState(saveState);
        } else {
          this.gameboyClient.pressKey(message.toString());
        }
      });
      // setInterval(() => {
      //   gameboyClient.getFrame();
      // }, 1000/60);

      setInterval(() => {
        const imageString = this.gameboyClient.getFrame().toString('base64');
        ws.send(imageString);
      }, 100);
      // ws.send('something');
    });
  }
}
