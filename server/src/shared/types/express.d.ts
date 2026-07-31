import { IUser } from '../../features/users/user.model.js';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
