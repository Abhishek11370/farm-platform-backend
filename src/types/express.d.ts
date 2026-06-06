// src/types/express.d.ts
import { RequestUser } from './request-user';

declare global {
  namespace Express {
    interface User extends RequestUser {}
  }
}

export {};

