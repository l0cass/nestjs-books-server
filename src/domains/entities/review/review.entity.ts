import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user';
import { BookReference } from '../book-reference';

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @ManyToOne(() => BookReference, (bookReference) => bookReference.googleBookId)
  @JoinColumn()
  bookReference: BookReference;

  @Column({ type: 'varchar', length: 60 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  authors: string[] | null;

  @Column({ type: 'varchar', length: 1 })
  rating: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
