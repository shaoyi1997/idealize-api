import 'sequelize';

declare module 'sequelize' {
  interface Instance<TAttributes> {
    values: TAttributes;
  }
}
