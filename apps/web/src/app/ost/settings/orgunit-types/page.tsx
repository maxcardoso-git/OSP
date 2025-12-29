"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Plus, Settings, Pencil, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface OrgUnitType {
  id: string;
  name: string;
  code: string;
  description?: string;
  level: number;
  color?: string;
}

export default function OrgUnitTypesPage() {
  const t = useTranslations();

  const { data: types, isLoading } = useQuery({
    queryKey: ["orgUnitTypes"],
    queryFn: () => apiClient.get<OrgUnitType[]>("/org-unit-types"),
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("orgUnitTypes.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("orgUnitTypes.subtitle")}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          {t("orgUnitTypes.createNew")}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      ) : types && types.length > 0 ? (
        <div className="bg-card rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">
                  {t("orgUnitTypes.fields.name")}
                </th>
                <th className="text-left p-4 font-medium">
                  {t("orgUnitTypes.fields.code")}
                </th>
                <th className="text-left p-4 font-medium">
                  {t("orgUnitTypes.fields.level")}
                </th>
                <th className="text-left p-4 font-medium">
                  {t("orgUnitTypes.fields.color")}
                </th>
                <th className="text-right p-4 font-medium">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {types.map((type) => (
                <tr key={type.id} className="border-b last:border-b-0">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{type.name}</p>
                      {type.description && (
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                      {type.code}
                    </code>
                  </td>
                  <td className="p-4">{type.level}</td>
                  <td className="p-4">
                    {type.color && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {type.color}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("common.noResults")}</p>
        </div>
      )}
    </div>
  );
}
