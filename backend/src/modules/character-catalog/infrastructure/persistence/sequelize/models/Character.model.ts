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
  Index,
} from "sequelize-typescript";

export enum SyncStatus {
  SYNCED = "synced",
  DEPRECATED = "deprecated",
}

@Table({
  tableName: "characters",
  timestamps: true,
})
export class Character extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Index({ unique: true })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "external_id",
  })
  declare externalId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare status?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare species?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare type?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare gender?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare image?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare origin?: {
    name: string;
    id: number;
  };

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare location?: {
    name: string;
    id: number;
  };

  @Index
  @Default(SyncStatus.SYNCED)
  @Column({
    type: DataType.ENUM(...Object.values(SyncStatus)),
    allowNull: false,
    field: "sync_status",
  })
  declare syncStatus: SyncStatus;

  @Index
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: "is_active",
  })
  declare isActive: boolean;

  @Index
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: "is_favorite",
  })
  declare isFavorite: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "last_imported_at",
  })
  declare lastImportedAt?: Date;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;
}
