import * as debug from 'debug';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';

import { API } from './API';


// Setup debug logger on namespace 'webserver'
// prints out to console via log stream when launched with `DEBUG=webserver node server.js`
const log: debug.IDebug = debug('webserver:log').log = console.log.bind(console);

// Load environment variables if present
if (fs.existsSync('env/.env')) {
  dotenv.config({ path: 'env/.env' });
  console.log(`Success loading environment variables. Running in mode: '${process.env.NODE_ENV}'`);
} else {
  // fall back to development mode if no environment variables are present
  process.env.NODE_ENV = 'development';
  console.warn('Warning: Failed loading environment variables because expected file "env/.env" was not found. '
      + 'Using fallback development configuration instead.');
}

// create api http server
const HTTP_PORT: number|string|boolean = normalizePort(process.env.PORT || process.env.HTTP_PORT || 9080);
const httpServer: http.Server = http.createServer(API.bootstrap().set('port', HTTP_PORT));
httpServer.listen(HTTP_PORT)
          .on('error', onError)
          .on('listening', onListening);

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
 * Handle HTTP server 'listening' event.
 */
function onListening(): void {
  let addr: { port: number, family: string, address: string; } = httpServer.address();
  let bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  log(`Listening on ${bind}`);
}

/**
 * Handle HTTP server 'error' event.
 * @throws NodeJS.ErrnoException If there is no handler implemented to catch the error it is thrown to caller
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
