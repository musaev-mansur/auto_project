'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useLocale } from '@/contexts/locale-context'
import { 
  Car, 
  Wrench, 
  Shield, 
  Users, 
  Award, 
  Clock,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

export default function AboutPage() {
  const { t } = useLocale()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* О компании */}
          <Card className="mb-12">
            <CardHeader>
                          <CardTitle className="text-3xl text-center mb-4">
              {t('about.whoWeAre.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg leading-relaxed">
            <p className="mb-6">
              {t('about.whoWeAre.description1')}
            </p>
            <p className="mb-6">
              {t('about.whoWeAre.description2')}
            </p>
            </CardContent>
          </Card>

          {/* Наши услуги */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Car className="w-8 h-8 mr-3 text-blue-600" />
                  {t('about.services.usedCars.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('about.services.usedCars.check1')}
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('about.services.usedCars.check2')}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Wrench className="w-8 h-8 mr-3 text-blue-600" />
                  {t('about.services.parts.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('about.services.parts.check1')}
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('about.services.parts.check2')}
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {t('about.services.parts.check4')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Контакты */}
          <Card>
            <CardHeader>
                          <CardTitle className="text-3xl text-center mb-8">
              {t('about.contacts.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('about.contacts.info.title')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                    <span>{t('about.contacts.address')}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-blue-600" />
                    <span>{t('about.contacts.phone')}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-blue-600" />
                    <span>{t('about.contacts.email')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-blue-600" />
                    <span>{t('about.contacts.workingHours')}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">{t('about.contacts.services.title')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{t('about.contacts.services.cars')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{t('about.contacts.services.parts')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{t('about.contacts.services.consultation')}</span>
                  </div>
                </div>
              </div>
            </div>
            </CardContent>
                     </Card>
         </div>
       </div>
       
       <Footer />
     </div>
   )
 }
