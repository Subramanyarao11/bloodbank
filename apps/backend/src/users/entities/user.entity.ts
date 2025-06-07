import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  ORGANISATION = 'organisation',
  DONOR = 'donor',
  HOSPITAL = 'hospital',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User roles in the blood bank system',
});

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DONOR,
  })
  role: UserRole;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  organisationName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  hospitalName?: string;

  @Field()
  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  email: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  phone: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
