export const UserRole = {
  ADMIN: 'ADMIN',
  DONOR: 'DONOR',
  HOSPITAL: 'HOSPITAL',
  ORGANISATION: 'ORGANISATION'
} as const;

export const BloodGroup = {
  A_POSITIVE: 'A_POSITIVE',
  A_NEGATIVE: 'A_NEGATIVE',
  B_POSITIVE: 'B_POSITIVE',
  B_NEGATIVE: 'B_NEGATIVE',
  AB_POSITIVE: 'AB_POSITIVE',
  AB_NEGATIVE: 'AB_NEGATIVE',
  O_POSITIVE: 'O_POSITIVE',
  O_NEGATIVE: 'O_NEGATIVE'
} as const;

export const InventoryType = {
  IN: 'IN',
  OUT: 'OUT'
} as const;

export interface User {
  id: string;
  email: string;
  phone: string;
  address: string;
  role: typeof UserRole[keyof typeof UserRole];
  name?: string;
  organisationName?: string;
  hospitalName?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  bloodGroup: typeof BloodGroup[keyof typeof BloodGroup];
  inventoryType: typeof InventoryType[keyof typeof InventoryType];
  quantity: number;
  email: string;
  organisation: User;
  donar?: User;
  hospital?: User;
  createdAt: string;
  updatedAt: string;
}

export interface BloodGroupData {
  bloodGroup: typeof BloodGroup[keyof typeof BloodGroup];
  totalIn: number;
  totalOut: number;
  availableBlood: number;
}

export interface BloodGroupAnalytics {
  success: boolean;
  message: string;
  bloodGroupData: BloodGroupData[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
  role: typeof UserRole[keyof typeof UserRole];
}

export interface RegisterInput {
  email: string;
  password: string;
  phone: string;
  address: string;
  role: typeof UserRole[keyof typeof UserRole];
  name?: string;
  organisationName?: string;
  hospitalName?: string;
  website?: string;
}

export interface CreateInventoryInput {
  bloodGroup: typeof BloodGroup[keyof typeof BloodGroup];
  inventoryType: typeof InventoryType[keyof typeof InventoryType];
  quantity: number;
  email: string;
  organisationId: string;
}

export interface InventoryFiltersInput {
  inventoryType?: typeof InventoryType[keyof typeof InventoryType];
  bloodGroup?: typeof BloodGroup[keyof typeof BloodGroup];
  organisationId?: string;
  donarId?: string;
  hospitalId?: string;
}
