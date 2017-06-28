import * as bodyParser from 'body-parser';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';

import { NextFunction, Request, Response } from 'express';
import { Server } from 'http';

import { CompanyRouter } from './routers/company.router';


/**
 * Creates and configures an ExpressJS web server.
 */
export class API {
  express: express.Application;

  /**
   * Initialize the express app
   */
  constructor() {
    this.express = express();
    this.config();
    this.bindRouters();
    this.bindFrontend();
  }

  /**
   * Creates a new, configured, ready-to-use express application operating as an API.
   * @class API 
   * @method bootstrap 
   * @static 
   * @return Express.Application Returns the newly created express application. 
   */
  public static bootstrap(): express.Application {
    return new API().express;
  }


  /** 
   * Configures the express web server.
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
    this.express.use(require('compression')({ level: 7 }));
  }

  /** 
   * Configures the API endpoints. 
   * @class API 
   * @method bindRouters
   */
  private bindRouters(): void {
    // bind additional routers here
    this.express.use('/api/companies', CompanyRouter.bootstrap());
  }

  private bindFrontend(): void {
    const oneMinute: number = 60000; // 60000 == 1 minute

    this.express
      .use(express.static(__dirname + '/assets/www', { maxAge: oneMinute * 10 })) // Client-side file caching
      .get('/', (req: Request, res: Response) => {
        res.sendFile(__dirname + '/assets/www/index.html');
      });
  }
}
