import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  Index,
} from "sequelize-typescript";
import { User } from "../../../../../../shared/models/User.model";
import { Character } from "../../../../../character-catalog/infrastructure/persistence/sequelize/models/Character.model";

@Table({
  tableName: "favorites",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["user_id", "character_id"],
    },
  ],
})
export class Favorite extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "user_id",
    onDelete: "CASCADE",
  })
  declare userId: string;

  @ForeignKey(() => Character)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: "character_id",
    onDelete: "CASCADE",
  })
  declare characterId: string;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;

  // Associations
  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Character)
  declare character: Character;
}
