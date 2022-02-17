import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) // we want that whene a user make task we want it to own that task
  username: string;

  @Column()
  password: string;
  @OneToMany((_type) => Task, (task) => task.user, { eager: true }) //one user for many task
  tasks: Task[];
}
