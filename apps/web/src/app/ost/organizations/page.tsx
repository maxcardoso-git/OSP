"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Plus, Building2 } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export default function OrganizationsPage() {
  const t = useTranslations();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => apiClient.get<Organization[]>("/organizations"),
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("organizations.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("organizations.subtitle")}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          {t("organizations.createNew")}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      ) : organizations && organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Link
              key={org.id}
              href={`/ost/organizations/${org.id}/tree`}
              className="block p-6 bg-card rounded-lg border hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{org.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {org.slug}
                  </p>
                  {org.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {org.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t("common.noResults")}</p>
        </div>
      )}
    </div>
  );
}
