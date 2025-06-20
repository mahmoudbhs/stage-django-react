from rest_framework import serializers
from .models import KPI, Zone, CustomUser

class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ['id', 'nom']

class KPISerializer(serializers.ModelSerializer):
    # Le field "zone" renverra maintenant l'objet Zone complet !
    zone = ZoneSerializer(read_only=True)

    class Meta:
        model = KPI
        fields = ['id', 'nom', 'valeur', 'seuil_critique', 'technologie', 'date', 'zone']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name', 'date_naissance']

# ------ AJOUT POUR LA CRÉATION -------
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'password',
            'first_name', 'last_name', 'date_naissance', 'role'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

class ReportSerializer(serializers.ModelSerializer):
    zone = ZoneSerializer(read_only=True)
    class Meta:
        model = KPI  # ou le modèle de tes rapports
        fields = '__all__'
