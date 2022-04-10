import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IStatus } from 'app/entities/status/status.model';
import { IPriority } from 'app/entities/priority/priority.model';
import { IProject } from 'app/entities/project/project.model';

export interface ITask {
  id?: number;
  taskName?: string;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  description?: string | null;
  user?: IUser | null;
  status?: IStatus | null;
  priority?: IPriority | null;
  project?: IProject | null;
}

export class Task implements ITask {
  constructor(
    public id?: number,
    public taskName?: string,
    public startDate?: dayjs.Dayjs,
    public endDate?: dayjs.Dayjs,
    public description?: string | null,
    public user?: IUser | null,
    public status?: IStatus | null,
    public priority?: IPriority | null,
    public project?: IProject | null
  ) {}
}

export function getTaskIdentifier(task: ITask): number | undefined {
  return task.id;
}
