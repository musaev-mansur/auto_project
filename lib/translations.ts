// Функции перевода автомобильных характеристик

type Locale = 'ru' | 'en' | 'nl' | 'fr'

export const getFuelText = (fuel: string, locale: Locale = 'ru') => {
  const fuelMaps = {
    ru: {
      petrol: 'Бензин',
      diesel: 'Дизель',
      hybrid: 'Гибрид',
      electric: 'Электро',
      gas: 'Газ'
    },
    en: {
      petrol: 'Petrol',
      diesel: 'Diesel',
      hybrid: 'Hybrid',
      electric: 'Electric',
      gas: 'Gas'
    },
    nl: {
      petrol: 'Benzine',
      diesel: 'Diesel',
      hybrid: 'Hybride',
      electric: 'Elektrisch',
      gas: 'Gas'
    },
    fr: {
      petrol: 'Essence',
      diesel: 'Diesel',
      hybrid: 'Hybride',
      electric: 'Électrique',
      gas: 'GPL'
    }
  }
  return fuelMaps[locale][fuel as keyof typeof fuelMaps.ru] || fuel
}

export const getTransmissionText = (transmission: string, locale: Locale = 'ru') => {
  const transmissionMaps = {
    ru: {
      automatic: 'Автомат',
      manual: 'Механика',
      robot: 'Робот',
      variator: 'Вариатор'
    },
    en: {
      automatic: 'Automatic',
      manual: 'Manual',
      robot: 'Robot',
      variator: 'CVT'
    },
    nl: {
      automatic: 'Automaat',
      manual: 'Handgeschakeld',
      robot: 'Robot',
      variator: 'CVT'
    },
    fr: {
      automatic: 'Automatique',
      manual: 'Manuelle',
      robot: 'Robot',
      variator: 'CVT'
    }
  }
  return transmissionMaps[locale][transmission as keyof typeof transmissionMaps.ru] || transmission
}

export const getDriveText = (drive: string, locale: Locale = 'ru') => {
  const driveMaps = {
    ru: {
      front: 'Передний',
      rear: 'Задний',
      all: 'Полный',
      '4wd': 'Полный'
    },
    en: {
      front: 'Front',
      rear: 'Rear',
      all: 'All-wheel',
      '4wd': 'All-wheel'
    },
    nl: {
      front: 'Voorwiel',
      rear: 'Achterwiel',
      all: 'Vierwiel',
      '4wd': 'Vierwiel'
    },
    fr: {
      front: 'Avant',
      rear: 'Arrière',
      all: 'Intégral',
      '4wd': 'Intégral'
    }
  }
  return driveMaps[locale][drive as keyof typeof driveMaps.ru] || drive
}

export const getBodyTypeText = (bodyType: string, locale: Locale = 'ru') => {
  const bodyTypeMaps = {
    ru: {
      sedan: 'Седан',
      hatchback: 'Хэтчбек',
      wagon: 'Универсал',
      suv: 'Внедорожник',
      coupe: 'Купе',
      convertible: 'Кабриолет',
      minivan: 'Минивэн',
      pickup: 'Пикап'
    },
    en: {
      sedan: 'Sedan',
      hatchback: 'Hatchback',
      wagon: 'Wagon',
      suv: 'SUV',
      coupe: 'Coupe',
      convertible: 'Convertible',
      minivan: 'Minivan',
      pickup: 'Pickup'
    },
    nl: {
      sedan: 'Sedan',
      hatchback: 'Hatchback',
      wagon: 'Stationwagen',
      suv: 'SUV',
      coupe: 'Coupé',
      convertible: 'Cabriolet',
      minivan: 'Minivan',
      pickup: 'Pick-up'
    },
    fr: {
      sedan: 'Berline',
      hatchback: 'Hayon',
      wagon: 'Break',
      suv: 'SUV',
      coupe: 'Coupé',
      convertible: 'Cabriolet',
      minivan: 'Minibus',
      pickup: 'Pick-up'
    }
  }
  return bodyTypeMaps[locale][bodyType as keyof typeof bodyTypeMaps.ru] || bodyType
}

