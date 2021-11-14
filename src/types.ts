import { v4 } from 'uuid';

export type ID = ReturnType<typeof v4>;

export interface Entity {
  id: ID;
  name: string;
}

export interface Box extends Entity {}

export interface Item extends Entity {
  quantity: number;
  box?: ID;
}
