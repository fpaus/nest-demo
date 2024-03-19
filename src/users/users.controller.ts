import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Res,
  Req,
  Param,
  Query,
  Body,
  Headers,
  UseInterceptors,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  NotFoundException,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';

import { DateAdderInterceptor } from 'src/interceptors/date-adder.interceptor';
import { UsersDbService } from './usersDb.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinSizeValidatorPipe } from 'src/pipes/min-size-validator.pipe';

@Controller('users')
// @UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersDbService: UsersDbService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getUsers(@Query('name') name?: string) {
    if (name) {
      return this.usersDbService.getUserByName(name);
    }

    return this.usersDbService.getUsers();
  }

  @Get('profile')
  getUserProfile(@Headers('token') token?: string) {
    if (token !== '1234') {
      return 'Sin acceso';
    }
    return 'Este endpoint retorna el perfil del usuario';
  }

  @Post('profile/images')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(MinSizeValidatorPipe)
  // @UseGuards(AuthGuard)
  getUserImages(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 100000,
            message: 'El archivo debe ser menor a 100kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // return this.cloudinaryService.upladImage(file);
    return file;
  }

  // @HttpCode(418)
  @Get('coffee')
  getCoffee() {
    try {
      throw new Error();
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.I_AM_A_TEAPOT,
          error: 'Envio de cafe fallido',
        },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
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
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    console.log(id);
    const user = await this.usersDbService.getUserById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  @Post()
  @UseInterceptors(DateAdderInterceptor)
  createUser(
    @Body() user: CreateUserDto,
    @Req() request: Request & { now: string },
  ) {
    console.log({ user });
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
