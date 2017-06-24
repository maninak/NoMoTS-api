import * as bodyParser from 'body-parser';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';

import { NextFunction, Request, Response } from 'express';
import { Server } from 'http';

import { UserRouter } from './routers/user.router';


/**
 * Creates and configures an ExpressJS web server.
 */
export class API {
  express: express.Application;

  /**
   * Initialise the express app
   */
  constructor() {
    this.express = express();
    this.config();
    this.bindRouters();
  }

  /**
   * Creates a new, ready-to-use, configured express application.
   * @class API 
   * @method bootstrap 
   * @static 
   * @return {Express.Application} Returns the newly created express application. 
   */
  public static bootstrap(): express.Application {
    return new API().express;
  }


  /** 
   * Configures the express web Server.
   * @class API 
   * @method config 
   */
  private config(): void {
    switch (process.env.NODE_ENV) {
      case 'production':
        this.express.use(logger('combined'));
      case 'development':
        this.express.use(logger('dev'));
        this.express.use(errorHandler());
      case 'test':
        break;
      default:
        this.express.use(logger('dev'));
    }
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(require('compression')({ level: 5 }));
  }

  /** 
   * Configures the API endpoints. 
   * @class API 
   * @method bindRouters 
   * @return void 
   */
  private bindRouters(): void {
    // bind additional routers here
    this.express.use('/users', UserRouter.bootstrap());
  }
}
