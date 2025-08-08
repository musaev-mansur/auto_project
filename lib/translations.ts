// Функции перевода автомобильных характеристик

export const getFuelText = (fuel: string) => {
  const fuelMap: Record<string, string> = {
    petrol: 'Бензин',
    diesel: 'Дизель',
    hybrid: 'Гибрид',
    electric: 'Электро',
    gas: 'Газ'
  }
  return fuelMap[fuel] || fuel
}

export const getTransmissionText = (transmission: string) => {
  const transmissionMap: Record<string, string> = {
    automatic: 'Автомат',
    manual: 'Механика',
    robot: 'Робот',
    variator: 'Вариатор'
  }
  return transmissionMap[transmission] || transmission
}

export const getDriveText = (drive: string) => {
  const driveMap: Record<string, string> = {
    front: 'Передний',
    rear: 'Задний',
    all: 'Полный',
    '4wd': 'Полный'
  }
  return driveMap[drive] || drive
}

export const getBodyTypeText = (bodyType: string) => {
  const bodyTypeMap: Record<string, string> = {
    sedan: 'Седан',
    hatchback: 'Хэтчбек',
    wagon: 'Универсал',
    suv: 'Внедорожник',
    coupe: 'Купе',
    convertible: 'Кабриолет',
    minivan: 'Минивэн',
    pickup: 'Пикап'
  }
  return bodyTypeMap[bodyType] || bodyType
}

export const getConditionText = (condition: string) => {
  const conditionMap: Record<string, string> = {
    excellent: 'Отличное',
    good: 'Хорошее',
    fair: 'Удовлетворительное',
    poor: 'Плохое'
  }
  return conditionMap[condition] || condition
}

export const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: 'Черновик',
    published: 'Опубликовано',
    sold: 'Продано',
    reserved: 'Забронировано'
  }
  return statusMap[status] || status
}
