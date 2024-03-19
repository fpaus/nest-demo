import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Res,
  Req,
  Param,
  Query,
  Body,
  Headers,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { User as UserEntity } from './users.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { DateAdderInterceptor } from 'src/interceptors/date-adder.interceptor';
import { UsersDbService } from './usersDb.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersDbService: UsersDbService,
  ) {}

  @Get()
  getUsers(@Query('name') name?: string) {
    if (name) {
      return this.usersService.getUserByName(name);
    }

    return this.usersService.getUsers();
  }

  @Get('profile')
  getUserProfile(@Headers('token') token?: string) {
    if (token !== '1234') {
      return 'Sin acceso';
    }
    return 'Este endpoint retorna el perfil del usuario';
  }

  @Get('profile/images')
  @UseGuards(AuthGuard)
  getUserImages() {
    return 'Este endpoint retorna las imágenes del usuario';
  }

  @HttpCode(418)
  @Get('coffee')
  getCoffee() {
    return 'No se hacer cafe, soy una tetera';
  }

  @Get('message')
  getMessage(@Res() response: Response) {
    response.status(200).send('Este es un mensaje');
  }

  @Get('request')
  getRequest(@Req() request: Request) {
    console.log(request);
    return 'esta ruta loguea el request';
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    console.log(id);
    return this.usersService.getUserById(Number(id));
  }

  @Post()
  @UseInterceptors(DateAdderInterceptor)
  createUser(
    @Body() user: UserEntity,
    @Req() request: Request & { now: string },
  ) {
    console.log('dentro del endoint:', request.now);
    return this.usersDbService.saveUser({ ...user, createdAt: request.now });
  }

  @Put()
  updateUser() {
    return 'Este endpoint modifica un usuario';
  }

  @Delete()
  deleteUser() {
    return 'Este endpoint elimina un usuario';
  }
}
