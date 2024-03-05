import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  private users = [
    {
      id: 1,
      name: 'Bartolomaiu',
      email: 'barto@gmail.com',
    },
    {
      id: 2,
      name: 'Tota',
      email: 'tots@gmail.com',
    },
    {
      id: 3,
      name: 'Gama',
      email: 'gama@gmail.com',
    },
  ];

  async getUsers() {
    return this.users;
  }
}
