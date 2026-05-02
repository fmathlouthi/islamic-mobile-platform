'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function DialectAI() {
  const t = useTranslations('Index.ai');

  const chats = [
    { text: t('maghrebi'), sender: 'user', align: 'left' },
    { text: t('egyptian'), sender: 'user', align: 'right' },
    { text: t('gulf'), sender: 'user', align: 'left' },
  ];

  return (
    <section className="py-24 bg-primary-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-800/30 -skew-x-12 translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-800 text-primary-200 mb-6 border border-primary-700">
              <Sparkles size={16} />
              <span className="text-sm font-semibold uppercase tracking-wider">الذكاء الاصطناعي</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {t('title')}
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              {t('subtitle')}
            </p>
            <p className="text-primary-200/80 leading-relaxed max-w-lg">
              {t('desc')}
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-primary-800/50 backdrop-blur-xl border border-primary-700 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-col gap-4">
                {chats.map((chat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: chat.align === 'left' ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className={`flex ${chat.align === 'left' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      chat.align === 'left' 
                      ? 'bg-primary-700 text-white rounded-bl-none' 
                      : 'bg-gold-600 text-white rounded-br-none'
                    }`}>
                      <p className="text-sm md:text-base font-medium">{chat.text}</p>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 flex items-center gap-3 text-primary-200 bg-primary-900/50 p-4 rounded-2xl border border-primary-700/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center animate-pulse">
                    <MessageSquare size={16} />
                  </div>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></span>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary-400/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
