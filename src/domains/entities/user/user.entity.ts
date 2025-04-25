import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ROLE_ENUM } from 'src/commons/enums/roles/roles.enum';
import { Admin } from '../admin';
import { Review } from '../review';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Admin, (admin) => admin.user, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  admin: Admin | null;

  @Column({ type: 'varchar', length: '254', unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  photoUrl: string | null;

  @Column({ type: 'varchar', length: '30' })
  username: string;

  @Column({ type: 'varchar', length: '30' })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  avatarUrl: string | null;

  @Column({
    type: 'enum',
    enum: ROLE_ENUM,
    array: true,
    default: [ROLE_ENUM.USER],
  })
  roles: ROLE_ENUM[];

  @Column({ type: 'varchar', length: '128' })
  passwordHash: string;

  @OneToMany(() => Review, (review) => review.user)
  @JoinColumn()
  reviews: Review[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
