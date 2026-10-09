export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';
export const languageCookie = 'app_locale';

export function isLocale(value: unknown): value is Locale {
  return value === 'id' || value === 'en';
}

export function getLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

const id = {
  'nav.home': 'Beranda',
  'nav.dashboard': 'Dasbor',
  'nav.components': 'Komponen Form',
  'nav.website': 'Situs web',
  'nav.language': 'Bahasa',
  'nav.settings': 'Pengaturan',
  'cms.title': 'Konsol Manajemen',
  'cms.welcome': 'Selamat datang, {name}',
  'cms.description': 'Layout CMS terpisah dari situs publik. Session diverifikasi melalui backend Bun.',
  'cms.dynamicForms': 'Komponen Form Dinamis',
  'common.search': 'Cari',
  'common.save': 'Simpan',
  'common.cancel': 'Batal',
  'common.loading': 'Memuat...',
  'common.noResults': 'Tidak ada hasil',
  'common.required': 'Wajib diisi',
  'language.id': 'Indonesia',
  'language.en': 'English',
  'footer.description': 'Skeleton frontend SvelteKit untuk proyek berbasis Bun.',
  'footer.tagline': 'Fondasi sederhana, produk yang menarik.'
} as const;

export type TranslationKey = keyof typeof id;
const en: Record<TranslationKey, string> = {
  'nav.home': 'Home',
  'nav.dashboard': 'Dashboard',
  'nav.components': 'Form Components',
  'nav.website': 'Website',
  'nav.language': 'Language',
  'nav.settings': 'Settings',
  'cms.title': 'Management Console',
  'cms.welcome': 'Welcome, {name}',
  'cms.description': 'The CMS layout is separate from the public site. Sessions are verified through the Bun backend.',
  'cms.dynamicForms': 'Dynamic Form Components',
  'common.search': 'Search',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.loading': 'Loading...',
  'common.noResults': 'No results found',
  'common.required': 'Required',
  'language.id': 'Indonesian',
  'language.en': 'English',
  'footer.description': 'SvelteKit frontend skeleton for Bun-backed projects.',
  'footer.tagline': 'Keep the starter simple. Make the product interesting.'
};

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { id, en };

export function translate(
  locale: Locale,
  key: TranslationKey,
  params: Record<string, string | number> = {}
): string {
  const message = dictionaries[locale][key] ?? dictionaries[defaultLocale][key];
  return message.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : match
  );
}
