import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BloodGroup } from '../entities/inventory.entity';

@ObjectType()
export class BloodGroupData {
  @Field(() => BloodGroup)
  bloodGroup: BloodGroup;

  @Field(() => Int)
  totalIn: number;

  @Field(() => Int)
  totalOut: number;

  @Field(() => Int)
  availableBlood: number;
}
