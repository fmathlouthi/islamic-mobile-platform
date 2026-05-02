'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Hero() {
  const t = useTranslations('Index.hero');

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-50/50 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight"
        >
          {t('title')}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {t('subtitle')}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="bg-primary-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-200">
            {t('cta')}
          </button>
          <button className="bg-white text-primary-600 border-2 border-primary-100 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-primary-200 transition-all">
            شاهد العرض
          </button>
        </motion.div>
      </div>
    </section>
  );
}
