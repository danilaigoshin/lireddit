import DataLoader from 'dataloader';
import { User } from '../entities/User';

const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);

    const userIdsToUser: Record<number, User> = {};
    users.forEach((user) => {
      userIdsToUser[user.id] = user;
    });

    return userIds.map((userId) => userIdsToUser[userId]);
  });

export { createUserLoader };
