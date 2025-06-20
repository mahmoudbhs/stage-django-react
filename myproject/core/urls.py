from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import KPIListView, CurrentUserView, LoginView, create_user

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('kpis/', KPIListView.as_view(), name='kpi-list'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('login/', LoginView.as_view(), name='login'),

    # --------- AJOUT ICI ----------
    path('users/', create_user, name='create_user'),
]
