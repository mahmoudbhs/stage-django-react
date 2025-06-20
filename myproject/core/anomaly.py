import numpy as np
import pandas as pd

def detect_anomalies_super_sensible(
    dates, values, noms=None, window_weeks=1, threshold_std=1
):
    """
    Détection ultra-sensible des anomalies sur KPI :
    - Fenêtre historique = 1 semaine (mêmes jours)
    - Alerte à la moindre explosion par KPI
    - Retourne toutes les infos détaillées pour le rapport
    """
    df = pd.DataFrame({"date": pd.to_datetime(dates), "valeur": values})
    df["nom"] = noms if noms is not None else "KPI"
    df["semaine"] = df["date"].dt.isocalendar().week
    df["jour"] = df["date"].dt.dayofweek

    result = []
    for kpi_name in df["nom"].unique():
        df_kpi = df[df["nom"] == kpi_name].sort_values("date").reset_index(drop=True)
        for idx, row in df_kpi.iterrows():
            current_week = row["semaine"]
            current_day = row["jour"]

            # Historique des mêmes jours sur les X semaines avant
            mask = (
                (df_kpi["jour"] == current_day)
                & (df_kpi["semaine"] < current_week)
                & (df_kpi["semaine"] >= current_week - window_weeks)
            )
            hist = df_kpi[mask]["valeur"]
            hist_list = hist.tolist()

            if len(hist) < 1:
                rapport = (
                    f"⚠️ Alerte préventive : impossible de calculer une référence pour {row['nom']} ({row['date'].strftime('%Y-%m-%d')}) "
                    f"car pas assez d'historique ({len(hist)} valeur(s)). Surveillez les prochains jours."
                )
                result.append({
                    "severite": "alerte_brute",
                    "expected": None,
                    "std": None,
                    "deviation": None,
                    "pourquoi": "Valeur brute sans référence : surveillance recommandée.",
                    "rapport_detaille": rapport,
                    "prediction": None,
                    "reel": row['valeur'],
                })
                continue

            expected = hist.mean()
            std = hist.std() or 1e-9
            deviation = abs(row["valeur"] - expected) / std
            ecart_percent = ((row["valeur"] - expected) / expected) * 100 if expected else 0

            # Détection ultra-sensible
            if deviation > threshold_std * 3:
                severite = "critique"
            elif deviation > threshold_std * 2:
                severite = "élevée"
            elif deviation > threshold_std:
                severite = "moyenne"
            elif deviation > threshold_std / 2:
                severite = "faible"
            else:
                severite = "normale"

            prediction = expected  # Valeur attendue
            pourquoi = (
                f"Pour {row['nom']} ({row['date'].strftime('%Y-%m-%d')}) : "
                f"Valeur réelle {row['valeur']:.2f}, prédiction (historique 1 semaine) : {prediction:.2f}, "
                f"déviation : {deviation:.2f}σ. "
                f"{'Alerte critique !' if severite=='critique' else 'Alerte' if severite!='normale' else 'Pas d’anomalie.'}"
            )

            rapport_detaille = (
                f"Analyse détaillée pour {row['nom']} le {row['date'].strftime('%Y-%m-%d')}:\n"
                f"- Valeur réelle : {row['valeur']:.2f}\n"
                f"- Valeur prédite (moyenne sur 1 semaine) : {prediction:.2f}\n"
                f"- Ecart-type : {std:.2f}\n"
                f"- Historique utilisé ({len(hist_list)} valeurs) : {hist_list}\n"
                f"- Déviation (z-score) : {deviation:.2f}σ\n"
                f"- Ecart relatif : {ecart_percent:+.2f}%\n"
                f"- Seuils : {threshold_std}σ (faible), {threshold_std*2}σ (moyenne), {threshold_std*3}σ (CRITIQUE)\n"
                f"- Gravité : {severite.upper()}\n"
                + (
                    "🚨 Anomalie détectée : la valeur réelle explose la tendance attendue !\n"
                    if severite in ["critique", "élevée", "moyenne", "faible"] else
                    "✅ Pas d’anomalie : valeur conforme à l’historique.\n"
                )
                + "Interprétation automatique basée sur l’écart à la moyenne historique (prédiction).\n"
            )

            result.append({
                "severite": severite,
                "expected": prediction,
                "std": std,
                "deviation": deviation,
                "pourquoi": pourquoi,
                "rapport_detaille": rapport_detaille,
                "prediction": prediction,
                "reel": row["valeur"],
            })
    return result
