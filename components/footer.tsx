import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AutoDealer</h3>
            <p className="text-gray-400 text-sm">
              Качественные автомобили и запчасти по лучшим ценам
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Каталог</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/cars" className="hover:text-white">Автомобили</Link></li>
              <li><Link href="/parts" className="hover:text-white">Запчасти</Link></li>
              <li><Link href="/contacts" className="hover:text-white">Контакты</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white">О компании</Link></li>
              <li><Link href="/warranty" className="hover:text-white">Гарантия</Link></li>
              <li><Link href="/delivery" className="hover:text-white">Доставка</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Для дилеров</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/login" className="hover:text-white">Вход в панель</Link></li>
              <li><Link href="/dealer" className="hover:text-white">Админка</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 AutoDealer. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
