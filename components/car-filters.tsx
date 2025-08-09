'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'

interface CarFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function CarFilters({ onFiltersChange }: CarFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    brand: 'all',
    priceFrom: '',
    priceTo: '',
    mileageFrom: '',
    mileageTo: '',
    yearFrom: '',
    yearTo: ''
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const resetFilters = () => {
    const emptyFilters = {
      brand: 'all',
      priceFrom: '',
      priceTo: '',
      mileageFrom: '',
      mileageTo: '',
      yearFrom: '',
      yearTo: ''
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const hasActiveFilters = filters.brand !== 'all' || filters.priceFrom || filters.priceTo || 
    filters.mileageFrom || filters.mileageTo || filters.yearFrom || filters.yearTo

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {/* Мобильная кнопка toggle */}
        <div className="sm:hidden">
          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
              {hasActiveFilters && (
                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {Object.values(filters).filter(v => v && v !== 'all').length}
                </span>
              )}
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Десктопный заголовок */}
        <h3 className="hidden sm:block text-base sm:text-lg font-semibold mb-4">Фильтры</h3>
        
        {/* Контент фильтров - скрытый на мобильных, если не открыт */}
        <div className={`${isOpen ? 'block' : 'hidden'} sm:block mt-4 sm:mt-0`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Марка</label>
            <Input
              placeholder="Введите марку"
              value={filters.brand === 'all' ? '' : filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value || 'all')}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Цена, EUR</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="От"
                value={filters.priceFrom}
                onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="До"
                value={filters.priceTo}
                onChange={(e) => handleFilterChange('priceTo', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Пробег, км</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="От"
                value={filters.mileageFrom}
                onChange={(e) => handleFilterChange('mileageFrom', e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="До"
                value={filters.mileageTo}
                onChange={(e) => handleFilterChange('mileageTo', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Год</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="От"
                value={filters.yearFrom}
                onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="До"
                value={filters.yearTo}
                onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>

          <div className="flex justify-center sm:justify-end mt-4">
            <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
              Сбросить фильтры
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
