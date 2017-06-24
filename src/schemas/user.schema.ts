import { NextFunction } from 'express';
import { model, Document, Model, Schema } from 'mongoose';


/**
 * Defines a User document and is used internally to provide supporting typings.
 * Must be (manually) kept in sync with UserSchema.
 */
export interface IUser {
  created_at?   : Date;
  email         : string;
  firstname     : string;
  lastname      : string;
}

/**
 * Defines a User model and is used internally to provide supporting typings.
 * Must be (manually) kept in sync with UserSchema.
 */
export interface IUserModel extends IUser, Document {
  // additional custom methods for your model would be defined here
  getFullName(): string;
}



/**
 * Defines a User schema and is used by mongoose to access mongoDB documents.
 */
export let UserSchema: Schema = new Schema({
  created_at  : { type: Date, required: true, default: Date.now },
  email       : { type: String, required: true },
  firstname   : { type: String, required: true },
  lastname    : { type: String, required: true },
});

UserSchema.methods.getFullName = (): string => {
  return (this.firstName.trim() + ' ' + this.lastName.trim());
};


export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
