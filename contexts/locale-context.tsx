'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Locale = 'ru' | 'en'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

// Переводы
const translations = {
  ru: {
    // Header
    'nav.cars': 'Автомобили',
    'nav.parts': 'Запчасти',
    'nav.dealer': 'Дилер',
    'nav.login': 'Войти',
    
    // Home page
    'home.hero.title': 'Автомобили и запчасти',
    'home.hero.subtitle': 'Качественные автомобили и оригинальные запчасти по лучшим ценам',
    'home.hero.viewCars': 'Смотреть автомобили',
    'home.hero.partsCatalog': 'Каталог запчастей',
    'home.newArrivals': 'Новые поступления',
    'home.refresh': 'Обновить',
    'home.viewAll': 'Смотреть все',
    'home.loading': 'Загрузка автомобилей...',
    'home.noCars': 'Автомобили не найдены',
    'home.tryAgain': 'Попробовать снова',
    
    // Filters
    'filters.title': 'Фильтры',
    'filters.brand': 'Марка',
    'filters.brandPlaceholder': 'Введите марку',
    'filters.price': 'Цена, EUR',
    'filters.mileage': 'Пробег, км',
    'filters.year': 'Год',
    'filters.from': 'От',
    'filters.to': 'До',
    'filters.reset': 'Сбросить фильтры',
    
    // Cars page
    'cars.title': 'Каталог автомобилей',
    'cars.found': 'Найдено',
    'cars.cars': 'автомобилей',
    'cars.sortBy': 'Сортировать по',
    'cars.sort.newest': 'Сначала новые',
    'cars.sort.oldest': 'Сначала старые',
    'cars.sort.priceAsc': 'Цена: по возрастанию',
    'cars.sort.priceDesc': 'Цена: по убыванию',
    'cars.sort.mileageAsc': 'Пробег: по возрастанию',
    'cars.sort.mileageDesc': 'Пробег: по убыванию',
    'cars.loading': 'Загрузка автомобилей...',
    'cars.noCars': 'Автомобили не найдены',
    'cars.tryAgain': 'Попробовать снова',
    'cars.showMore': 'Показать еще',
    'cars.backToCatalog': 'Назад к каталогу',
    
    // Car card
    'car.year': 'год',
    'car.km': 'км',
    'car.hp': 'л.с.',
    'car.views': 'просмотров',
    'car.negotiable': 'Торг',
    'car.details': 'Подробнее',
    'car.call': 'Позвонить',
    'car.whatsapp': 'WhatsApp',
    'car.askQuestion': 'Задать вопрос',
    'car.scheduleViewing': 'Записаться на показ',
    
    // Car detail page
    'carDetail.backToList': 'Назад к списку',
    'carDetail.characteristics': 'Характеристики',
    'carDetail.power': 'Мощность',
    'carDetail.engineVolume': 'Объем двигателя',
    'carDetail.drive': 'Привод',
    'carDetail.bodyType': 'Кузов',
    'carDetail.color': 'Цвет',
    'carDetail.euroStandard': 'Экологический стандарт',
    'carDetail.vin': 'VIN',
    'carDetail.owners': 'Количество владельцев',
    'carDetail.customs': 'Растаможен',
    'carDetail.vat': 'НДС',
    'carDetail.condition': 'Состояние',
    'carDetail.description': 'Описание',
    'carDetail.photos': 'Фотографии',
    'carDetail.mainPhoto': 'Главное',
    'carDetail.yes': 'Да',
    'carDetail.no': 'Нет',
  },
  en: {
    // Header
    'nav.cars': 'Cars',
    'nav.parts': 'Parts',
    'nav.dealer': 'Dealer',
    'nav.login': 'Login',
    
    // Home page
    'home.hero.title': 'Cars and Parts',
    'home.hero.subtitle': 'Quality cars and original parts at the best prices',
    'home.hero.viewCars': 'View Cars',
    'home.hero.partsCatalog': 'Parts Catalog',
    'home.newArrivals': 'New Arrivals',
    'home.refresh': 'Refresh',
    'home.viewAll': 'View All',
    'home.loading': 'Loading cars...',
    'home.noCars': 'No cars found',
    'home.tryAgain': 'Try Again',
    
    // Filters
    'filters.title': 'Filters',
    'filters.brand': 'Brand',
    'filters.brandPlaceholder': 'Enter brand',
    'filters.price': 'Price, EUR',
    'filters.mileage': 'Mileage, km',
    'filters.year': 'Year',
    'filters.from': 'From',
    'filters.to': 'To',
    'filters.reset': 'Reset Filters',
    
    // Cars page
    'cars.title': 'Car Catalog',
    'cars.found': 'Found',
    'cars.cars': 'cars',
    'cars.sortBy': 'Sort by',
    'cars.sort.newest': 'Newest first',
    'cars.sort.oldest': 'Oldest first',
    'cars.sort.priceAsc': 'Price: low to high',
    'cars.sort.priceDesc': 'Price: high to low',
    'cars.sort.mileageAsc': 'Mileage: low to high',
    'cars.sort.mileageDesc': 'Mileage: high to low',
    'cars.loading': 'Loading cars...',
    'cars.noCars': 'No cars found',
    'cars.tryAgain': 'Try Again',
    'cars.showMore': 'Show More',
    'cars.backToCatalog': 'Back to Catalog',
    
    // Car card
    'car.year': 'year',
    'car.km': 'km',
    'car.hp': 'hp',
    'car.views': 'views',
    'car.negotiable': 'Negotiable',
    'car.details': 'Details',
    'car.call': 'Call',
    'car.whatsapp': 'WhatsApp',
    'car.askQuestion': 'Ask Question',
    'car.scheduleViewing': 'Schedule Viewing',
    
    // Car detail page
    'carDetail.backToList': 'Back to List',
    'carDetail.characteristics': 'Characteristics',
    'carDetail.power': 'Power',
    'carDetail.engineVolume': 'Engine Volume',
    'carDetail.drive': 'Drive',
    'carDetail.bodyType': 'Body Type',
    'carDetail.color': 'Color',
    'carDetail.euroStandard': 'Euro Standard',
    'carDetail.vin': 'VIN',
    'carDetail.owners': 'Number of Owners',
    'carDetail.customs': 'Customs Cleared',
    'carDetail.vat': 'VAT',
    'carDetail.condition': 'Condition',
    'carDetail.description': 'Description',
    'carDetail.photos': 'Photos',
    'carDetail.mainPhoto': 'Main',
    'carDetail.yes': 'Yes',
    'carDetail.no': 'No',
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ru')

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations['ru']] || key
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
