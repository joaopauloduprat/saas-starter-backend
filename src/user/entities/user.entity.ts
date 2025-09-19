import { User } from 'generated/prisma';
import { Exclude } from 'class-transformer';

export class UserEntity implements Partial<User> {
  id: string;
  email: string;
  name?: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
