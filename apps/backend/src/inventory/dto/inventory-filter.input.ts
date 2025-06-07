import { Field, InputType } from '@nestjs/graphql';
import { BloodGroup, InventoryType } from '../entities/inventory.entity';

@InputType()
export class InventoryFiltersInput {
  @Field(() => String, { nullable: true })
  hospitalId?: string;

  @Field(() => String, { nullable: true })
  donarId?: string;

  @Field(() => String, { nullable: true })
  organisationId?: string;

  @Field(() => InventoryType, { nullable: true })
  inventoryType?: InventoryType;

  @Field(() => BloodGroup, { nullable: true })
  bloodGroup?: BloodGroup;
}
