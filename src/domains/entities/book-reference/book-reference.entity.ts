import { BaseEntity, Column, Entity, PrimaryColumn, Timestamp } from 'typeorm';

@Entity()
export class BookReference extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  googleBookId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', array: true })
  authors: string[];

  @Column({ type: 'text' })
  thumbnailUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Timestamp;
}
