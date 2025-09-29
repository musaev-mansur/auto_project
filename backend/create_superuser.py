#!/usr/bin/env python
"""
Скрипт для создания суперпользователя admin
"""
import os
import django

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'carspark_backend.settings')
django.setup()

from cars.models import Admin

def create_superuser():
    """Создает суперпользователя admin"""
    try:
        print('Создание суперпользователя...')
        
        email = os.getenv('ADMIN_EMAIL')
        password = os.getenv('ADMIN_PASSWORD')
        first_name = os.getenv('ADMIN_FIRST_NAME')
        last_name = os.getenv('ADMIN_LAST_NAME')
        
        # Проверяем, существует ли уже пользователь
        existing_admin = Admin.objects.filter(email=email).first()
        if existing_admin:
            print('Суперпользователь с таким email уже существует')
            print('Email:', existing_admin.email)
            print('Имя:', existing_admin.get_full_name())
            print('ID:', existing_admin.id)
            return
        
        # Создаем суперпользователя
        admin = Admin.objects.create_superuser(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role='admin'
        )
        
        print('Суперпользователь успешно создан!')
        print('Email:', admin.email)
        print('Имя:', admin.get_full_name())
        print('Пароль:', password)
        print('Роль: Суперпользователь')
        
    except Exception as error:
        print('Ошибка при создании суперпользователя:', error)

if __name__ == '__main__':
    create_superuser()
