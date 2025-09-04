from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Admin, Car, Part


@admin.register(Admin)
class AdminUserAdmin(UserAdmin):
    """Админка для модели Admin"""
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Личная информация', {'fields': ('first_name', 'last_name', 'role')}),
        ('Разрешения', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'role'),
        }),
    )


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    """Админка для модели Car"""
    list_display = ['brand', 'model', 'year', 'price', 'currency', 'status', 'admin', 'created_at']
    list_filter = ['brand', 'status', 'transmission', 'fuel', 'condition', 'created_at']
    search_fields = ['brand', 'model', 'vin', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at', 'views']
    list_editable = ['status', 'price']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('brand', 'model', 'generation', 'year', 'mileage')
        }),
        ('Технические характеристики', {
            'fields': ('transmission', 'fuel', 'drive', 'body_type', 'color', 'power', 'engine_volume', 'euro_standard')
        }),
        ('Документы и статус', {
            'fields': ('vin', 'condition', 'customs', 'vat', 'owners')
        }),
        ('Цена и продажа', {
            'fields': ('price', 'currency', 'negotiable', 'city', 'status')
        }),
        ('Описание и медиа', {
            'fields': ('description', 'photos')
        }),
        ('Метаданные', {
            'fields': ('admin', 'views', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    """Админка для модели Part"""
    list_display = ['name', 'brand', 'model', 'category', 'price', 'currency', 'status', 'admin', 'created_at']
    list_filter = ['brand', 'category', 'condition', 'status', 'created_at']
    search_fields = ['name', 'brand', 'model', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at', 'views']
    list_editable = ['status', 'price']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'brand', 'model', 'year_from', 'year_to', 'category', 'condition')
        }),
        ('Цена и продажа', {
            'fields': ('price', 'currency', 'negotiable', 'city', 'status')
        }),
        ('Описание и медиа', {
            'fields': ('description', 'photos')
        }),
        ('Метаданные', {
            'fields': ('admin', 'views', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
