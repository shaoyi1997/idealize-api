import { Model } from 'sequelize-typescript';

declare module 'sequelize-typescript' {
  type NonAbstract<T> = { [P in keyof T]: T[P] };
  type StaticMembers = NonAbstract<typeof Model>;
  export type ModelType<T = any> = (new () => T) & StaticMembers;
}
