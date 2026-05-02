'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Index.footer');

  return (
    <footer className="py-12 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-2xl font-bold text-primary-600 font-arabic mb-4">
          طريق إلى الجنة
        </div>
        <p className="text-gray-500 text-sm">
          {t('rights')}
        </p>
      </div>
    </footer>
  );
}
