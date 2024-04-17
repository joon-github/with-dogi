import { Request as ExpressRequest } from 'express';

declare global {
  namespace Express {
    export interface Request {
      images?: {
        file: Express.Multer.File;
        type: string;
        imageName: string;
      }[];
    }
  }
}
export interface Request extends ExpressRequest {
  images?: {
    file: Express.Multer.File;
    type: string;
    imageName: string;
  }[];
}
