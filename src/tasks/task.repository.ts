import { v4 as uuidv4 } from 'uuid';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO, GetTasksFilterDTO } from './dtos';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRespository extends Repository<Task> {
  async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { seacrh, status } = filterDTO;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (seacrh) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE: search',
        { seacrh: `%${seacrh}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = new Task();

    task.id = uuidv4();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();
    delete task.user;

    return task;
  }
}
