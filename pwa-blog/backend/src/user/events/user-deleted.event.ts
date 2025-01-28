import { UserDocument } from '../schemas/user.schema';

export class UserDeletedEvent {
  public static EVENT = 'user.deleted';

  constructor(
    public readonly userId: string,
    public readonly user: UserDocument,
  ) {}
}
