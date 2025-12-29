import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Public } from "../auth/decorators/public.decorator";

interface FeatureManifest {
  appId: string;
  name: string;
  description: string;
  version: string;
  features: Feature[];
  permissions: PermissionDefinition[];
  webhooks: WebhookDefinition[];
}

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredPermissions: string[];
}

interface PermissionDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface WebhookDefinition {
  event: string;
  description: string;
  payloadSchema: object;
}

@ApiTags("app-features")
@Controller("manifest")
export class AppFeaturesController {
  @Get()
  @Public()
  @ApiOperation({ summary: "Get application features manifest for TAH integration" })
  @ApiResponse({
    status: 200,
    description: "Application features manifest",
  })
  getManifest(): FeatureManifest {
    return {
      appId: "osp",
      name: "Organization Structure Platform",
      description: "Manage organizational hierarchies, units, and structures with powerful tree visualization and management capabilities.",
      version: "1.0.0",
      features: [
        {
          id: "org-management",
          name: "Organization Management",
          description: "Create and manage organizations",
          category: "core",
          requiredPermissions: ["org:read"],
        },
        {
          id: "org-unit-management",
          name: "Organizational Unit Management",
          description: "Create, edit, and manage organizational units within the hierarchy",
          category: "core",
          requiredPermissions: ["org_unit:read"],
        },
        {
          id: "org-unit-types",
          name: "Unit Type Configuration",
          description: "Define and configure organizational unit types (departments, teams, divisions, etc.)",
          category: "configuration",
          requiredPermissions: ["org_unit_type:read"],
        },
        {
          id: "tree-visualization",
          name: "Tree Visualization",
          description: "Interactive tree view of organizational structure",
          category: "visualization",
          requiredPermissions: ["tree:read"],
        },
        {
          id: "tree-export",
          name: "Tree Export",
          description: "Export organizational structure to various formats (JSON, CSV, PDF)",
          category: "export",
          requiredPermissions: ["tree:export"],
        },
        {
          id: "audit-logs",
          name: "Audit Logs",
          description: "View audit trail of all changes to the organizational structure",
          category: "audit",
          requiredPermissions: ["audit:read"],
        },
      ],
      permissions: [
        {
          id: "org:read",
          name: "View Organizations",
          description: "View organization details",
          category: "Organization",
        },
        {
          id: "org:write",
          name: "Edit Organizations",
          description: "Create and edit organizations",
          category: "Organization",
        },
        {
          id: "org:delete",
          name: "Delete Organizations",
          description: "Delete organizations",
          category: "Organization",
        },
        {
          id: "org:admin",
          name: "Administer Organizations",
          description: "Full administrative access to organizations",
          category: "Organization",
        },
        {
          id: "org_unit:read",
          name: "View Organizational Units",
          description: "View organizational unit details",
          category: "Organizational Units",
        },
        {
          id: "org_unit:write",
          name: "Edit Organizational Units",
          description: "Create and edit organizational units",
          category: "Organizational Units",
        },
        {
          id: "org_unit:delete",
          name: "Delete Organizational Units",
          description: "Delete organizational units",
          category: "Organizational Units",
        },
        {
          id: "org_unit:move",
          name: "Move Organizational Units",
          description: "Move organizational units within the hierarchy",
          category: "Organizational Units",
        },
        {
          id: "org_unit_type:read",
          name: "View Unit Types",
          description: "View organizational unit type definitions",
          category: "Unit Types",
        },
        {
          id: "org_unit_type:write",
          name: "Edit Unit Types",
          description: "Create and edit organizational unit types",
          category: "Unit Types",
        },
        {
          id: "org_unit_type:delete",
          name: "Delete Unit Types",
          description: "Delete organizational unit types",
          category: "Unit Types",
        },
        {
          id: "tree:read",
          name: "View Tree",
          description: "View organizational tree structure",
          category: "Tree",
        },
        {
          id: "tree:export",
          name: "Export Tree",
          description: "Export organizational tree to various formats",
          category: "Tree",
        },
        {
          id: "audit:read",
          name: "View Audit Logs",
          description: "View audit logs and change history",
          category: "Audit",
        },
        {
          id: "admin",
          name: "Administrator",
          description: "Full administrative access to all features",
          category: "Administration",
        },
      ],
      webhooks: [
        {
          event: "org_unit.created",
          description: "Fired when a new organizational unit is created",
          payloadSchema: {
            type: "object",
            properties: {
              orgUnitId: { type: "string" },
              orgId: { type: "string" },
              name: { type: "string" },
              typeId: { type: "string" },
              parentId: { type: "string" },
              createdBy: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
        {
          event: "org_unit.updated",
          description: "Fired when an organizational unit is updated",
          payloadSchema: {
            type: "object",
            properties: {
              orgUnitId: { type: "string" },
              orgId: { type: "string" },
              changes: { type: "object" },
              updatedBy: { type: "string" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
        {
          event: "org_unit.deleted",
          description: "Fired when an organizational unit is deleted",
          payloadSchema: {
            type: "object",
            properties: {
              orgUnitId: { type: "string" },
              orgId: { type: "string" },
              deletedBy: { type: "string" },
              deletedAt: { type: "string", format: "date-time" },
            },
          },
        },
        {
          event: "org_unit.moved",
          description: "Fired when an organizational unit is moved in the hierarchy",
          payloadSchema: {
            type: "object",
            properties: {
              orgUnitId: { type: "string" },
              orgId: { type: "string" },
              previousParentId: { type: "string" },
              newParentId: { type: "string" },
              movedBy: { type: "string" },
              movedAt: { type: "string", format: "date-time" },
            },
          },
        },
      ],
    };
  }
}
