export interface IStatus {
  id?: number;
  code?: string;
  name?: string;
}

export class Status implements IStatus {
  constructor(public id?: number, public code?: string, public name?: string) {}
}

export function getStatusIdentifier(status: IStatus): number | undefined {
  return status.id;
}
