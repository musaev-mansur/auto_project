from rest_framework import serializers
from .models import Admin, Car, Part


class AdminSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Admin"""
    
    class Meta:
        model = Admin
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class AdminCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания Admin"""
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Admin
        fields = ['email', 'first_name', 'last_name', 'password', 'role']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Admin(**validated_data)
        user.set_password(password)
        user.save()
        return user


class CarSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Car"""
    admin = AdminSerializer(read_only=True)
    admin_id = serializers.PrimaryKeyRelatedField(
        queryset=Admin.objects.all(),
        source='admin',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Car
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'views']


class CarListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка автомобилей"""
    admin_name = serializers.CharField(source='admin.get_full_name', read_only=True)
    
    class Meta:
        model = Car
        fields = [
            'id', 'brand', 'model', 'generation', 'year', 'mileage', 'transmission', 
            'fuel', 'drive', 'body_type', 'color', 'power', 'engine_volume', 
            'euro_standard', 'vin', 'condition', 'customs', 'vat', 'owners',
            'price', 'currency', 'negotiable', 'city', 'description', 'status', 'views',
            'admin_name', 'created_at', 'photos'
        ]


class PartSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Part"""
    admin = AdminSerializer(read_only=True)
    admin_id = serializers.PrimaryKeyRelatedField(
        queryset=Admin.objects.all(),
        source='admin',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Part
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'views']


class PartListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка запчастей"""
    admin_name = serializers.CharField(source='admin.get_full_name', read_only=True)
    
    class Meta:
        model = Part
        fields = [
            'id', 'name', 'brand', 'model', 'year_from', 'year_to', 'category', 'condition',
            'price', 'currency', 'negotiable', 'city', 'description', 'status', 'views',
            'admin_name', 'created_at', 'photos'
        ]
