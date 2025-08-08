# Обновление статуса автомобилей на published

Write-Host "Обновление статуса автомобилей..." -ForegroundColor Green

# Получаем список автомобилей
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/cars" -Method GET
    Write-Host "Найдено автомобилей: $($response.cars.Count)" -ForegroundColor Yellow
    
    foreach ($car in $response.cars) {
        Write-Host "  - $($car.brand) $($car.model) (статус: $($car.status))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Ошибка при получении автомобилей: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nОбновление статуса на 'published'..." -ForegroundColor Yellow

# Обновляем статус каждого автомобиля на published
foreach ($car in $response.cars) {
    try {
        $updateData = @{
            status = "published"
        }
        
        $jsonBody = $updateData | ConvertTo-Json
        $updateResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/cars/$($car.id)" -Method PUT -Body $jsonBody -ContentType "application/json"
        
        Write-Host "✓ $($car.brand) $($car.model) - статус обновлен" -ForegroundColor Green
    } catch {
        Write-Host "✗ Ошибка при обновлении $($car.brand) $($car.model): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nОбновление завершено!" -ForegroundColor Green
