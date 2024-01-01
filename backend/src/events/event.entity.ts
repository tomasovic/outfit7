import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../users/user.entity'
import { EventType } from '../types/shared.types'

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  approved: boolean

  @Column()
  name: string

  @Column()
  description: string

  @Column({
    type: 'enum',
    enum: EventType,
  })
  type: EventType

  @Column()
  priority: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => User, (user) => user.events)
  user: User
}
