import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import JwtPayload from '../../auth/types/jwt-payload';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();
    return request.user;
  },
);
