import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import { Favorite } from "../../modules/user-preferences/infrastructure/persistence/sequelize/models/Favorite.model";
import { Comment } from "../../modules/user-preferences/infrastructure/persistence/sequelize/models/Comment.model";

@Table({
  tableName: "users",
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 50],
    },
  })
  declare username: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare is_anonymous: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  // Associations
  @HasMany(() => Favorite)
  declare favorites: Favorite[];

  @HasMany(() => Comment)
  declare comments: Comment[];
}
