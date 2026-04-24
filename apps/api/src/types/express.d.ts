import { JwtUser } from '../auth/jwt.type';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends JwtUser {}
  }
}
