import { Status } from "./status";

export interface ICurrentAndList<T> {
  current: Status | string | null;
  list: T[];
}
