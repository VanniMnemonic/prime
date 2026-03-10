import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Batch } from './Batch';
import { Note } from './Note';

@Entity()
export class Withdrawal {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  date!: Date;

  @OneToMany(() => Note, (note) => note.withdrawal)
  notes!: Note[];

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column()
  user_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  batch_id!: number;

  @ManyToOne(() => Batch)
  @JoinColumn({ name: 'batch_id' })
  batch!: Batch;

  @Column({ default: false })
  must_return!: boolean;

  @Column({ nullable: true })
  expected_return_date?: Date;

  @Column({ type: 'int', default: 0 })
  returned_quantity!: number;

  @Column({ nullable: true })
  return_date?: Date;

  @Column({ type: 'int', default: 0 })
  inefficient_quantity!: number;
}
