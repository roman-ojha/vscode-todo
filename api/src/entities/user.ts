import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Todo } from "./Todo";
// here we kind of create the schema of what kind of thing that you want to put inside your database
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // username might be null so we have to make is nullable
  @Column("text", { nullable: true })
  name: string;

  @Column("text", { unique: true, nullable: true })
  githubId: string;

  @OneToMany(() => Todo, (t) => t.creator)
  todos: Promise<Todo[]>;
  // now here we makde a relationship
}
