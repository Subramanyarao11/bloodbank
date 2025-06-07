import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Inventory,
  InventoryType,
  BloodGroup,
} from './entities/inventory.entity';
import { User } from '../users/entities/user.entity';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { BloodGroupData } from './dto/blood-group-data.type';
import { InventoryFiltersInput } from './dto/inventory-filter.input';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createInventoryInput: CreateInventoryInput,
    currentUserId: string,
  ): Promise<Inventory> {
    const { email, inventoryType, bloodGroup, quantity, organisationId } =
      createInventoryInput;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (inventoryType === InventoryType.OUT) {
      await this.validateOutInventory(organisationId, bloodGroup, quantity);
    }

    const inventory = this.inventoryRepository.create({
      inventoryType,
      bloodGroup,
      quantity,
      email,
      organisationId,
      ...(inventoryType === InventoryType.IN && { donarId: user.id }),
      ...(inventoryType === InventoryType.OUT && { hospitalId: user.id }),
    });

    return this.inventoryRepository.save(inventory);
  }

  async findAll(organisationId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { organisationId },
      relations: ['donar', 'hospital', 'organisation'],
      order: { createdAt: 'DESC' },
    });
  }

  async findWithFilters(filters: InventoryFiltersInput): Promise<Inventory[]> {
    const queryBuilder = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.donar', 'donar')
      .leftJoinAndSelect('inventory.hospital', 'hospital')
      .leftJoinAndSelect('inventory.organisation', 'organisation');

    if (filters.hospitalId) {
      queryBuilder.andWhere('inventory.hospitalId = :hospitalId', {
        hospitalId: filters.hospitalId,
      });
    }

    if (filters.donarId) {
      queryBuilder.andWhere('inventory.donarId = :donarId', {
        donarId: filters.donarId,
      });
    }

    if (filters.organisationId) {
      queryBuilder.andWhere('inventory.organisationId = :organisationId', {
        organisationId: filters.organisationId,
      });
    }

    if (filters.inventoryType) {
      queryBuilder.andWhere('inventory.inventoryType = :inventoryType', {
        inventoryType: filters.inventoryType,
      });
    }

    if (filters.bloodGroup) {
      queryBuilder.andWhere('inventory.bloodGroup = :bloodGroup', {
        bloodGroup: filters.bloodGroup,
      });
    }

    return queryBuilder.orderBy('inventory.createdAt', 'DESC').getMany();
  }

  async getRecentInventory(organisationId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { organisationId },
      order: { createdAt: 'DESC' },
      take: 3,
    });
  }

  async getDonars(organisationId: string): Promise<User[]> {
    const donarIds = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('DISTINCT inventory.donarId')
      .where('inventory.organisationId = :organisationId', { organisationId })
      .andWhere('inventory.donarId IS NOT NULL')
      .getRawMany();

    const ids = donarIds.map((item) => item.inventory_donarId);

    if (ids.length === 0) return [];

    return this.userRepository.findByIds(ids);
  }

  async getHospitals(organisationId: string): Promise<User[]> {
    const hospitalIds = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('DISTINCT inventory.hospitalId')
      .where('inventory.organisationId = :organisationId', { organisationId })
      .andWhere('inventory.hospitalId IS NOT NULL')
      .getRawMany();

    const ids = hospitalIds.map((item) => item.inventory_hospitalId);

    if (ids.length === 0) return [];

    return this.userRepository.findByIds(ids);
  }

  async getOrganisationsForDonar(donarId: string): Promise<User[]> {
    const orgIds = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('DISTINCT inventory.organisationId')
      .where('inventory.donarId = :donarId', { donarId })
      .getRawMany();

    const ids = orgIds.map((item) => item.inventory_organisationId);

    if (ids.length === 0) return [];

    return this.userRepository.findByIds(ids);
  }

  async getOrganisationsForHospital(hospitalId: string): Promise<User[]> {
    const orgIds = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('DISTINCT inventory.organisationId')
      .where('inventory.hospitalId = :hospitalId', { hospitalId })
      .getRawMany();

    const ids = orgIds.map((item) => item.inventory_organisationId);

    if (ids.length === 0) return [];

    return this.userRepository.findByIds(ids);
  }

  async getBloodGroupAnalytics(
    organisationId: string,
  ): Promise<BloodGroupData[]> {
    const bloodGroups = Object.values(BloodGroup);
    const bloodGroupData: BloodGroupData[] = [];

    for (const bloodGroup of bloodGroups) {
      const totalInResult = await this.inventoryRepository
        .createQueryBuilder('inventory')
        .select('SUM(inventory.quantity)', 'total')
        .where('inventory.organisationId = :organisationId', { organisationId })
        .andWhere('inventory.bloodGroup = :bloodGroup', { bloodGroup })
        .andWhere('inventory.inventoryType = :inventoryType', {
          inventoryType: InventoryType.IN,
        })
        .getRawOne();

      const totalOutResult = await this.inventoryRepository
        .createQueryBuilder('inventory')
        .select('SUM(inventory.quantity)', 'total')
        .where('inventory.organisationId = :organisationId', { organisationId })
        .andWhere('inventory.bloodGroup = :bloodGroup', { bloodGroup })
        .andWhere('inventory.inventoryType = :inventoryType', {
          inventoryType: InventoryType.OUT,
        })
        .getRawOne();

      const totalIn = parseInt(totalInResult?.total) || 0;
      const totalOut = parseInt(totalOutResult?.total) || 0;
      const availableBlood = totalIn - totalOut;

      bloodGroupData.push({
        bloodGroup,
        totalIn,
        totalOut,
        availableBlood,
      });
    }

    return bloodGroupData;
  }

  private async validateOutInventory(
    organisationId: string,
    bloodGroup: BloodGroup,
    requestedQuantity: number,
  ): Promise<void> {
    const totalInResult = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('SUM(inventory.quantity)', 'total')
      .where('inventory.organisationId = :organisationId', { organisationId })
      .andWhere('inventory.bloodGroup = :bloodGroup', { bloodGroup })
      .andWhere('inventory.inventoryType = :inventoryType', {
        inventoryType: InventoryType.IN,
      })
      .getRawOne();

    const totalOutResult = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .select('SUM(inventory.quantity)', 'total')
      .where('inventory.organisationId = :organisationId', { organisationId })
      .andWhere('inventory.bloodGroup = :bloodGroup', { bloodGroup })
      .andWhere('inventory.inventoryType = :inventoryType', {
        inventoryType: InventoryType.OUT,
      })
      .getRawOne();

    const totalIn = parseInt(totalInResult?.total) || 0;
    const totalOut = parseInt(totalOutResult?.total) || 0;
    const availableQuantity = totalIn - totalOut;

    if (availableQuantity < requestedQuantity) {
      throw new BadRequestException(
        `Only ${availableQuantity}ML of ${bloodGroup.toUpperCase()} is available`,
      );
    }
  }
}
