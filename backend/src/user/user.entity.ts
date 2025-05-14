import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from '../course/course.entity';
import { Role } from '../enums/role.enum';
import { ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Course, { cascade: true })
  @JoinTable()
  favorites?: Course[];

  @ManyToMany(() => Course, { cascade: true })
  @JoinTable()
  coursesInscription?: Course[];
}