export const getConditionText = (condition: string, locale: Locale = 'ru') => {
  const conditionMaps = {
    ru: {
      excellent: 'Отличное',
      good: 'Хорошее',
      fair: 'Удовлетворительное',
      poor: 'Плохое',
      new: 'Новое',
      used: 'Б/у',
      refurbished: 'Восстановленное'
    },
    en: {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor',
      new: 'New',
      used: 'Used',
      refurbished: 'Refurbished'
    },
    nl: {
      excellent: 'Uitstekend',
      good: 'Goed',
      fair: 'Redelijk',
      poor: 'Slecht',
      new: 'Nieuw',
      used: 'Gebruikt',
      refurbished: 'Gerenoveerd'
    },
    fr: {
      excellent: 'Excellent',
      good: 'Bon',
      fair: 'Moyen',
      poor: 'Mauvais',
      new: 'Neuf',
      used: 'Occasion',
      refurbished: 'Remis à neuf'
    }
  }
  return conditionMaps[locale][condition as keyof typeof conditionMaps.ru] || condition
}

export const getStatusText = (status: string, locale: Locale = 'ru') => {
  const statusMaps = {
    ru: {
      draft: 'Черновик',
      published: 'Опубликовано',
      sold: 'Продано',
      reserved: 'Забронировано'
    },
    en: {
      draft: 'Draft',
      published: 'Published',
      sold: 'Sold',
      reserved: 'Reserved'
    },
    nl: {
      draft: 'Concept',
      published: 'Gepubliceerd',
      sold: 'Verkocht',
      reserved: 'Gereserveerd'
    },
    fr: {
      draft: 'Brouillon',
      published: 'Publié',
      sold: 'Vendu',
      reserved: 'Réservé'
    }
  }
  return statusMaps[locale][status as keyof typeof statusMaps.ru] || status
}

export const getCategoryText = (category: string, locale: Locale = 'ru') => {
  const categoryMaps = {
    ru: {
      engine: 'Двигатель',
      transmission: 'Трансмиссия',
      brakes: 'Тормоза',
      suspension: 'Подвеска',
      electrical: 'Электрика',
      body: 'Кузов',
      interior: 'Салон',
      exterior: 'Внешний вид',
      wheels: 'Колеса',
      tires: 'Шины',
      other: 'Другое'
    },
    en: {
      engine: 'Engine',
      transmission: 'Transmission',
      brakes: 'Brakes',
      suspension: 'Suspension',
      electrical: 'Electrical',
      body: 'Body',
      interior: 'Interior',
      exterior: 'Exterior',
      wheels: 'Wheels',
      tires: 'Tires',
      other: 'Other'
    },
    nl: {
      engine: 'Motor',
      transmission: 'Transmissie',
      brakes: 'Remmen',
      suspension: 'Ophanging',
      electrical: 'Elektrisch',
      body: 'Carrosserie',
      interior: 'Interieur',
      exterior: 'Exterieur',
      wheels: 'Wielen',
      tires: 'Banden',
      other: 'Andere'
    },
    fr: {
      engine: 'Moteur',
      transmission: 'Transmission',
      brakes: 'Freins',
      suspension: 'Suspension',
      electrical: 'Électrique',
      body: 'Carrosserie',
      interior: 'Intérieur',
      exterior: 'Extérieur',
      wheels: 'Roues',
      tires: 'Pneus',
      other: 'Autre'
    }
  }
  return categoryMaps[locale][category as keyof typeof categoryMaps.ru] || category
}

