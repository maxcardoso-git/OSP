// Common types for OST application

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TreeNode {
  id: string;
  name: string;
  code?: string;
  typeId: string;
  parentId: string | null;
  depth: number;
  path: string;
  children?: TreeNode[];
}

export interface AuditInfo {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type OrgUnitStatus = 'active' | 'inactive' | 'archived';

export interface OrgUnitFilters {
  status?: OrgUnitStatus;
  typeId?: string;
  parentId?: string | null;
  search?: string;
}

export interface AuditFilters {
  entityType?: string;
  entityId?: string;
  action?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}
