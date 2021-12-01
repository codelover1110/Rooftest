from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^signin', views.signin, name="signin"),
    url(r'^signup', views.signup, name="signup"),
    url(r'^getUser/(?P<pk>[0-9]+)$', views.userdetail),
    url(r'^forgotPasswordToConfirmEmail', views.forgotPasswordToConfirmEmail),
    url(r'^forgotPassword', views.forgotPassword)
]
