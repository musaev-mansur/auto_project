'use client'

import Link from 'next/link'
import { Car, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">AutoDealer</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Главная
            </Link>
            <Link href="/cars" className="text-gray-700 hover:text-blue-600">
              Автомобили
            </Link>
            <Link href="/parts" className="text-gray-700 hover:text-blue-600">
              Запчасти
            </Link>
            <Link href="/contacts" className="text-gray-700 hover:text-blue-600">
              Контакты
            </Link>
            <Link href="/dealer" className="text-gray-700 hover:text-blue-600">
              Админка
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              +375 29 123-45-67
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
