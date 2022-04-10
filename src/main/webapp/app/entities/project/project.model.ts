export interface IProject {
  id?: number;
  code?: string;
  name?: string;
}

export class Project implements IProject {
  constructor(public id?: number, public code?: string, public name?: string) {}
}

export function getProjectIdentifier(project: IProject): number | undefined {
  return project.id;
}
