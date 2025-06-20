import numpy as np
import pandas as pd
from django.contrib import admin
from .models import CustomUser, Zone, KPI

# Enregistre ton CustomUser dans l'admin
from django.contrib.auth.admin import UserAdmin


admin.site.register(CustomUser, UserAdmin)
admin.site.register(Zone)
admin.site.register(KPI)


def detect_anomalies_simple(
    dates, values, noms=None, window_days=7
):
    """
    Détection simple et robuste :
    - Pas de "alerte brute", mais une sévérité (faible, moyenne, élevée) selon l'écart à la moyenne sur 7 jours.
    - Si pas d'historique, on évalue l'écart sur la valeur précédente connue, et on classe aussi !
    """
    seuils = {"faible": 0.2, "moyenne": 0.4, "élevée": 0.7}
    df = pd.DataFrame({"date": pd.to_datetime(dates), "valeur": values})
    df["nom"] = noms if noms is not None else "KPI"
    df = df.sort_values(["nom", "date"]).reset_index(drop=True)
    results = [None] * len(df)

    for kpi in df["nom"].unique():
        df_kpi = df[df["nom"] == kpi].reset_index()
        for idx, row in df_kpi.iterrows():
            # Historique des window_days jours avant la date courante
            mask = (df_kpi["date"] < row["date"]) & (df_kpi["date"] >= row["date"] - pd.Timedelta(days=window_days))
            hist = df_kpi[mask]["valeur"]
            if len(hist) < 1:
                # Même sans historique, compare à la dernière valeur connue
                prev_mask = (df_kpi["date"] < row["date"])
                if prev_mask.sum() == 0:
                    # Premier point, impossible de détecter
                    results[row["index"]] = {
                        "severite": "normale",
                        "expected": None,
                        "std": None,
                        "deviation": None,
                        "pourquoi": "Premier point, aucune référence possible.",
                        "rapport_detaille": f"{row['nom']} le {row['date'].strftime('%Y-%m-%d')} : pas d'anomalie, première donnée connue.",
                        "prediction": None,
                        "reel": row["valeur"]
                    }
                    continue
                prev = df_kpi[prev_mask]["valeur"].iloc[-1]
                mean = prev
                diff = abs(row["valeur"] - mean)
                deviation = diff / mean if mean != 0 else 0
            else:
                mean = hist.mean()
                diff = abs(row["valeur"] - mean)
                deviation = diff / mean if mean != 0 else 0

            # Classement par écart (TOUJOURS une sévérité)
            if deviation >= seuils["élevée"]:
                severite = "élevée"
            elif deviation >= seuils["moyenne"]:
                severite = "moyenne"
            elif deviation >= seuils["faible"]:
                severite = "faible"
            else:
                severite = "normale"

            pourquoi = (
                f"{row['nom']} {row['date'].strftime('%Y-%m-%d')} : "
                f"valeur {row['valeur']:.2f} vs. moyenne {mean:.2f} "
                f"(écart {deviation*100:.1f} %), sévérité {severite}."
            )
            rapport = (
                f"Analyse :\n"
                f"- KPI : {row['nom']}\n"
                f"- Date : {row['date'].strftime('%Y-%m-%d')}\n"
                f"- Observé : {row['valeur']:.2f}\n"
                f"- Référence : {mean:.2f} sur {len(hist) if len(hist) else 1} valeur(s)\n"
                f"- Ecart relatif : {deviation*100:.1f}%\n"
                f"- Sévérité attribuée : {severite.upper()}"
            )

            results[row["index"]] = {
                "severite": severite,
                "expected": mean,
                "std": None,
                "deviation": deviation,
                "pourquoi": pourquoi,
                "rapport_detaille": rapport,
                "prediction": mean,
                "reel": row["valeur"]
            }
    return results
