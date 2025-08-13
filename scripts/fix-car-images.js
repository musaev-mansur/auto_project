// scripts/fix-car-images.js
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

async function fixCarImages() {
  try {
    console.log('🔧 Исправляем изображения для нового автомобиля...');
    
    const carId = 'cmeagzy6x0001ujisgylepk0c';
    
    // 1. Получаем данные автомобиля
    console.log('📋 Получаем данные автомобиля...');
    const carResponse = await makeRequest(`http://localhost:3001/api/cars/${carId}`, {
      method: 'GET'
    });
    
    if (carResponse.status !== 200) {
      console.log('❌ Не удалось получить данные автомобиля');
      return;
    }
    
    const carData = JSON.parse(carResponse.body);
    console.log('🚗 Автомобиль:', carData.brand, carData.model);
    
    // 2. Парсим изображения
    let images = [];
    try {
      images = typeof carData.photos === 'string' ? JSON.parse(carData.photos) : carData.photos;
      console.log('📸 Текущие изображения:', images);
    } catch (e) {
      console.log('❌ Ошибка парсинга изображений:', carData.photos);
      return;
    }
    
    // 3. Фильтруем временные изображения
    const tempImages = images.filter(img => img.includes('/temp_'));
    console.log('🔄 Временные изображения для коммита:', tempImages);
    
    if (tempImages.length === 0) {
      console.log('✅ Нет временных изображений для коммита');
      return;
    }
    
    // 4. Коммитим изображения
    console.log('🔄 Коммитим изображения...');
    const commitResponse = await makeRequest('http://localhost:3001/api/images/commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, JSON.stringify({ 
      carId: carId, 
      images: tempImages 
    }));
    
    console.log('📥 Ответ коммита:', commitResponse.status, commitResponse.statusText);
    console.log('📄 Тело ответа коммита:', commitResponse.body);
    
    if (commitResponse.status !== 200) {
      console.log('❌ Ошибка коммита изображений');
      return;
    }
    
    const commitData = JSON.parse(commitResponse.body);
    if (!commitData.success) {
      console.log('❌ Коммит не удался:', commitData.error);
      return;
    }
    
    console.log('✅ Изображения скоммичены!');
    console.log('🖼️ Новые URL:', commitData.images);
    
    // 5. Обновляем автомобиль с постоянными изображениями
    console.log('📝 Обновляем автомобиль с постоянными изображениями...');
    
    // Заменяем временные URL на постоянные
    const permanentImages = images.map(img => {
      if (img.includes('/temp_')) {
        const tempKey = img.split('/').pop()?.split('?')[0];
        const permanentImg = commitData.images.find((permImg) => permImg.includes(tempKey || '')) || img;
        console.log('🔄 Заменяем:', img, 'на:', permanentImg);
        return permanentImg;
      }
      return img;
    });
    
    console.log('🖼️ Финальные изображения:', permanentImages);
    
    const updateResponse = await makeRequest(`http://localhost:3001/api/cars/${carId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    }, JSON.stringify({ photos: permanentImages }));
    
    console.log('📥 Ответ обновления:', updateResponse.status, updateResponse.statusText);
    
    if (updateResponse.status === 200) {
      console.log('✅ Автомобиль успешно обновлен!');
      const updateData = JSON.parse(updateResponse.body);
      console.log('🖼️ Обновленные изображения:', updateData.car.photos);
    } else {
      console.log('❌ Ошибка обновления:', updateResponse.body);
    }
    
  } catch (error) {
    console.error('💥 Ошибка исправления:', error.message);
  }
}

// Запускаем исправление
fixCarImages();
