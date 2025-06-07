import { Field, ObjectType } from '@nestjs/graphql';
import { BloodGroupData } from './blood-group-data.type';

@ObjectType()
export class BloodGroupAnalytics {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => [BloodGroupData])
  bloodGroupData: BloodGroupData[];
}