// Общие переводы для интерфейса
export const getUIText = (key: string, locale: Locale = 'ru') => {
  const uiMaps = {
    ru: {
      // Навигация
      back: 'Назад',
      next: 'Далее',
      save: 'Сохранить',
      edit: 'Редактировать',
      delete: 'Удалить',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      publish: 'Опубликовать',
      draft: 'Черновик',
      
      // Формы
      name: 'Название',
      brand: 'Марка',
      model: 'Модель',
      year: 'Год',
      price: 'Цена',
      currency: 'Валюта',
      city: 'Город',
      description: 'Описание',
      category: 'Категория',
      condition: 'Состояние',
      negotiablePrice: 'Цена договорная',
      
      // Шаги
      step1: 'Основная информация',
      step2: 'Медиа',
      step3: 'Цена и публикация',
      step1Desc: 'Название, марка, модель, категория',
      step2Desc: 'Загрузка фотографий',
      step3Desc: 'Цена, описание, статус',
      
      // Сообщения
      loading: 'Загрузка...',
      saving: 'Сохранение...',
      error: 'Ошибка',
      success: 'Успешно',
      notFound: 'Не найдено',
      
      // Запчасти
      partName: 'Название запчасти',
      partNamePlaceholder: 'Например: Двигатель BMW N54',
      carBrand: 'Марка автомобиля',
      carBrandPlaceholder: 'Например: BMW',
      carModel: 'Модель автомобиля',
      carModelPlaceholder: 'Например: 335i',
      yearFrom: 'Год от',
      yearTo: 'Год до',
      selectCategory: 'Выберите категорию',
      selectCondition: 'Выберите состояние',
      selectCurrency: 'Выберите валюту',
      selectStatus: 'Выберите статус',
      partDescription: 'Описание запчасти',
      partDescriptionPlaceholder: 'Подробное описание запчасти, состояние, комплектация...',
      
      // Действия
      saveDraft: 'Сохранить черновик',
      saveChanges: 'Сохранить изменения',
      publishPart: 'Опубликовать',
      updatePart: 'Обновить',
      addPart: 'Добавить запчасть',
      editPart: 'Редактировать запчасть',
      
      // Хлебные крошки
      home: 'Главная',
      parts: 'Запчасти',
      backToList: 'Вернуться к списку',
      step: 'Шаг',
      of: 'из',
      
      // Детали запчасти
      specifications: 'Характеристики',
      views: 'просмотров',
      negotiable: 'Торг',
      call: 'Позвонить',
      whatsapp: 'Написать в WhatsApp',
      partNotFound: 'Запчасть не найдена',
      partNotExists: 'Запрашиваемая запчасть не существует',
      
      // Поиск и фильтры
      search: 'Поиск запчастей...',
      filters: 'Фильтры',
      allCategories: 'Все категории',
      allConditions: 'Все состояния',
      allBrands: 'Все марки',
      modelPlaceholder: 'Введите модель',
      clearFilters: 'Очистить фильтры',
      noPartsFound: 'Запчасти не найдены',
      noPartsDescription: 'Попробуйте изменить параметры поиска или очистить фильтры',
      previous: 'Предыдущая',
      status: 'Статус'
    },
    en: {
      // Navigation
      back: 'Back',
      next: 'Next',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      confirm: 'Confirm',
      publish: 'Publish',
      draft: 'Draft',
      
      // Forms
      name: 'Name',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      price: 'Price',
      currency: 'Currency',
      city: 'City',
      description: 'Description',
      category: 'Category',
      condition: 'Condition',
      negotiablePrice: 'Negotiable price',
      
      // Steps
      step1: 'Basic Information',
      step2: 'Media',
      step3: 'Price and Publication',
      step1Desc: 'Name, brand, model, category',
      step2Desc: 'Photo upload',
      step3Desc: 'Price, description, status',
      
      // Messages
      loading: 'Loading...',
      saving: 'Saving...',
      error: 'Error',
      success: 'Success',
      notFound: 'Not found',
      
      // Parts
      partName: 'Part name',
      partNamePlaceholder: 'e.g. BMW N54 Engine',
      carBrand: 'Car brand',
      carBrandPlaceholder: 'e.g. BMW',
      carModel: 'Car model',
      carModelPlaceholder: 'e.g. 335i',
      yearFrom: 'Year from',
      yearTo: 'Year to',
      selectCategory: 'Select category',
      selectCondition: 'Select condition',
      selectCurrency: 'Select currency',
      selectStatus: 'Select status',
      partDescription: 'Part description',
      partDescriptionPlaceholder: 'Detailed description of the part, condition, completeness...',
      
      // Actions
      saveDraft: 'Save draft',
      saveChanges: 'Save changes',
      publishPart: 'Publish',
      updatePart: 'Update',
      addPart: 'Add part',
      editPart: 'Edit part',
      
      // Breadcrumbs
      home: 'Home',
      parts: 'Parts',
      backToList: 'Back to list',
      step: 'Step',
      of: 'of',
      
      // Part details
      specifications: 'Specifications',
      views: 'views',
      negotiable: 'Negotiable',
      call: 'Call',
      whatsapp: 'WhatsApp',
      partNotFound: 'Part not found',
      partNotExists: 'The requested part does not exist',
      
      // Search and filters
      search: 'Search parts...',
      filters: 'Filters',
      allCategories: 'All categories',
      allConditions: 'All conditions',
      allBrands: 'All brands',
      modelPlaceholder: 'Enter model',
      clearFilters: 'Clear filters',
      noPartsFound: 'No parts found',
      noPartsDescription: 'Try changing search parameters or clearing filters',
      previous: 'Previous',
      status: 'Status'
    },
    nl: {
      // Navigatie
      back: 'Terug',
      next: 'Volgende',
      save: 'Opslaan',
      edit: 'Bewerken',
      delete: 'Verwijderen',
      cancel: 'Annuleren',
      confirm: 'Bevestigen',
      publish: 'Publiceren',
      draft: 'Concept',
      
      // Formulieren
      name: 'Naam',
      brand: 'Merk',
      model: 'Model',
      year: 'Jaar',
      price: 'Prijs',
      currency: 'Valuta',
      city: 'Stad',
      description: 'Beschrijving',
      category: 'Categorie',
      condition: 'Conditie',
      negotiablePrice: 'Onderhandelbare prijs',
      
      // Stappen
      step1: 'Basisinformatie',
      step2: 'Media',
      step3: 'Prijs en publicatie',
      step1Desc: 'Naam, merk, model, categorie',
      step2Desc: 'Foto upload',
      step3Desc: 'Prijs, beschrijving, status',
      
      // Berichten
      loading: 'Laden...',
      saving: 'Opslaan...',
      error: 'Fout',
      success: 'Succes',
      notFound: 'Niet gevonden',
      
      // Onderdelen
      partName: 'Onderdeel naam',
      partNamePlaceholder: 'bijv. BMW N54 Motor',
      carBrand: 'Auto merk',
      carBrandPlaceholder: 'bijv. BMW',
      carModel: 'Auto model',
      carModelPlaceholder: 'bijv. 335i',
      yearFrom: 'Jaar vanaf',
      yearTo: 'Jaar tot',
      selectCategory: 'Selecteer categorie',
      selectCondition: 'Selecteer conditie',
      selectCurrency: 'Selecteer valuta',
      selectStatus: 'Selecteer status',
      partDescription: 'Onderdeel beschrijving',
      partDescriptionPlaceholder: 'Gedetailleerde beschrijving van het onderdeel, conditie, volledigheid...',
      
      // Acties
      saveDraft: 'Concept opslaan',
      saveChanges: 'Wijzigingen opslaan',
      publishPart: 'Publiceren',
      updatePart: 'Bijwerken',
      addPart: 'Onderdeel toevoegen',
      editPart: 'Onderdeel bewerken',
      
      // Breadcrumbs
      home: 'Home',
      parts: 'Onderdelen',
      backToList: 'Terug naar lijst',
      step: 'Stap',
      of: 'van',
      
      // Onderdeel details
      specifications: 'Specificaties',
      views: 'weergaven',
      negotiable: 'Onderhandelbaar',
      call: 'Bellen',
      whatsapp: 'WhatsApp',
      partNotFound: 'Onderdeel niet gevonden',
      partNotExists: 'Het opgevraagde onderdeel bestaat niet',
      
      // Zoeken en filters
      search: 'Zoek onderdelen...',
      filters: 'Filters',
      allCategories: 'Alle categorieën',
      allConditions: 'Alle condities',
      allBrands: 'Alle merken',
      modelPlaceholder: 'Voer model in',
      clearFilters: 'Filters wissen',
      noPartsFound: 'Geen onderdelen gevonden',
      noPartsDescription: 'Probeer zoekparameters te wijzigen of filters te wissen',
      previous: 'Vorige',
      status: 'Status'
    },
    fr: {
      // Navigation
      back: 'Retour',
      next: 'Suivant',
      save: 'Enregistrer',
      edit: 'Modifier',
      delete: 'Supprimer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      publish: 'Publier',
      draft: 'Brouillon',
      
      // Formulaires
      name: 'Nom',
      brand: 'Marque',
      model: 'Modèle',
      year: 'Année',
      price: 'Prix',
      currency: 'Devise',
      city: 'Ville',
      description: 'Description',
      category: 'Catégorie',
      condition: 'État',
      negotiablePrice: 'Prix négociable',
      
      // Étapes
      step1: 'Informations de base',
      step2: 'Médias',
      step3: 'Prix et publication',
      step1Desc: 'Nom, marque, modèle, catégorie',
      step2Desc: 'Téléchargement de photos',
      step3Desc: 'Prix, description, statut',
      
      // Messages
      loading: 'Chargement...',
      saving: 'Enregistrement...',
      error: 'Erreur',
      success: 'Succès',
      notFound: 'Non trouvé',
      
      // Pièces
      partName: 'Nom de la pièce',
      partNamePlaceholder: 'ex: Moteur BMW N54',
      carBrand: 'Marque de voiture',
      carBrandPlaceholder: 'ex: BMW',
      carModel: 'Modèle de voiture',
      carModelPlaceholder: 'ex: 335i',
      yearFrom: 'Année de',
      yearTo: 'Année à',
      selectCategory: 'Sélectionner la catégorie',
      selectCondition: 'Sélectionner l\'état',
      selectCurrency: 'Sélectionner la devise',
      selectStatus: 'Sélectionner le statut',
      partDescription: 'Description de la pièce',
      partDescriptionPlaceholder: 'Description détaillée de la pièce, état, complétude...',
      
      // Actions
      saveDraft: 'Enregistrer brouillon',
      saveChanges: 'Enregistrer modifications',
      publishPart: 'Publier',
      updatePart: 'Mettre à jour',
      addPart: 'Ajouter pièce',
      editPart: 'Modifier pièce',
      
      // Fil d'Ariane
      home: 'Accueil',
      parts: 'Pièces',
      backToList: 'Retour à la liste',
      step: 'Étape',
      of: 'sur',
      
      // Détails pièce
      specifications: 'Spécifications',
      views: 'vues',
      negotiable: 'Négociable',
      call: 'Appeler',
      whatsapp: 'WhatsApp',
      partNotFound: 'Pièce non trouvée',
      partNotExists: 'La pièce demandée n\'existe pas',
      
      // Recherche et filtres
      search: 'Rechercher des pièces...',
      filters: 'Filtres',
      allCategories: 'Toutes les catégories',
      allConditions: 'Tous les états',
      allBrands: 'Toutes les marques',
      modelPlaceholder: 'Entrez le modèle',
      clearFilters: 'Effacer les filtres',
      noPartsFound: 'Aucune pièce trouvée',
      noPartsDescription: 'Essayez de modifier les paramètres de recherche ou d\'effacer les filtres',
      previous: 'Précédent',
      status: 'Statut'
    }
  }
  return uiMaps[locale][key as keyof typeof uiMaps.ru] || key
}
