import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { locales, type Locale } from './i18n/config';

export { locales, defaultLocale, type Locale } from './i18n/config';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./i18n/messages/${locale}.json`)).default,
  };
});
