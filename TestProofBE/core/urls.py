from django.conf.urls import url
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^signin', views.signin, name="signin"),
    url(r'^signup', views.signup, name="signup"),
    url(r'^getUser/(?P<pk>[0-9]+)$', views.userdetail),
    url(r'^forgotPasswordToConfirmEmail', views.forgotPasswordToConfirmEmail),
    url(r'^forgotPassword', views.forgotPassword),
    url(r'^updateProfile', views.updateProfile),
    url(r'^uploadFile', views.uploadFile),
    url(r'^getPackageOptions', views.getPackageOptions),
    url(r'^test', views.test),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
