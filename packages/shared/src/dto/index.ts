// DTOs for API requests/responses

// Organization DTOs
export interface CreateOrganizationDto {
  name: string;
  slug: string;
  description?: string;
  settings?: Record<string, unknown>;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  settings?: Record<string, unknown>;
  isActive?: boolean;
}

// OrgUnitType DTOs
export interface CreateOrgUnitTypeDto {
  name: string;
  code: string;
  description?: string;
  color?: string;
  icon?: string;
  allowedParentTypes?: string[];
  sortOrder?: number;
}

export interface UpdateOrgUnitTypeDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  allowedParentTypes?: string[];
  sortOrder?: number;
  isActive?: boolean;
}

// OrgUnit DTOs
export interface CreateOrgUnitDto {
  name: string;
  code?: string;
  typeId: string;
  parentId?: string | null;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateOrgUnitDto {
  name?: string;
  code?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  isActive?: boolean;
}

export interface MoveOrgUnitDto {
  newParentId: string | null;
}

// Tree DTOs
export interface TreeQueryDto {
  rootId?: string;
  maxDepth?: number;
  includeInactive?: boolean;
}

// Response DTOs
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
