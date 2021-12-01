from django.db import models


# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=150, unique=True, verbose_name='username')
    email = models.CharField(unique=True, max_length=150)
    password = models.CharField(max_length=128, verbose_name='password')
    fullName = models.CharField(blank=True, max_length=100, null=True)
    code = models.CharField(max_length=100, blank=True, null=True)
    isTFA = models.BooleanField(null=False, default=False)
