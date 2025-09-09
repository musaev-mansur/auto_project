from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from .models import Admin, Car, Part
from .serializers import (
    AdminSerializer, AdminCreateSerializer,
    CarSerializer, CarListSerializer,
    PartSerializer, PartListSerializer
)
from django.conf import settings
import boto3
import os
import uuid
from django.http import JsonResponse



class LoginView(APIView):
    """View для аутентификации пользователя"""
    permission_classes = [permissions.AllowAny]
    

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email и пароль обязательны'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=email, password=password)
        if user:
            login(request, user)
            return Response({
                'message': 'Успешный вход',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': user.role
                }
            })
        else:
            return Response(
                {'error': 'Неверные учетные данные'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    """View для выхода пользователя"""
    permission_classes = [permissions.IsAuthenticated]
    

    def post(self, request):
        logout(request)
        return Response({'message': 'Успешный выход'})


class ProfileView(APIView):
    """View для получения профиля пользователя"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role
        })


class AdminViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления администраторами.
    
    list:
        Получить список администраторов
    create:
        Создать нового администратора
    retrieve:
        Получить детали администратора по ID
    update:
        Обновить администратора
    destroy:
        Удалить администратора
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'email']
    
    def get_queryset(self):
        # type: ignore
        return Admin.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AdminCreateSerializer
        return AdminSerializer


class CarViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления автомобилями.
    
    list:
        Получить список автомобилей с фильтрацией и поиском
    create:
        Создать новый автомобиль
    retrieve:
        Получить детали автомобиля по ID
    update:
        Обновить автомобиль
    destroy:
        Удалить автомобиль
    """
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['brand', 'model', 'year', 'transmission', 'fuel', 'status', 'admin']
    search_fields = ['brand', 'model', 'vin', 'description']
    ordering_fields = ['price', 'year', 'mileage', 'created_at', 'views']
    
    def get_queryset(self):
        # type: ignore
        return Car.objects.select_related('admin')
    
    def get_permissions(self):
        """
        Разрешаем публичный доступ для чтения и создания, 
        аутентификация требуется только для редактирования/удаления
        """
        if self.action in ['list', 'retrieve', 'create']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CarListSerializer
        return CarSerializer
    
    def perform_create(self, serializer):
        # Для тестирования: если пользователь не аутентифицирован, создаем автомобиль без admin
        if self.request.user.is_authenticated:
            serializer.save(admin=self.request.user)
        else:
            serializer.save(admin=None)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Увеличить счетчик просмотров"""
        car = self.get_object()
        car.views += 1
        car.save()
        return Response({'views': car.views})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Статистика автомобилей"""
        # type: ignore
        total_cars = Car.objects.count()
        published_cars = Car.objects.filter(status='published').count()
        draft_cars = Car.objects.filter(status='draft').count()
        sold_cars = Car.objects.filter(status='sold').count()
        
        return Response({
            'total': total_cars,
            'published': published_cars,
            'draft': draft_cars,
            'sold': sold_cars,
        })


class PartViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления запчастями.
    
    list:
        Получить список запчастей с фильтрацией и поиском
    create:
        Создать новую запчасть
    retrieve:
        Получить детали запчасти по ID
    update:
        Обновить запчасть
    destroy:
        Удалить запчасть
    """
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['brand', 'model', 'category', 'condition', 'status', 'admin']
    search_fields = ['name', 'brand', 'model', 'description']
    ordering_fields = ['price', 'created_at', 'views']
    
    def get_queryset(self):
        # type: ignore
        return Part.objects.select_related('admin')
    
    def get_permissions(self):
        """
        Разрешаем публичный доступ для чтения, 
        аутентификация требуется только для создания/редактирования/удаления
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PartListSerializer
        return PartSerializer
    
    def perform_create(self, serializer):
        # Для тестирования: если пользователь не аутентифицирован, создаем запчасть без admin
        if self.request.user.is_authenticated:
            serializer.save(admin=self.request.user)
        else:
            serializer.save(admin=None)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Увеличить счетчик просмотров"""
        part = self.get_object()
        part.views += 1
        part.save()
        return Response({'views': part.views})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Статистика запчастей"""
        # type: ignore
        total_parts = Part.objects.count()
        published_parts = Part.objects.filter(status='published').count()
        draft_parts = Part.objects.filter(status='draft').count()
        sold_parts = Part.objects.filter(status='sold').count()
        
        return Response({
            'total': total_parts,
            'draft': draft_parts,
            'published': published_parts,
            'sold': sold_parts,
        })


class ImageUploadView(APIView):
    permission_classes = [permissions.AllowAny]
    

    def post(self, request):
        try:
            # Получаем файлы из запроса
            files = request.FILES.getlist('images')
            batch_id = request.POST.get('batchId', str(uuid.uuid4()))
            
            if not files:
                return JsonResponse({
                    'success': False,
                    'error': 'No files provided'
                }, status=400)
            
            # Настройки AWS S3
            if not getattr(settings, 'USE_S3', False):
                return JsonResponse({
                    'success': False,
                    'error': 'S3 upload is disabled. Set USE_S3=True to enable S3 uploads.'
                }, status=500)
            
            if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY:
                return JsonResponse({
                    'success': False,
                    'error': 'AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in environment variables.'
                }, status=500)
                
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            
            bucket_name = settings.AWS_S3_BUCKET_NAME
            if not bucket_name:
                return JsonResponse({
                    'success': False,
                    'error': 'AWS S3 bucket not configured'
                }, status=500)
            
            # Проверяем, что bucket существует и доступен
            try:
                s3_client.head_bucket(Bucket=bucket_name)
            except Exception as bucket_error:
                return JsonResponse({
                    'success': False,
                    'error': f'Bucket {bucket_name} not accessible: {str(bucket_error)}'
                }, status=500)
            
            uploaded_images = []
            
            for file in files:
                # Генерируем уникальное имя файла
                file_extension = os.path.splitext(file.name)[1]
                unique_filename = f"{batch_id}/{uuid.uuid4()}{file_extension}"
                
                # Загружаем файл в S3
                s3_client.upload_fileobj(
                    file,
                    bucket_name,
                    unique_filename,
                    ExtraArgs={
                        'ContentType': file.content_type
                    }
                )
                
                # Формируем URL
                image_url = f"https://{bucket_name}.s3.amazonaws.com/{unique_filename}"
                uploaded_images.append({
                    'url': image_url,
                    'key': unique_filename
                })
            
            return JsonResponse({
                'success': True,
                'images': uploaded_images
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)


class ImageDeleteView(APIView):
    permission_classes = [permissions.AllowAny]
    

    def delete(self, request):
        try:
            data = request.data
            image_key = data.get('imageKey')
            
            if not image_key:
                return JsonResponse({
                    'success': False,
                    'error': 'Image key not provided'
                }, status=400)
            
            # Настройки AWS S3
            if not getattr(settings, 'USE_S3', False):
                return JsonResponse({
                    'success': False,
                    'error': 'S3 upload is disabled. Set USE_S3=True to enable S3 uploads.'
                }, status=500)
            
            if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY:
                return JsonResponse({
                    'success': False,
                    'error': 'AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in environment variables.'
                }, status=500)
                
            s3_client = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION
            )
            
            bucket_name = settings.AWS_S3_BUCKET_NAME
            if not bucket_name:
                return JsonResponse({
                    'success': False,
                    'error': 'AWS S3 bucket not configured'
                }, status=500)
            
            # Удаляем файл из S3
            s3_client.delete_object(
                Bucket=bucket_name,
                Key=image_key
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Image deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
