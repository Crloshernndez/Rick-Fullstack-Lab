import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
} from "sequelize-typescript";

export enum CronLogStatus {
  SUCCESS = "success",
  FAILED = "failed",
}

@Table({
  tableName: "cron_logs",
  timestamps: false,
})
export class CronLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: "execution_date",
  })
  declare executionDate: Date;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "added_count",
  })
  declare addedCount: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "updated_count",
  })
  declare updatedCount: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "deprecated_count",
  })
  declare deprecatedCount: number;

  @Column({
    type: DataType.ENUM(...Object.values(CronLogStatus)),
    allowNull: false,
  })
  declare status: CronLogStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: "error_payload",
  })
  declare errorPayload?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: "duration_ms",
  })
  declare durationMs?: number;

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;
}
