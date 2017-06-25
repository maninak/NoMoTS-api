import mongoose = require('mongoose');
import { NextFunction, Request, Response, Router } from 'express';

import { CompanySchema, ICompany, ICompanyModel } from './../schemas/company.schema';

// Connect to mongoDB
mongoose.Promise = global.Promise;
const MONGO_URL: string       = process.env.MONGO_URL   || 'localhost';
const MONGO_PORT: number      = process.env.MONGO_PORT  || 37017;
const MONGO_DB: string        = process.env.DB          || 'test';
const MONGO_LINK: string      = `mongodb://${MONGO_URL}:${MONGO_PORT}/${MONGO_DB}`;
const MONGO_CONNECTION: mongoose.Connection = mongoose.createConnection(MONGO_LINK);

// this is what we will use to query mongo regarding Company documents
const COMPANY_MODEL: mongoose.Model<ICompanyModel> = MONGO_CONNECTION.model<ICompanyModel>('Company', CompanySchema);


export class CompanyRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  /**
   * Creates and returns a new, ready-to-use, configured express Router
   */
  static bootstrap(): Router {
    return new CompanyRouter().router;
  }

  /**
   * GET all Companies
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let foundCompanies: ICompanyModel[] = await COMPANY_MODEL.find();
    res.send(foundCompanies);
  }

  /**
   * GET one Company by id
   */
  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let queryId: string = req.params.id;
    if (mongoose.Types.ObjectId.isValid(queryId) !== true) {
      res.status(400).send({
        error: 'Invalid Company id',
        requested: queryId,
        status: res.status,
      });
    }
    let foundCompany: ICompanyModel = await COMPANY_MODEL.findById(queryId);
    res.send(foundCompany);
  }

  /**
   * PUT a new Company to the DB
   */
  // async putOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   let newCompany: ICompany = {
  //     email: req.headers['email'],
  //     firstname: req.headers['firstname'],
  //     lastname: req.headers['lastname'],
  //   };
  //   try {
  //     let value: ICompanyModel = await COMPANY_MODEL.create(newCompany);
  //     res.send(value);
  //   }
  //   catch (error) {
  //     res.status(406).send(error.message); // NOT ACCEPTABLE, client is missing proper header fields
  //   }
  // }

  /**
   * Take each handler and attach it to one of the Express.Router's endpoints
   */
  private initRoutes(): void {
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
    // this.router.put('/create', this.putOne);
  };
}
