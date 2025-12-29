'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function SettingsPage() {
  const t = useTranslations('settings');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <p className="text-gray-600 mb-8">{t('subtitle')}</p>
      
      <div className="grid gap-4">
        <Link
          href="/ost/settings/orgunit-types"
          className="block p-6 bg-white rounded-lg border hover:border-primary transition-colors"
        >
          <h2 className="text-xl font-semibold">Org Unit Types</h2>
          <p className="text-gray-600">Configure organizational unit types</p>
        </Link>
      </div>
    </div>
  );
}
