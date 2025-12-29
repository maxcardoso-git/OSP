import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'es', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const locale = (localeCookie?.value as Locale) || defaultLocale;

  return {
    locale,
    messages: (await import(`./i18n/messages/${locale}.json`)).default,
  };
});
