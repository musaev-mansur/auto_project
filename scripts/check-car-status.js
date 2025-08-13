// scripts/check-car-status.js
const https = require('https');
const http = require('http');

function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = client.request(requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

async function checkCarStatus() {
  try {
    console.log('🔍 Проверяем статус автомобилей...');
    
    // Получаем все автомобили
    const response = await makeRequest('http://localhost:3001/api/cars?status=published', {
      method: 'GET'
    });
    
    console.log('📥 Ответ:', response.status, response.statusText);
    
    if (response.status === 200) {
      const data = JSON.parse(response.body);
      console.log('📊 Опубликованных автомобилей:', data.cars?.length || 0);
      
      data.cars?.forEach((car, index) => {
        console.log(`🚗 ${index + 1}. ID: ${car.id}`);
        console.log(`   Бренд: ${car.brand} ${car.model}`);
        console.log(`   Статус: ${car.status}`);
        console.log(`   Фото: ${car.photos ? 'Есть' : 'Нет'}`);
        if (car.photos) {
          try {
            const photos = typeof car.photos === 'string' ? JSON.parse(car.photos) : car.photos;
            console.log(`   Количество фото: ${photos.length}`);
            console.log(`   Первое фото: ${photos[0]}`);
          } catch (e) {
            console.log(`   Ошибка парсинга фото: ${car.photos}`);
          }
        }
        console.log('---');
      });
    }
    
  } catch (error) {
    console.error('💥 Ошибка проверки:', error.message);
  }
}

// Запускаем проверку
checkCarStatus();
