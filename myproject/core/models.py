from django.db import models
from django.contrib.auth.models import AbstractUser

TECHNOLOGIE_CHOICES = [
    ('2G', '2G'),
    ('3G', '3G'),
    ('4G', '4G'),
]

class Zone(models.Model):
    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom

class KPI(models.Model):
    nom = models.CharField(max_length=100, db_index=True)
    valeur = models.FloatField()
    seuil_critique = models.FloatField(null=True, blank=True)
    technologie = models.CharField(max_length=3, choices=TECHNOLOGIE_CHOICES, db_index=True)
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, db_index=True)
    date = models.DateField(db_index=True)

    def __str__(self):
        return f"{self.nom} - {self.zone} - {self.date}"

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('technicien', 'Technicien'),
        ('consultant', 'Consultant'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='consultant')
    date_naissance = models.DateField(null=True, blank=True)  # <-- AJOUTE ICI
