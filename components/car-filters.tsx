'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

interface CarFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function CarFilters({ onFiltersChange }: CarFiltersProps) {
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
    const newFilters = { ...filters, [key]: value === 'all' ? '' : value }
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
    onFiltersChange({
      brand: '',
      priceFrom: '',
      priceTo: '',
      mileageFrom: '',
      mileageTo: '',
      yearFrom: '',
      yearTo: ''
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Фильтры</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Марка</label>
            <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите марку" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все марки</SelectItem>
                <SelectItem value="BMW">BMW</SelectItem>
                <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                <SelectItem value="Audi">Audi</SelectItem>
                <SelectItem value="Volkswagen">Volkswagen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Цена, EUR</label>
            <div className="flex space-x-2">
              <Input
                placeholder="От"
                value={filters.priceFrom}
                onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
              />
              <Input
                placeholder="До"
                value={filters.priceTo}
                onChange={(e) => handleFilterChange('priceTo', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Пробег, км</label>
            <div className="flex space-x-2">
              <Input
                placeholder="От"
                value={filters.mileageFrom}
                onChange={(e) => handleFilterChange('mileageFrom', e.target.value)}
              />
              <Input
                placeholder="До"
                value={filters.mileageTo}
                onChange={(e) => handleFilterChange('mileageTo', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Год</label>
            <div className="flex space-x-2">
              <Input
                placeholder="От"
                value={filters.yearFrom}
                onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
              />
              <Input
                placeholder="До"
                value={filters.yearTo}
                onChange={(e) => handleFilterChange('yearTo', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={resetFilters}>
            Сбросить фильтры
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
