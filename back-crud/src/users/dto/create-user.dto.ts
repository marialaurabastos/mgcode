import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: 'Digite um nome válido' })
    @IsNotEmpty({ message: 'O campo não pode estar vazio' })
    name: string;

    @IsEmail({}, { message: 'Digite um email válido' })
    @IsNotEmpty({ message: 'O campo não pode estar vazio' })
    email: string;

    @IsString({ message: 'Digite uma senha válida' })
    @IsNotEmpty({ message: 'O campo não pode estar vazio' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    password: string;


    @IsString({ message: 'Selecione uma função para o usuário' })
    @IsOptional()
    role:string;
}
