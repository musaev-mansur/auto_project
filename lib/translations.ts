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
      poor: 'Плохое'
    },
    en: {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor'
    },
    nl: {
      excellent: 'Uitstekend',
      good: 'Goed',
      fair: 'Redelijk',
      poor: 'Slecht'
    },
    fr: {
      excellent: 'Excellent',
      good: 'Bon',
      fair: 'Moyen',
      poor: 'Mauvais'
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
