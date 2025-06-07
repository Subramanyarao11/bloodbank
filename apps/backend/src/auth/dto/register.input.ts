import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

@InputType()
export class RegisterInput {
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field({ nullable: true })
  @ValidateIf((o) => o.role === UserRole.DONOR)
  @IsNotEmpty({ message: 'Name is required for donors' })
  name?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => o.role === UserRole.ORGANISATION)
  @IsNotEmpty({ message: 'Organisation name is required for organisations' })
  organisationName?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => o.role === UserRole.HOSPITAL)
  @IsNotEmpty({ message: 'Hospital name is required for hospitals' })
  hospitalName?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  website?: string;

  @Field()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsNotEmpty()
  phone: string;
}
