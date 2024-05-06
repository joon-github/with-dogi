import { Request as ExpressRequest } from 'express';

declare global {
  namespace Express {
    export interface Request {
      images?: {
        file: Express.Multer.File;
        seq: number;
        imageName: string;
      }[];
    }
  }
}
export interface Request extends ExpressRequest {
  images?: {
    file: Express.Multer.File;
    seq: number;
    imageName: string;
  }[];
}
