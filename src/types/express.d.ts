import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id?: string;
      sid: string;
      isAnon: boolean;
    };
  }
}
