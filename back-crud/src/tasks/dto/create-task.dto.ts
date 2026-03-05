import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    status: string;

    @IsOptional()
    dueDate: string;

    @IsNumber()
    userId: number;
}