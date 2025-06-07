import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryResolver } from './inventory.resolver';
import { Inventory } from './entities/inventory.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, User])],
  providers: [InventoryResolver, InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
