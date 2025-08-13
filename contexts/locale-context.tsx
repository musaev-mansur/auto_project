'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Locale = 'ru' | 'en' | 'nl' | 'fr'

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
  },
  nl: {
    // Header
    'nav.cars': 'Auto\'s',
    'nav.parts': 'Onderdelen',
    'nav.dealer': 'Handelaar',
    'nav.login': 'Inloggen',
    
    // Home page
    'home.hero.title': 'Auto\'s en Onderdelen',
    'home.hero.subtitle': 'Kwaliteitsauto\'s en originele onderdelen tegen de beste prijzen',
    'home.hero.viewCars': 'Auto\'s Bekijken',
    'home.hero.partsCatalog': 'Onderdelen Catalogus',
    'home.newArrivals': 'Nieuwe Aankomsten',
    'home.refresh': 'Vernieuwen',
    'home.viewAll': 'Alles Bekijken',
    'home.loading': 'Auto\'s laden...',
    'home.noCars': 'Geen auto\'s gevonden',
    'home.tryAgain': 'Opnieuw Proberen',
    
    // Filters
    'filters.title': 'Filters',
    'filters.brand': 'Merk',
    'filters.brandPlaceholder': 'Voer merk in',
    'filters.price': 'Prijs, EUR',
    'filters.mileage': 'Kilometerstand, km',
    'filters.year': 'Jaar',
    'filters.from': 'Van',
    'filters.to': 'Tot',
    'filters.reset': 'Filters Resetten',
    
    // Cars page
    'cars.title': 'Auto Catalogus',
    'cars.found': 'Gevonden',
    'cars.cars': 'auto\'s',
    'cars.sortBy': 'Sorteren op',
    'cars.sort.newest': 'Nieuwste eerst',
    'cars.sort.oldest': 'Oudste eerst',
    'cars.sort.priceAsc': 'Prijs: laag naar hoog',
    'cars.sort.priceDesc': 'Prijs: hoog naar laag',
    'cars.sort.mileageAsc': 'Kilometerstand: laag naar hoog',
    'cars.sort.mileageDesc': 'Kilometerstand: hoog naar laag',
    'cars.loading': 'Auto\'s laden...',
    'cars.noCars': 'Geen auto\'s gevonden',
    'cars.tryAgain': 'Opnieuw Proberen',
    'cars.showMore': 'Meer Tonen',
    'cars.backToCatalog': 'Terug naar Catalogus',
    
    // Car card
    'car.year': 'jaar',
    'car.km': 'km',
    'car.hp': 'pk',
    'car.views': 'weergaven',
    'car.negotiable': 'Onderhandelbaar',
    'car.details': 'Details',
    'car.call': 'Bellen',
    'car.whatsapp': 'WhatsApp',
    'car.askQuestion': 'Vraag Stellen',
    'car.scheduleViewing': 'Bezichtiging Plannen',
    
    // Car detail page
    'carDetail.backToList': 'Terug naar Lijst',
    'carDetail.characteristics': 'Kenmerken',
    'carDetail.power': 'Vermogen',
    'carDetail.engineVolume': 'Motorinhoud',
    'carDetail.drive': 'Aandrijving',
    'carDetail.bodyType': 'Carrosserie',
    'carDetail.color': 'Kleur',
    'carDetail.euroStandard': 'Euro Norm',
    'carDetail.vin': 'VIN',
    'carDetail.owners': 'Aantal Eigenaren',
    'carDetail.customs': 'Douane Vrij',
    'carDetail.vat': 'BTW',
    'carDetail.condition': 'Conditie',
    'carDetail.description': 'Beschrijving',
    'carDetail.photos': 'Foto\'s',
    'carDetail.mainPhoto': 'Hoofd',
    'carDetail.yes': 'Ja',
    'carDetail.no': 'Nee',
  },
  fr: {
    // Header
    'nav.cars': 'Voitures',
    'nav.parts': 'Pièces',
    'nav.dealer': 'Concessionnaire',
    'nav.login': 'Connexion',
    
    // Home page
    'home.hero.title': 'Voitures et Pièces',
    'home.hero.subtitle': 'Voitures de qualité et pièces originales aux meilleurs prix',
    'home.hero.viewCars': 'Voir les Voitures',
    'home.hero.partsCatalog': 'Catalogue de Pièces',
    'home.newArrivals': 'Nouvelles Arrivées',
    'home.refresh': 'Actualiser',
    'home.viewAll': 'Voir Tout',
    'home.loading': 'Chargement des voitures...',
    'home.noCars': 'Aucune voiture trouvée',
    'home.tryAgain': 'Réessayer',
    
    // Filters
    'filters.title': 'Filtres',
    'filters.brand': 'Marque',
    'filters.brandPlaceholder': 'Entrez la marque',
    'filters.price': 'Prix, EUR',
    'filters.mileage': 'Kilométrage, km',
    'filters.year': 'Année',
    'filters.from': 'De',
    'filters.to': 'À',
    'filters.reset': 'Réinitialiser les Filtres',
    
    // Cars page
    'cars.title': 'Catalogue de Voitures',
    'cars.found': 'Trouvé',
    'cars.cars': 'voitures',
    'cars.sortBy': 'Trier par',
    'cars.sort.newest': 'Plus récent d\'abord',
    'cars.sort.oldest': 'Plus ancien d\'abord',
    'cars.sort.priceAsc': 'Prix: croissant',
    'cars.sort.priceDesc': 'Prix: décroissant',
    'cars.sort.mileageAsc': 'Kilométrage: croissant',
    'cars.sort.mileageDesc': 'Kilométrage: décroissant',
    'cars.loading': 'Chargement des voitures...',
    'cars.noCars': 'Aucune voiture trouvée',
    'cars.tryAgain': 'Réessayer',
    'cars.showMore': 'Afficher Plus',
    'cars.backToCatalog': 'Retour au Catalogue',
    
    // Car card
    'car.year': 'année',
    'car.km': 'km',
    'car.hp': 'ch',
    'car.views': 'vues',
    'car.negotiable': 'Négociable',
    'car.details': 'Détails',
    'car.call': 'Appeler',
    'car.whatsapp': 'WhatsApp',
    'car.askQuestion': 'Poser une Question',
    'car.scheduleViewing': 'Planifier une Visite',
    
    // Car detail page
    'carDetail.backToList': 'Retour à la Liste',
    'carDetail.characteristics': 'Caractéristiques',
    'carDetail.power': 'Puissance',
    'carDetail.engineVolume': 'Cylindrée',
    'carDetail.drive': 'Transmission',
    'carDetail.bodyType': 'Type de Carrosserie',
    'carDetail.color': 'Couleur',
    'carDetail.euroStandard': 'Norme Euro',
    'carDetail.vin': 'VIN',
    'carDetail.owners': 'Nombre de Propriétaires',
    'carDetail.customs': 'Dédouané',
    'carDetail.vat': 'TVA',
    'carDetail.condition': 'État',
    'carDetail.description': 'Description',
    'carDetail.photos': 'Photos',
    'carDetail.mainPhoto': 'Principal',
    'carDetail.yes': 'Oui',
    'carDetail.no': 'Non',
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
