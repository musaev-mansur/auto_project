# Тестирование API для создания автомобиля

Write-Host "Тестирование API создания автомобиля..." -ForegroundColor Green

# Тест получения автомобилей
Write-Host "`n1. Получение существующих автомобилей..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/cars" -Method GET
    Write-Host "Найдено автомобилей: $($response.cars.Count)" -ForegroundColor Green
    foreach ($car in $response.cars) {
        Write-Host "  - $($car.brand) $($car.model) ($($car.year))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Ошибка при получении автомобилей: $($_.Exception.Message)" -ForegroundColor Red
}

# Тест создания нового автомобиля
Write-Host "`n2. Создание нового автомобиля..." -ForegroundColor Yellow

$newCar = @{
    brand = "Toyota"
    model = "Camry"
    year = 2021
    mileage = 30000
    transmission = "automatic"
    fuel = "petrol"
    drive = "front"
    bodyType = "sedan"
    color = "Серебристый"
    power = 200
    engineVolume = 2.5
    euroStandard = "Euro 6"
    vin = "TEST$(Get-Date -Format 'yyyyMMddHHmmss')"
    condition = "excellent"
    customs = $true
    vat = $true
    owners = 1
    price = 35000
    currency = "EUR"
    negotiable = $true
    city = "Москва"
    description = "Отличное состояние, полная комплектация"
}

try {
    $jsonBody = $newCar | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/cars" -Method POST -Body $jsonBody -ContentType "application/json"
    Write-Host "Автомобиль успешно создан: $($response.car.brand) $($response.car.model)" -ForegroundColor Green
    Write-Host "ID: $($response.car.id)" -ForegroundColor Cyan
} catch {
    Write-Host "Ошибка при создании автомобиля: $($_.Exception.Message)" -ForegroundColor Red
}

# Тест получения обновленного списка
Write-Host "`n3. Получение обновленного списка автомобилей..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/cars" -Method GET
    Write-Host "Теперь найдено автомобилей: $($response.cars.Count)" -ForegroundColor Green
} catch {
    Write-Host "Ошибка при получении обновленного списка: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nТестирование завершено!" -ForegroundColor Green
