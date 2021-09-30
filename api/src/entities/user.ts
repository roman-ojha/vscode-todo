import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
