#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Подготовка к деплою на Render...\n')

// Проверяем наличие необходимых файлов
const requiredFiles = [
  'package.json',
  'prisma/schema.prisma',
  'next.config.mjs',
  'render.yaml',
  'DEPLOYMENT.md'
]

console.log('📋 Проверка необходимых файлов:')
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - ОТСУТСТВУЕТ!`)
  }
})

// Проверяем package.json на наличие нужных скриптов
console.log('\n📦 Проверка скриптов в package.json:')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const requiredScripts = ['build', 'start', 'postinstall']

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`)
  } else {
    console.log(`❌ ${script} - ОТСУТСТВУЕТ!`)
  }
})

// Проверяем Prisma схему
console.log('\n🗄️ Проверка Prisma конфигурации:')
const prismaSchema = fs.readFileSync('prisma/schema.prisma', 'utf8')
if (prismaSchema.includes('provider = "postgresql"')) {
  console.log('✅ База данных: PostgreSQL')
} else if (prismaSchema.includes('provider = "sqlite"')) {
  console.log('⚠️ База данных: SQLite (нужно изменить на PostgreSQL для Render)')
} else {
  console.log('❌ Неопределенный провайдер базы данных')
}

// Проверяем .gitignore
console.log('\n📝 Проверка .gitignore:')
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8')
  const requiredIgnores = ['.env', 'node_modules', '.next', 'dist']
  
  requiredIgnores.forEach(ignore => {
    if (gitignore.includes(ignore)) {
      console.log(`✅ ${ignore}`)
    } else {
      console.log(`⚠️ ${ignore} - рекомендуется добавить`)
    }
  })
} else {
  console.log('⚠️ .gitignore отсутствует')
}

console.log('\n🔧 Рекомендации для деплоя:')
console.log('1. Убедитесь, что код загружен в GitHub репозиторий')
console.log('2. Создайте PostgreSQL базу данных на Render')
console.log('3. Создайте Web Service и укажите переменные окружения')
console.log('4. Следуйте инструкциям в DEPLOYMENT.md')

console.log('\n📚 Полезные ссылки:')
console.log('- Render Dashboard: https://dashboard.render.com')
console.log('- Render Docs: https://render.com/docs')
console.log('- PostgreSQL на Render: https://render.com/docs/databases')

console.log('\n✅ Подготовка завершена! Удачного деплоя! 🚀')
