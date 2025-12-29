'use client';

import { useTranslations } from 'next-intl';

export default function TreePage() {
  const t = useTranslations('tree');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
      <p className="text-gray-600 mb-8">{t('subtitle')}</p>
      
      <div className="bg-white rounded-lg border p-8 text-center">
        <p className="text-gray-500">Tree view coming soon...</p>
      </div>
    </div>
  );
}
