import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = "permissions";

export const RequirePermission = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);

// Common permission constants
export const Permissions = {
  // Organization permissions
  ORG_READ: "org:read",
  ORG_WRITE: "org:write",
  ORG_DELETE: "org:delete",
  ORG_ADMIN: "org:admin",

  // Org unit permissions
  ORG_UNIT_READ: "org_unit:read",
  ORG_UNIT_WRITE: "org_unit:write",
  ORG_UNIT_DELETE: "org_unit:delete",
  ORG_UNIT_MOVE: "org_unit:move",

  // Org unit type permissions
  ORG_UNIT_TYPE_READ: "org_unit_type:read",
  ORG_UNIT_TYPE_WRITE: "org_unit_type:write",
  ORG_UNIT_TYPE_DELETE: "org_unit_type:delete",

  // Tree permissions
  TREE_READ: "tree:read",
  TREE_EXPORT: "tree:export",

  // Audit permissions
  AUDIT_READ: "audit:read",

  // Admin permissions
  ADMIN: "admin",
} as const;

export type Permission = typeof Permissions[keyof typeof Permissions];
