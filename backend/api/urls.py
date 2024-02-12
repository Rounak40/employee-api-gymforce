from django.urls import path
from .views import user_register_view, logout_user, user_login_view, logout_user, MyView


urlpatterns = [
    path("login/", user_login_view, name="login"),
    path("register/", user_register_view, name="register"),
    path("logout/", logout_user, name="logout"),
    path("employee/", MyView.as_view()),
    path("employee/<int:employee_id>/", MyView.as_view())
]