import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    query.where({ user }); // getting tasks that belong to the user that is signed in (tasks ta3 el user ela connected tawa moch ytale3likk ta3 el tasks ta3 el users el koul)

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        ('LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)') , // for the sensitive input
        {
          search: `%${search}%`,
        } /*% makes us to make the search caracter par caracter thats mean no need to entre the whole word to search for it */,
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user, // the define the user propriety or the owner
    });

    await this.save(task);
    return task;
  }
}
