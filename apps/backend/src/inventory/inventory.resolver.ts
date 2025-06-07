import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { InventoryFiltersInput } from './dto/inventory-filter.input';
import { BloodGroupAnalytics } from './dto/blood-group-analytics.input';

@Resolver(() => Inventory)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation(() => Inventory)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANISATION)
  async createInventory(
    @Args('createInventoryInput') createInventoryInput: CreateInventoryInput,
    @CurrentUser() user: User,
  ) {
    return this.inventoryService.create(createInventoryInput, user.id);
  }

  @Query(() => [Inventory], { name: 'inventory' })
  @UseGuards(GqlAuthGuard)
  async getInventory(@CurrentUser() user: User) {
    return this.inventoryService.findAll(user.id);
  }

  @Query(() => [Inventory], { name: 'inventoryWithFilters' })
  @UseGuards(GqlAuthGuard)
  async getInventoryWithFilters(
    @Args('filters') filters: InventoryFiltersInput,
  ) {
    return this.inventoryService.findWithFilters(filters);
  }

  @Query(() => [Inventory], { name: 'recentInventory' })
  @UseGuards(GqlAuthGuard)
  async getRecentInventory(@CurrentUser() user: User) {
    return this.inventoryService.getRecentInventory(user.id);
  }

  @Query(() => [User], { name: 'inventoryDonars' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANISATION)
  async getDonars(@CurrentUser() user: User) {
    return this.inventoryService.getDonars(user.id);
  }

  @Query(() => [User], { name: 'inventoryHospitals' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANISATION)
  async getHospitals(@CurrentUser() user: User) {
    return this.inventoryService.getHospitals(user.id);
  }

  @Query(() => [User], { name: 'organisationsForDonar' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.DONOR)
  async getOrganisationsForDonar(@CurrentUser() user: User) {
    return this.inventoryService.getOrganisationsForDonar(user.id);
  }

  @Query(() => [User], { name: 'organisationsForHospital' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.HOSPITAL)
  async getOrganisationsForHospital(@CurrentUser() user: User) {
    return this.inventoryService.getOrganisationsForHospital(user.id);
  }

  @Query(() => BloodGroupAnalytics, { name: 'bloodGroupAnalytics' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANISATION)
  async getBloodGroupAnalytics(
    @CurrentUser() user: User,
  ): Promise<BloodGroupAnalytics> {
    const bloodGroupData = await this.inventoryService.getBloodGroupAnalytics(
      user.id,
    );
    return {
      success: true,
      message: 'Blood Group Data Fetched Successfully',
      bloodGroupData,
    };
  }
}
