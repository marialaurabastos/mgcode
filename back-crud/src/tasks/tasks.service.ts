import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado`);
    }

    const newTask = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      user: user,
    });

    return await this.taskRepository.save(newTask);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOneBy({ id: id });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description) task.description = updateTaskDto.description;
    if (updateTaskDto.status) task.status = updateTaskDto.status;

    return await this.taskRepository.save(task);
  }

  async findAll(userId: number) {
    return await this.taskRepository.find({
      where: { user: { id: userId } },
      relations: ['user']
    });
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id: id },
      relations: ['user']
    });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${id} não encontrada`);
    }

    return task;
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    return await this.taskRepository.remove(task);
  }
}
