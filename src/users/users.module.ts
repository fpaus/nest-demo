import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersDbService } from './usersDb.service';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';

// const mockUserService = {
//   getUsers: () => 'Esto es un servicio mock de usuarios',
// };

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    // {
    //   provide: UsersService,
    //   useValue: mockUserService,
    // },
    UsersService,
    UsersDbService,
    UsersRepository,
    CloudinaryConfig,
    // {
    //   provide: 'CLOUDINARY',
    //   useFactory: () => {
    //     return cloudinary.config({
    //       cloud_name: 'dzu6cdxuk',
    //       api_key: '768734144751644',
    //       api_secret: 'HekYdk-O9DN1UpyehVrB-Etbpiw',
    //     });
    //   },
    // },
    CloudinaryService,
    {
      provide: 'API_USERS',
      useFactory: async () => {
        const apiUsers = await fetch(
          'https://jsonplaceholder.typicode.com/users',
        ).then((response) => response.json());
        return apiUsers.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        });
      },
    },
  ],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
