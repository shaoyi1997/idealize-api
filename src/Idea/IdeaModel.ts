import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  Unique,
  IsUUID,
} from 'sequelize-typescript';

@Table({
  comment: 'Idea Details',
})
class Idea extends Model<Idea> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @IsUUID(4)
  @Unique
  @Column({
    comment: 'Primary Key.',
    type: DataType.UUID,
  })
  ideaId: string;

  @Column({
    comment: 'Title of the idea',
    type: DataType.TEXT,
  })
  title: string;

  @Column({
    comment: 'A description of the idea',
    type: DataType.TEXT,
  })
  description: string;
}

export default Idea;
