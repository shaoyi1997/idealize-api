import 'sequelize';

declare module 'sequelize' {
  interface Model<TInstance, TAttributes> {
    name: string;
    associations: any;
    primaryKeyField: string;
    tableName: string;
  }

  interface Instance<TAttributes> {
    values: TAttributes;
  }
}
