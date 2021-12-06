from django.contrib import admin

from .models import Package, User

# Register your models here.

admin.site.register(Package)
admin.site.register(User)
