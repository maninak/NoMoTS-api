import * as debug from 'debug';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';

import { API } from './API';


// Setup debug logger on namespace 'prn-webserver'
// prints out to console via log stream when launched with `DEBUG=prn-webserver node index.js`
const log: debug.IDebug = debug('prn-webserver:log').log = console.log.bind(console);

// Load environment variables if present
if (fs.existsSync('env/.env')) {
  dotenv.config({ path: 'env/.env' });
  console.log('Success loading environment variables.');
} else {
  process.env.NODE_ENV = 'development';
  console.warn('Failed loading environment variables, expected file "env/.env" not found. '
      + 'Using fallback development configuration instead.');
}

// create http server
const HTTP_PORT: number|string|boolean = normalizePort(process.env.HTTP_PORT || 9080);
const httpServer: http.Server = http.createServer(API.bootstrap().set('port', HTTP_PORT));
httpServer.listen(HTTP_PORT);
httpServer.on('error', onError);
httpServer.on('listening', onListening);

/**
 * Normalize a port into a number, string, or boolean.
 */
export function normalizePort(val: number|string): number|string|boolean {
  let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port))    { return val;   }
  else if (port >= 0) { return port;  }
  else                { return false; }
}

/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') { throw error; }
  let bind: string = (typeof HTTP_PORT === 'string') ? 'Pipe ' + HTTP_PORT : 'Port ' + HTTP_PORT;
  // handle specific listen errors with friendlier messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening(): void {
  let addr: { port: number, family: string, address: string; } = httpServer.address();
  let bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  log(`Listening on ${bind}`);
}
