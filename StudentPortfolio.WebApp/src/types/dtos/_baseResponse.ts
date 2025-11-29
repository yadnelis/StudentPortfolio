import type { BaseEntity } from "./_baseEntity";

export interface BaseResponse<T extends BaseEntity | BaseEntity[]> {
  entity: T;
  resource: string;
  time: Date;
}
