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

/**
 * An API router that implements all CRUD functions on ICompany objects.
 * @exports CompanyRouter
 */
export class CompanyRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  /**
   * Creates and returns a new, ready-to-use, configured express Router.
   */
  static bootstrap(): Router {
    return new CompanyRouter().router;
  }

  /**
   * Attach each handler to one of the Express.Router's endpoints.
   */
  initRoutes(): void {
    this.router.get('/', this.retrieveAll);
    this.router.get('/:id', this.retrieveById);
    this.router.put('/:id', this.updateById);
    this.router.patch('/:id', this.updateBeneficiariesById);
    this.router.delete('/:id', this.deleteById);
    this.router.post('/create', this.create);
  };

  /**
   * RETRIEVE all Company documents existing in the DB and respond with their id and name.
   */
  async retrieveAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let foundCompanies: ICompanyModel[] = await MONGO_COMPANY.find().select({
        _id: 1,
        name: 1,
    });
    res.status(200).send(foundCompanies);
  }

  /**
   * RETRIEVE a single Company document using the supplied id.
   */
  async retrieveById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let queryId: string = req.params.id;
      if (mongoose.Types.ObjectId.isValid(queryId) !== true) {
        throw new Error(`Supplied Company id '${queryId}' is not a valid MongoDB identifier.`);
      }
      let foundCompany: ICompanyModel = await MONGO_COMPANY.findById(queryId);
      if (!foundCompany) {
        throw new Error(`No existing item found with supplied id '${queryId}'.`);
      }
      res.status(200).send({ 'response' : foundCompany }); // 200 SUCCESS
    }
    catch (error) {
      res.status(404).send({ 'error': error.message }); // 404 NOT FOUND
    }
  }

  /**
   * UPDATE a Company document already existing in the DB.
   */
  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // ensure all required fields are present in the request
      if (
          req.body.name     === undefined ||
          req.body.address  === undefined ||
          req.body.city     === undefined ||
          req.body.country  === undefined
        ) {
        throw new TypeError('Request data validation failed. Required body fields are missing.');
      }

      let queryId: string = req.params.id;
      if (mongoose.Types.ObjectId.isValid(queryId) !== true) {
        throw new Error(`Supplied Company id '${queryId}' is not a valid MongoDB identifier.`);
      }

      let updatedCompany: ICompanyModel = await MONGO_COMPANY.findByIdAndUpdate(queryId, { $set: {
        name          : req.body['name'].trim(),
        address       : req.body['address'].trim(),
        city          : req.body['city'].trim(),
        country       : req.body['country'].trim(),
        email         : req.body['email'] ? req.body['email'].trim() : undefined,
        phone         : req.body['phone'] ? req.body['phone'].trim() : undefined,
        benef_owners  : req.body['benef_owners'] ? req.body['benef_owners'] : undefined,
      }}, { new: true });

      if (!updatedCompany) {
        throw new Error(`No existing item found with supplied id '${queryId}'.`);
      }
      res.status(201).send(updatedCompany); // 201 CREATED
    }
    catch (error) {
      res.status(406).send({ 'error': error.message }); // 406 NOT ACCEPTABLE
    }
  }

  /**
   * UPDATE the beneficiaries of a Company document already existing in the DB.
   */
  async updateBeneficiariesById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // ensure all required fields are present in the request
      if (req.body.benef_owners === undefined) {
        throw new TypeError('Request data validation failed. Required body fields are missing.');
      }

      let queryId: string = req.params.id;
      if (mongoose.Types.ObjectId.isValid(queryId) !== true) {
        throw new Error(`Supplied Company id '${queryId}' is not a valid MongoDB identifier.`);
      }

      let updatedCompany: ICompanyModel = await MONGO_COMPANY.findByIdAndUpdate(queryId, { $set: {
        benef_owners  : req.body['benef_owners'] ? req.body['benef_owners'] : req.body.benef_owners,
      }}, { new: true });

      if (!updatedCompany) {
        throw new Error(`No existing item found with supplied id '${queryId}'.`);
      }
      res.status(201).send(updatedCompany); // 201 CREATED
    }
    catch (error) {
      res.status(406).send({ 'error': error.message }); // 406 NOT ACCEPTABLE
    }
  }

  /**
   * DELETE a single Company document with the supplied id.
   */
  async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let queryId: string = req.params.id;
      if (mongoose.Types.ObjectId.isValid(queryId) !== true) {
        throw new Error(`Supplied Company id '${queryId}' is not a valid MongoDB identifier.`);
      }
      let deletedCompany: ICompanyModel = await MONGO_COMPANY.findByIdAndRemove(queryId);
      if (!deletedCompany) {
        throw new Error(`No existing item found with supplied id '${queryId}'.`);
      }
      res.status(200).send(deletedCompany ); // 200 SUCCESS
    }
    catch (error) {
      res.status(404).send({ 'error': error.message }); // 404 NOT FOUND
    }
  }

  /**
   * Create and store a new Company document in the DB.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // ensure all required fields are present in the request
      if (
          req.body.name     === undefined ||
          req.body.address  === undefined ||
          req.body.city     === undefined ||
          req.body.country  === undefined
        ) {
        throw new TypeError('Request data validation failed. Required body fields are missing.');
      }

      // create new ICompany object with the supplied required fields
      let newCompany: ICompany = {
        name          : req.body['name'].trim(),
        address       : req.body['address'].trim(),
        city          : req.body['city'].trim(),
        country       : req.body['country'].trim(),
      };

      // set optional fields if supplied
      newCompany.email = req.body['email'] ? req.body['email'].trim() : undefined;
      newCompany.phone = req.body['phone'] ? req.body['phone'].trim() : undefined;
      newCompany.benef_owners = req.body['benef_owners'] ? req.body['benef_owners'] : undefined;

      let createdCompany: ICompanyModel = await MONGO_COMPANY.create(newCompany);
      res.status(201).send(createdCompany); // 201 CREATED
    }
    catch (error) {
      res.status(406).send({ 'error': error.message }); // 406 NOT ACCEPTABLE
    }
  }
}
