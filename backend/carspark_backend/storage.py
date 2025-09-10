"""
Custom S3 storage classes for CarsPark
"""
from storages.backends.s3boto3 import S3Boto3Storage


class S3StaticStorage(S3Boto3Storage):
    """
    Custom S3 storage for static files
    """
    location = 'static'
    default_acl = None  # Отключаем ACL
    file_overwrite = False
    querystring_auth = False


class S3MediaStorage(S3Boto3Storage):
    """
    Custom S3 storage for media files
    """
    location = 'media'
    default_acl = None  # Отключаем ACL
    file_overwrite = False
    querystring_auth = False
