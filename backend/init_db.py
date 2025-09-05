#!/usr/bin/env python
"""
Скрипт для инициализации базы данных в Docker контейнере
"""
import os
import sys
import django
import psycopg2
from django.core.management import execute_from_command_line

def create_database():
    """Создает базу данных PostgreSQL если она не существует"""
    try:
        # Парсим DATABASE_URL
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            print("⚠️ DATABASE_URL не найден, пропускаем создание базы данных")
            return
            
        from urllib.parse import urlparse
        url = urlparse(database_url)
        
        # Подключаемся к PostgreSQL без указания базы
        conn = psycopg2.connect(
            host=url.hostname or 'db',
            port=url.port or '5432',
            user=url.username or 'postgres',
            password=url.password or 'password',
            database='postgres'  # Подключаемся к системной базе
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Получаем название базы данных из URL
        db_name = url.path[1:] if url.path else 'carspark'
        
        # Проверяем существует ли база данных
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname='{db_name}'")
        exists = cursor.fetchone()
        
        if not exists:
            print(f"📊 Создание базы данных '{db_name}'...")
            cursor.execute(f"CREATE DATABASE {db_name}")
            print(f"✅ База данных '{db_name}' создана")
        else:
            print(f"ℹ️ База данных '{db_name}' уже существует")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"⚠️ Ошибка при создании базы данных: {e}")

def main():
    # Создание базы данных
    create_database()
    
    # Настройка Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'carspark_backend.settings')
    django.setup()
    
    print("🚀 Инициализация базы данных...")
    
    # Создание миграций
    print("📝 Создание миграций...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    
    # Применение миграций
    print("🔄 Применение миграций...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Создание суперпользователя
    print("👤 Создание суперпользователя...")
    try:
        from cars.models import Admin
        if not Admin.objects.filter(email='admin@carspark.com').exists():
            admin = Admin.objects.create_superuser(
                username='admin',
                email='admin@carspark.com',
                password='admin123',
                first_name='Admin',
                last_name='CarSpark',
                role='admin'
            )
            print(f"✅ Суперпользователь создан: {admin.email}")
        else:
            print("ℹ️ Суперпользователь уже существует")
    except Exception as e:
        print(f"⚠️ Ошибка при создании суперпользователя: {e}")
    
    # # Загрузка тестовых данных
    # print("📊 Загрузка тестовых данных...")
    # try:
    #     execute_from_command_line(['manage.py', 'shell', '-c', 'exec(open("seed_data.py").read())'])
    #     print("✅ Тестовые данные загружены")
    # except Exception as e:
    #     print(f"⚠️ Ошибка при загрузке тестовых данных: {e}")
    
    # print("🎉 Инициализация завершена!")

if __name__ == '__main__':
    main()
