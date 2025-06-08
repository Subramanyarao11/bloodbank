export const LOGIN_MUTATION = `
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      success
      message
      token
      user {
        id
        email
        phone
        address
        role
        name
        organisationName
        hospitalName
        website
        createdAt
        updatedAt
      }
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      success
      message
      token
      user {
        id
        email
        phone
        address
        role
        name
        organisationName
        hospitalName
        website
        createdAt
        updatedAt
      }
    }
  }
`;

export const CURRENT_USER_QUERY = `
  query CurrentUser {
    currentUser {
      id
      email
      phone
      address
      role
      name
      organisationName
      hospitalName
      website
      createdAt
      updatedAt
    }
  }
`;

export const USERS_QUERY = `
  query Users {
    users {
      id
      email
      phone
      address
      role
      name
      organisationName
      hospitalName
      website
      createdAt
      updatedAt
    }
  }
`;

export const DONORS_QUERY = `
  query Donors {
    donars {
      id
      email
      phone
      address
      name
      createdAt
      updatedAt
    }
  }
`;

export const HOSPITALS_QUERY = `
  query Hospitals {
    hospitals {
      id
      email
      phone
      address
      hospitalName
      website
      createdAt
      updatedAt
    }
  }
`;

export const ORGANISATIONS_QUERY = `
  query Organisations {
    organisations {
      id
      email
      phone
      address
      organisationName
      website
      createdAt
      updatedAt
    }
  }
`;

export const INVENTORY_QUERY = `
  query Inventory {
    inventory {
      id
      bloodGroup
      inventoryType
      quantity
      email
      createdAt
      updatedAt
      organisation {
        id
        organisationName
        email
      }
      donar {
        id
        name
        email
      }
      hospital {
        id
        hospitalName
        email
      }
    }
  }
`;

export const INVENTORY_WITH_FILTERS_QUERY = `
  query InventoryWithFilters($filters: InventoryFiltersInput!) {
    inventoryWithFilters(filters: $filters) {
      id
      bloodGroup
      inventoryType
      quantity
      email
      createdAt
      updatedAt
      organisation {
        id
        organisationName
        email
      }
      donar {
        id
        name
        email
      }
      hospital {
        id
        hospitalName
        email
      }
    }
  }
`;

export const RECENT_INVENTORY_QUERY = `
  query RecentInventory {
    recentInventory {
      id
      bloodGroup
      inventoryType
      quantity
      email
      createdAt
      organisation {
        id
        organisationName
        email
      }
      donar {
        id
        name
        email
      }
      hospital {
        id
        hospitalName
        email
      }
    }
  }
`;

export const BLOOD_GROUP_ANALYTICS_QUERY = `
  query BloodGroupAnalytics {
    bloodGroupAnalytics {
      success
      message
      bloodGroupData {
        bloodGroup
        totalIn
        totalOut
        availableBlood
      }
    }
  }
`;

export const CREATE_INVENTORY_MUTATION = `
  mutation CreateInventory($createInventoryInput: CreateInventoryInput!) {
    createInventory(createInventoryInput: $createInventoryInput) {
      id
      bloodGroup
      inventoryType
      quantity
      email
      createdAt
      organisation {
        id
        organisationName
        email
      }
      donar {
        id
        name
        email
      }
      hospital {
        id
        hospitalName
        email
      }
    }
  }
`;

export const INVENTORY_DONORS_QUERY = `
  query InventoryDonors {
    inventoryDonars {
      id
      email
      phone
      address
      name
      createdAt
      updatedAt
    }
  }
`;

export const INVENTORY_HOSPITALS_QUERY = `
  query InventoryHospitals {
    inventoryHospitals {
      id
      email
      phone
      address
      hospitalName
      website
      createdAt
      updatedAt
    }
  }
`;

export const ORGANISATIONS_FOR_DONOR_QUERY = `
  query OrganisationsForDonor {
    organisationsForDonar {
      id
      email
      phone
      address
      organisationName
      website
      createdAt
      updatedAt
    }
  }
`;

export const ORGANISATIONS_FOR_HOSPITAL_QUERY = `
  query OrganisationsForHospital {
    organisationsForHospital {
      id
      email
      phone
      address
      organisationName
      website
      createdAt
      updatedAt
    }
  }
`;
