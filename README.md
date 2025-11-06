# Assistant Financier - Serein et Prospère

## Description

Assistant Financier Serein et Prospère est un outil d’aide à la planification financière personnelle.  
Il permet d’analyser le profil financier d’un client (revenus, dépenses, dettes, objectifs d’épargne, etc.) et de générer automatiquement un plan de gestion budgétaire personnalisé sur plusieurs mois, avec des recommandations pratiques.

Le projet est composé de deux parties :
- **Frontend** : interface utilisateur développée avec **Next.js**.
- **Backend** : API développée avec **FastAPI**, intégrée à un modèle IA (Mistral) et un générateur de planification Excel.

---

## Structure du projet

assistant-financier/
│
├── backend/ # API FastAPI
│ ├── app.py
│ ├── requirements.txt
│ ├── services/
│ │ ├── openai_service.py
│ │ ├── excel_generator.py
│ │ └── parser.py
│ └── templates/template_planification.xlsx
│
├── frontend/ # Application Next.js
│ ├── app/
│ │ ├── page.tsx
│ │ ├── resultat/page.tsx
│ │ └── api/analyze/route.ts
│ ├── components/
│ │ ├── QuestionForm.tsx
│ │ ├── FileUploader.tsx
│ │ └── SummaryCard.tsx
│ └── styles/globals.css
│
└── docker-compose.yml


---

## Fonctionnalités

- Formulaire de saisie du profil financier (revenus, dépenses, dettes, etc.)
- Possibilité de joindre un fichier (Word ou Excel)
- Analyse automatisée via modèle IA Mistral
- Génération d’un plan de gestion financière dans un fichier Excel
- Suggestions d’optimisation budgétaire
- Interface web claire et intuitive

---

## Prérequis

Avant de commencer, installez les outils suivants :

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)
- (Optionnel) [Python 3.11+](https://www.python.org/) et [Node.js 20+](https://nodejs.org/)

---

## Lancer manuellement
### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

