import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: true })
  text: string;

  @Column("boolean", { default: false, nullable: true })
  completed: boolean;

  @Column()
  creatorId: number;

  //   now here we have to know who has created the todo so, we will going to setup the relationship between Todo and user
  @ManyToOne(() => User, (u) => u.todos)
  @JoinColumn({ name: "creatorId" })
  creator: Promise<User>;
  //   here it will going to be creator and the type "User" where it is Promise which return User
  // so we need to setup a field on our user so typeworm knows both sides of the relationship

  // now we have to model now we can create our route for the api in index.ts
}
