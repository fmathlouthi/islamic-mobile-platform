'use client';

import { useTranslations } from 'next-intl';
import { Clock, BookOpen, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  const t = useTranslations('Index.features');

  const features = [
    {
      icon: <Clock className="w-8 h-8 text-primary-600" />,
      title: t('prayer.title'),
      desc: t('prayer.desc'),
    },
    {
      icon: <BookOpen className="w-8 h-8 text-gold-600" />,
      title: t('quran.title'),
      desc: t('quran.desc'),
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: t('athkar.title'),
      desc: t('athkar.desc'),
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">{t('title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-gray-50 hover:bg-primary-50 transition-colors group border border-transparent hover:border-primary-100"
            >
              <div className="mb-6 inline-block p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
