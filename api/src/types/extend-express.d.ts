declare namespace Express {
  // Express is the namespace inside of 'express'
  export interface Request {
    //   request is also inside there
    // this is adding a new property inside of this interface
    userId: number;
  }
}
