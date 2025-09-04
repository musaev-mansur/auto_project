from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
import json


class Admin(AbstractUser):
    """Модель администратора для управления автомобилями и запчастями"""
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, default='admin')
    
    # Переопределяем username как email
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        if self.password and not str(self.password).startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    class Meta:
        verbose_name = "Администратор"
        verbose_name_plural = "Администраторы"


class Car(models.Model):
    """Модель автомобиля"""
    
    TRANSMISSION_CHOICES = [
        ('manual', 'Механическая'),
        ('automatic', 'Автоматическая'),
        ('robot', 'Робот'),
        ('variator', 'Вариатор'),
    ]
    
    FUEL_CHOICES = [
        ('petrol', 'Бензин'),
        ('diesel', 'Дизель'),
        ('hybrid', 'Гибрид'),
        ('electric', 'Электро'),
        ('gas', 'Газ'),
    ]
    
    DRIVE_CHOICES = [
        ('front', 'Передний'),
        ('rear', 'Задний'),
        ('all', 'Полный'),
    ]
    
    BODY_TYPE_CHOICES = [
        ('sedan', 'Седан'),
        ('hatchback', 'Хэтчбек'),
        ('wagon', 'Универсал'),
        ('suv', 'Внедорожник'),
        ('coupe', 'Купе'),
        ('convertible', 'Кабриолет'),
    ]
    
    CONDITION_CHOICES = [
        ('excellent', 'Отличное'),
        ('good', 'Хорошее'),
        ('fair', 'Удовлетворительное'),
        ('poor', 'Плохое'),
    ]
    
    CURRENCY_CHOICES = [
        ('EUR', 'Евро'),
        ('USD', 'Доллар'),
        ('RUB', 'Рубль'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Черновик'),
        ('published', 'Опубликовано'),
        ('sold', 'Продано'),
    ]
    
    # Основная информация
    brand = models.CharField(max_length=100, verbose_name="Марка")
    model = models.CharField(max_length=100, verbose_name="Модель")
    generation = models.CharField(max_length=100, blank=True, null=True, verbose_name="Поколение")
    year = models.IntegerField(verbose_name="Год выпуска")
    mileage = models.IntegerField(verbose_name="Пробег (км)")
    
    # Технические характеристики
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES, verbose_name="Коробка передач")
    fuel = models.CharField(max_length=20, choices=FUEL_CHOICES, verbose_name="Топливо")
    drive = models.CharField(max_length=20, choices=DRIVE_CHOICES, verbose_name="Привод")
    body_type = models.CharField(max_length=20, choices=BODY_TYPE_CHOICES, blank=True, null=True, verbose_name="Тип кузова")
    color = models.CharField(max_length=50, blank=True, null=True, verbose_name="Цвет")
    power = models.IntegerField(blank=True, null=True, verbose_name="Мощность (л.с.)")
    engine_volume = models.FloatField(blank=True, null=True, verbose_name="Объем двигателя (л)")
    euro_standard = models.CharField(max_length=10, blank=True, null=True, verbose_name="Евро стандарт")
    vin = models.CharField(max_length=17, unique=True, verbose_name="VIN")
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, verbose_name="Состояние")
    
    # Документы и статус
    customs = models.BooleanField(default=False, verbose_name="Растаможен")
    vat = models.BooleanField(default=False, verbose_name="НДС включен")
    owners = models.IntegerField(default=1, verbose_name="Количество владельцев")
    
    # Цена и продажа
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Цена")
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='EUR', verbose_name="Валюта")
    negotiable = models.BooleanField(default=True, verbose_name="Торг")
    city = models.CharField(max_length=100, verbose_name="Город")
    
    # Описание и медиа
    description = models.TextField(verbose_name="Описание")
    photos = models.JSONField(default=list, verbose_name="Фотографии")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Статус")
    views = models.IntegerField(default=0, verbose_name="Просмотры")
    
    # Связи и метаданные
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, verbose_name="Администратор")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    def __str__(self):
        return f"{self.brand} {self.model} {self.year} ({self.vin})"
    
    class Meta:
        verbose_name = "Автомобиль"
        verbose_name_plural = "Автомобили"
        ordering = ['-created_at']


class Part(models.Model):
    """Модель запчасти"""
    
    CONDITION_CHOICES = [
        ('new', 'Новая'),
        ('used', 'Б/У'),
        ('refurbished', 'Восстановленная'),
    ]
    
    CURRENCY_CHOICES = [
        ('EUR', 'Евро'),
        ('USD', 'Доллар'),
        ('RUB', 'Рубль'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Черновик'),
        ('published', 'Опубликовано'),
        ('sold', 'Продано'),
    ]
    
    # Основная информация
    name = models.CharField(max_length=200, verbose_name="Название")
    brand = models.CharField(max_length=100, verbose_name="Марка")
    model = models.CharField(max_length=100, verbose_name="Модель")
    year_from = models.IntegerField(blank=True, null=True, verbose_name="Год от")
    year_to = models.IntegerField(blank=True, null=True, verbose_name="Год до")
    category = models.CharField(max_length=100, verbose_name="Категория")
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, verbose_name="Состояние")
    
    # Цена и продажа
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Цена")
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='EUR', verbose_name="Валюта")
    negotiable = models.BooleanField(default=False, verbose_name="Торг")
    city = models.CharField(max_length=100, verbose_name="Город")
    
    # Описание и медиа
    description = models.TextField(verbose_name="Описание")
    photos = models.JSONField(default=list, verbose_name="Фотографии")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Статус")
    views = models.IntegerField(default=0, verbose_name="Просмотры")
    
    # Связи и метаданные
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, verbose_name="Администратор")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    def __str__(self):
        return f"{self.name} - {self.brand} {self.model}"
    
    class Meta:
        verbose_name = "Запчасть"
        verbose_name_plural = "Запчасти"
        ordering = ['-created_at']
