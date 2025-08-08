# Update car status to published

Write-Host "Updating car status..." -ForegroundColor Green

# Get list of cars
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/cars" -Method GET
    Write-Host "Found cars: $($response.cars.Count)" -ForegroundColor Yellow
    
    foreach ($car in $response.cars) {
        Write-Host "  - $($car.brand) $($car.model) (status: $($car.status))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error getting cars: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nUpdating status to 'published'..." -ForegroundColor Yellow

# Update status of each car to published
foreach ($car in $response.cars) {
    try {
        $updateData = @{
            status = "published"
        }
        
        $jsonBody = $updateData | ConvertTo-Json
        $updateResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/cars/$($car.id)" -Method PUT -Body $jsonBody -ContentType "application/json"
        
        Write-Host "✓ $($car.brand) $($car.model) - status updated" -ForegroundColor Green
    } catch {
        Write-Host "✗ Error updating $($car.brand) $($car.model): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nUpdate completed!" -ForegroundColor Green
