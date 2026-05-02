'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('Index');
  const locale = useLocale();
  const pathname = usePathname();

  const languages = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
  ];

  const redirectedPathname = (newLocale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    return segments.join('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href={`/${locale}`} className="text-2xl font-bold text-primary-600 font-arabic">
              طريق إلى الجنة
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 hover:text-primary-600 transition-colors">
                <Globe size={20} />
                <span className="uppercase text-sm font-medium">{locale}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                {languages.map((lang) => (
                  <Link
                    key={lang.code}
                    href={redirectedPathname(lang.code)}
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 ${
                      locale === lang.code ? 'bg-primary-50 text-primary-600' : ''
                    }`}
                  >
                    {lang.label}
                  </Link>
                ))}
              </div>
            </div>
            
            <button className="hidden sm:block bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors">
              {t('hero.cta')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
