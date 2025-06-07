import { ObjectType, Field, ID, registerEnumType, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum InventoryType {
  IN = 'in',
  OUT = 'out',
}

export enum BloodGroup {
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
}

registerEnumType(InventoryType, {
  name: 'InventoryType',
});

registerEnumType(BloodGroup, {
  name: 'BloodGroup',
});

@ObjectType()
@Entity('inventory')
export class Inventory {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => InventoryType)
  @Column({
    type: 'enum',
    enum: InventoryType,
  })
  inventoryType: InventoryType;

  @Field(() => BloodGroup)
  @Column({
    type: 'enum',
    enum: BloodGroup,
  })
  bloodGroup: BloodGroup;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field()
  @Column()
  email: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.organisationInventory)
  @JoinColumn({ name: 'organisationId' })
  organisation: User;

  @Column()
  organisationId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.receivedInventory, { nullable: true })
  @JoinColumn({ name: 'hospitalId' })
  hospital?: User;

  @Column({ nullable: true })
  hospitalId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.donatedInventory, { nullable: true })
  @JoinColumn({ name: 'donarId' })
  donar?: User;

  @Column({ nullable: true })
  donarId?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
