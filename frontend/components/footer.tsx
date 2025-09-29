'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/locale-context'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="bg-gray-900 text-white py-6 sm:py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">azautos.be</h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.catalog')}</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="/cars" className="hover:text-white transition-colors">{t('footer.cars')}</Link></li>
              <li><Link href="/parts" className="hover:text-white transition-colors">{t('footer.parts')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.information')}</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('footer.about')}</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; 2025 azautos.be {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
