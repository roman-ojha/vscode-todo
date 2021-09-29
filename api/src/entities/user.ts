import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// here we kind of create the schema of what kind of thing that you want to put inside your database
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;
}
