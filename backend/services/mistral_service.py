import requests
import base64
import os
from pathlib import Path
from services.parser import extract_text_from_file
from dotenv import load_dotenv

load_dotenv()

MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
MISTRAL_MODEL = "mistral-large-latest"
MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"



def analyze_with_mistral(description: str, client_data: str = None):
    # Charger le contenu du template Excel (en base64 pour le prompt)

    template_data = extract_text_from_file(str(Path.cwd()) + "/templates/modele-bilan-comptable-boby-1.xlsx")

    prompt_ = f"""
Tu es un **assistant en planification financière personnelle** spécialisé dans la création de rapports clairs et exploitables sous format tableur (Excel).

Contexte général :
{description}

"""

    if client_data:
        prompt_ += f"""Données textuelles fournies par le client :
    {client_data}

    """

    if template_data:
        prompt_ += f"""Modèle de planification financière (contenu encodé en base64, à utiliser comme référence pour la structure et le style) :
    {template_data}

    """

    prompt_ += """
Ta tâche :
1. Analyse la situation financière du client.
2. Dresse un résumé clair comprenant :
   - revenus mensuels,
   - dépenses fixes et variables,
   - dettes,
   - reste à vivre (revenus - dépenses - dettes),
   - et niveau de motivation à épargner (si mentionné).
3. Propose un **plan de gestion financière sur 4 mois** comprenant :
   - une estimation des dépenses mensuelles,
   - une projection de l’épargne mensuelle,
   - des recommandations concrètes et personnalisées.
4. Fournis la **réponse uniquement sous format JSON valide** et parfaitement structuré, sans texte additionnel ni explication.

Format attendu :
{
  "revenus": [
    {"source": "Salaire net", "montant": ...},
    {"source": "Revenus complémentaires", "montant": ...}
  ],
  "depenses": [
    {"type": "Fixes", "montant": ...},
    {"type": "Variables", "montant": ...}
  ],
  "dettes": [
    {"type": "Dette personnelle", "montant": ...}
  ],
  "epargne": [
    {"mois": "Mois 1", "montant": ...},
    {"mois": "Mois 2", "montant": ...},
    {"mois": "Mois 3", "montant": ...},
    {"mois": "Mois 4", "montant": ...}
  ],
  "recommandations": [
    "Recommandation 1",
    "Recommandation 2",
    "Recommandation 3"
  ]
}

Assure-toi que :
- le JSON soit bien formé (aucune phrase hors JSON),
- les montants soient numériques (pas de texte dans les valeurs),
- les libellés soient clairs et cohérents pour un usage dans Excel.
- le JSON soit complet et ne couvre que les aspects demandés. N'ajoute rien d'autre.
"""

    response = requests.post(
        MISTRAL_URL,
        headers={"Authorization": f"Bearer {MISTRAL_API_KEY}"},
        json={
            "model": MISTRAL_MODEL,
            "messages": [
                {"role": "system", "content": "Tu es un conseiller financier expert."},
                {"role": "user", "content": prompt_}
            ]
        }
    )

    if response.status_code != 200:
        raise Exception(f"Erreur Mistral API : {response.status_code} - {response.text}")
    result = response.json()
    message = result["choices"][0]["message"]["content"]
    
    return message
