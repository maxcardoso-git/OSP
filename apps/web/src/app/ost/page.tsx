"use client";

import { useTranslations } from "next-intl";
import { Building2, Network, Settings } from "lucide-react";
import Link from "next/link";

export default function OstHomePage() {
  const t = useTranslations();

  const cards = [
    {
      title: t("organizations.title"),
      description: t("organizations.subtitle"),
      href: "/ost/organizations",
      icon: Building2,
    },
    {
      title: t("tree.title"),
      description: t("tree.subtitle"),
      href: "/ost/organizations",
      icon: Network,
    },
    {
      title: t("orgUnitTypes.title"),
      description: t("orgUnitTypes.subtitle"),
      href: "/ost/settings/orgunit-types",
      icon: Settings,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">OST Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Organization Structure Tool - Manage your organizational hierarchy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block p-6 bg-card rounded-lg border hover:border-primary transition-colors"
          >
            <card.icon className="h-10 w-10 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-muted-foreground">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
