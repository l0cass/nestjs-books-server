import { User } from 'src/domains/entities';
import { MultipartFile } from '@fastify/multipart';

import { ROLE_ENUM } from 'src/commons/enums/roles';

declare global {
  interface Payload {
    sub: string;
    email: string;
    username: string;
    displayName: string;
    roles: ROLE_ENUM[];
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: Pick<User, 'id' | 'username' | 'displayName' | 'email' | 'roles'>;
    file?: MultipartFile;
  }
}
