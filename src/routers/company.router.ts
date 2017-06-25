import mongoose = require('mongoose');
import { NextFunction, Request, Response, Router } from 'express';

import { CompanySchema, ICompany, ICompanyModel } from './../schemas/company.schema';

// Connect to mongoDB
mongoose.Promise = global.Promise;
const MONGO_URL: string       = process.env.MONGO_URL   || 'localhost';
const MONGO_PORT: number      = process.env.MONGO_PORT  || 37017;
const MONGO_DB: string        = process.env.DB          || 'dev';
const MONGO_LINK: string      = `mongodb://${MONGO_URL}:${MONGO_PORT}/${MONGO_DB}`;
const MONGO_CONNECTION: mongoose.Connection = mongoose.createConnection(MONGO_LINK);

// this is what we will use to query mongo regarding Company documents
const MONGO_COMPANY: mongoose.Model<ICompanyModel> = MONGO_CONNECTION.model<ICompanyModel>('Company', CompanySchema);


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
   * RETRIEVE all Companies
   */
  async retrieveAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let foundCompanies: ICompanyModel[] = await MONGO_COMPANY.find().select({
        _id: 1,
        name: 1,
    });
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
    let foundCompany: ICompanyModel = await MONGO_COMPANY.findById(queryId);
    res.send(foundCompany);
  }

  /**
   * Create and store a new Company in the DB
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // ensure all required fields are present
      if (
          req.body.name     === undefined ||
          req.body.address  === undefined ||
          req.body.city     === undefined ||
          req.body.country  === undefined
        ) {
        throw new TypeError();
      }

      // create new ICompany object with the supplied required fields
      let newCompany: ICompany = {
        name          : req.body['name'].trim(),
        address       : req.body['address'].trim(),
        city          : req.body['city'].trim(),
        country       : req.body['country'].trim(),
      };

      // set optional fields if supplied
      newCompany.email = req.body['email'] ? req.body['email'].trim() : undefined ;
      newCompany.phone = req.body['phone'] ? req.body['phone'].trim() : undefined ;
      newCompany.benef_owners = req.body['benef_owners'] ? req.body['benef_owners'] : undefined ;

      let response: ICompanyModel = await MONGO_COMPANY.create(newCompany);
      res.status(201).send(response); // 201 CREATED
    }
    catch (error) {
      // only print detailed error message in development mode, for security reasons
      let prodSafeError: string = 'Company validation failed. Proper body fields are missing.';
      switch (process.env.NODE_ENV) {
        case 'production':
          res.status(406).send(prodSafeError); // 406 NOT ACCEPTABLE
        case 'development':
          res.status(406).send(error.message); // 406 NOT ACCEPTABLE
        default:
          res.status(406).send(new Error(prodSafeError)); // 406 NOT ACCEPTABLE
      }
    }
  }

  /**
   * Take each handler and attach it to one of the Express.Router's endpoints
   */
  private initRoutes(): void {
    this.router.get('/', this.retrieveAll);
    this.router.get('/:id', this.getOne);
    this.router.post('/create', this.create);
  };
}
