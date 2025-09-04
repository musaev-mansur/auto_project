from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminViewSet, CarViewSet, PartViewSet,
    LoginView, LogoutView, ProfileView,
    ImageUploadView, ImageDeleteView
)

router = DefaultRouter()
router.register(r'admins', AdminViewSet, basename='admin')
router.register(r'cars', CarViewSet, basename='car')
router.register(r'parts', PartViewSet, basename='part')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path('api/images/upload/', ImageUploadView.as_view(), name='image-upload'),
    path('api/images/delete/', ImageDeleteView.as_view(), name='image-delete'),
]
