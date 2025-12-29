import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../entities/user.entity";

export interface CurrentUserData {
  id: string;
  tahUserId: string;
  orgId: string;
  email: string;
  name: string;
  permissions: string[];
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext): CurrentUserData | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserData;

    if (\!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
