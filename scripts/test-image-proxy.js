// scripts/test-image-proxy.js
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

async function testImageProxy() {
  try {
    console.log('🔍 Тестируем прокси-эндпоинт изображений...');
    
    // Тестируем с ключом S3
    const testKey = 'cars/cme96cooj0001uj2k2av61e3v/merc3_1755041760163_y0nzta.jpg';
    
    console.log('📸 Тестируем ключ:', testKey);
    
    const response = await makeRequest(`http://localhost:3001/api/images/get?key=${encodeURIComponent(testKey)}`, {
      method: 'GET'
    });
    
    console.log('📥 Ответ:', response.status, response.statusText);
    console.log('📄 Content-Type:', response.headers['content-type']);
    console.log('📄 Content-Length:', response.headers['content-length']);
    
    if (response.status === 200) {
      console.log('✅ Изображение успешно получено через прокси!');
      console.log('📄 Размер ответа:', response.body.length, 'байт');
    } else {
      console.log('❌ Ошибка получения изображения');
      console.log('📄 Тело ответа:', response.body);
    }
    
  } catch (error) {
    console.error('💥 Ошибка теста:', error.message);
  }
}

// Запускаем тест
testImageProxy();
