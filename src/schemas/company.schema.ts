/**
 * This file holds the full schema and respective mongoose model definition for Company documents.
 * @exports interface ICompany
 * @exports interface ICompanyModel
 * @exports const CompanySchema
 */

import { NextFunction } from 'express';
import { model, Document, Model, Schema } from 'mongoose';
import { ICompanyModel } from './company.schema';


/**
 * Defines a Company document which is used internally to provide supporting typings.
 * 
 * This interface definition must be (manually) kept in sync with CompanySchema.
 */
export interface ICompany {
  name          : string;
  address       : string;
  city          : string;
  country       : string;
  email?        : string;
  phone?        : string;
  benef_owners? : [string];
  created_at?   : Date;
}

/**
 * Defines a Company model which is used internally to provide supporting typings.
 * 
 * This interface definition must be (manually) kept in sync with CompanySchema.
 */
export interface ICompanyModel extends ICompany, Document {
  /**
   * Concatenates and returns the full address of a Company.
   * @return string The full address of the company including street address, city and country
   */
  getFullAddress(): string;

  // additional custom methods for the model can be defined here
}

/**
 * Defines a Company schema which is used by mongoose to access Company documents via mongoDB.
 */
export const CompanySchema: Schema = new Schema({
  name          : { type: String, required: true },
  address       : { type: String, required: true },
  city          : { type: String, required: true },
  country       : { type: String, required: true },
  email         : { type: String, required: false },
  phone         : { type: String, required: false },
  benef_owners  : { type: [String], required: false },
  created_at    : { type: Date, required: false, default: Date.now },
});

// Implementation of the getFullAddress() function as defined in the ICompanyModel above
CompanySchema.methods.getFullAddress = (): string => {
  return `${this.address}, ${this.city}, ${this.country}`;
};
