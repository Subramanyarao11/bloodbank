import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { BloodGroup, InventoryType } from '../entities/inventory.entity';

@InputType()
export class CreateInventoryInput {
  @Field(() => InventoryType)
  @IsEnum(InventoryType)
  inventoryType: InventoryType;

  @Field(() => BloodGroup)
  @IsEnum(BloodGroup)
  bloodGroup: BloodGroup;

  @Field(() => Int)
  @IsPositive()
  quantity: number;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsUUID()
  @IsNotEmpty()
  organisationId: string;
}
