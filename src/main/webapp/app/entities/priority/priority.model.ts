export interface IPriority {
  id?: number;
  code?: string;
  name?: string;
}

export class Priority implements IPriority {
  constructor(public id?: number, public code?: string, public name?: string) {}
}

export function getPriorityIdentifier(priority: IPriority): number | undefined {
  return priority.id;
}
