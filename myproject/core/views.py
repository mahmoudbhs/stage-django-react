from rest_framework import generics, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import KPI, CustomUser
from .serializers import KPISerializer, UserSerializer, CreateUserSerializer
from .anomaly import detect_anomalies_super_sensible

class KPIListView(generics.ListAPIView):
    queryset = KPI.objects.all()
    serializer_class = KPISerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['technologie', 'zone__nom', 'date']
    search_fields = ['nom']
    ordering_fields = ['date', 'valeur']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset().order_by('date'))
        page = self.paginate_queryset(queryset)

        # On utilise la page paginée (ou le queryset brut si pas de pagination)
        kpi_list = page if page is not None else queryset

        # Récupère les listes pour les anomalies
        dates = [str(k.date) for k in kpi_list]
        valeurs = [k.valeur for k in kpi_list]
        noms = [k.nom for k in kpi_list]

        # Détection d'anomalies (mets les bons paramètres si besoin)
        anomalies = detect_anomalies_super_sensible(
            dates, valeurs, noms=noms, window_weeks=1, threshold_std=1
        ) if len(kpi_list) else []

        serializer = self.get_serializer(kpi_list, many=True)
        data = serializer.data

        # Injection des champs d'anomalie dans la réponse JSON
        for i, item in enumerate(data):
            if anomalies:
                anomaly = anomalies[i]
                item["anomaly_severity"] = anomaly.get("severite")
                item["anomaly_expected"] = anomaly.get("expected")
                item["anomaly_std"] = anomaly.get("std")
                item["anomaly_deviation"] = anomaly.get("deviation")
                item["anomaly_pourquoi"] = anomaly.get("pourquoi")
                item["anomaly_rapport"] = anomaly.get("rapport_detaille", "")
                item["anomaly_prediction"] = anomaly.get("prediction", None)
                item["anomaly_reel"] = anomaly.get("reel", None)

        if page is not None:
            return self.get_paginated_response(data)
        return Response(data)



# ---------- UTILISATEUR ACTUEL ----------
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# ---------- LOGIN ----------
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('username')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Email non trouvé'}, status=status.HTTP_401_UNAUTHORIZED)

        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role
                }
            })
        else:
            return Response({'detail': 'Mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)

# ---------- CREATION D'UTILISATEUR ----------
from rest_framework.decorators import api_view, permission_classes

@api_view(['POST'])
@permission_classes([])  # tu peux mettre [] juste pour debug
def create_user(request):
    serializer = CreateUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'success': True, 'user_id': user.id})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
