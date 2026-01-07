


import { AuthUser } from "../services/paste.service";


declare global {
  namespace Express{
    interface Request{
      user?:AuthUser;
    }
  }
}
export {};
