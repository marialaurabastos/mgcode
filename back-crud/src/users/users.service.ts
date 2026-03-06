import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(newUser);

    delete savedUser.password;
    return savedUser;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'name', 'email', 'role', 'password']
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(8);
      const passwordToHash = updateUserDto.password;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
