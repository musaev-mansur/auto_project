'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Car, Phone, MessageCircle, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

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
            <Link href="/#" className="text-gray-700 hover:text-blue-600">
              Запчасти
            </Link>
            <Link href="/#" className="text-gray-700 hover:text-blue-600">
              Контакты
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <a href="tel:+32487250651">
                <Phone className="h-4 w-4 mr-2" />
                +32 487 25-06-51
              </a>
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              <Link href="https://wa.me/+32487250651">WhatsApp</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden flex flex-col gap-4 pb-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Главная
            </Link>
            <Link href="/cars" className="text-gray-700 hover:text-blue-600">
              Автомобили
            </Link>
            <Link href="/#" className="text-gray-700 hover:text-blue-600">
              Запчасти
            </Link>
            <Link href="/#" className="text-gray-700 hover:text-blue-600">
              Контакты
            </Link>
            <Button variant="outline" size="sm" className="justify-start">
              <Phone className="h-4 w-4 mr-2" />
              +32 487 25-06-51
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              <Link href="https://wa.me/+32487250651">WhatsApp</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
