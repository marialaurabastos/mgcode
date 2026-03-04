import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { User } from '../../users/entities/user.entity'

export enum TaskStatus {
    PENDENTE = 'pendente',
    EM_PROGRESSO = 'em_progresso',
    CONCLUIDA = 'concluida',
}

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDENTE
    })
    status: TaskStatus;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    user: User;
}