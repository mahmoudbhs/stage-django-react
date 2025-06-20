import pandas as pd
from django.core.management.base import BaseCommand
from core.models import Zone, KPI
from datetime import datetime

TECH_MAPPING = {
    "_4G_Zone": "4G",
    "_3G_Zone": "3G",
    "_2G_Zone": "2G",
}

class Command(BaseCommand):
    help = "Importe les données KPI pour 2G, 3G, 4G depuis un fichier Excel"

    def handle(self, *args, **kwargs):
        # 🚨 SUPPRIME TOUS LES KPI AVANT CHAQUE IMPORT (ANTI-DOUBLON)
        KPI.objects.all().delete()
        # Si tu veux vraiment tout réinitialiser (y compris les zones), décommente la ligne suivante :
        # Zone.objects.all().delete()

        file_path = "dataset.xlsx"  # Chemin du fichier Excel
        xls = pd.ExcelFile(file_path)

        for sheet_name, tech in TECH_MAPPING.items():
            if sheet_name not in xls.sheet_names:
                self.stdout.write(self.style.WARNING(f"❌ Feuille '{sheet_name}' introuvable"))
                continue

            df = pd.read_excel(xls, sheet_name=sheet_name)
            df.columns = [col.strip() for col in df.columns]

            self.stdout.write(f"📥 Importation de la feuille {sheet_name}...")

            kpi_objects = []

            for _, row in df.iterrows():
                try:
                    date = pd.to_datetime(row['DATE'], dayfirst=True).date()
                    zone_name = row['zone']
                    zone, _ = Zone.objects.get_or_create(nom=zone_name)

                    for kpi_name in df.columns[2:]:  # Skip DATE and zone
                        valeur = row[kpi_name]
                        if pd.isna(valeur):  # Ignore les cellules vides
                            continue

                        kpi_objects.append(KPI(
                            nom=kpi_name,
                            valeur=valeur,
                            technologie=tech,
                            zone=zone,
                            date=date
                        ))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"❌ Erreur ligne : {e}"))

            # Insertion en bulk
            KPI.objects.bulk_create(kpi_objects)
            self.stdout.write(self.style.SUCCESS(f"✅ {len(kpi_objects)} enregistrements insérés depuis {sheet_name}"))

