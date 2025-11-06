from fastapi import FastAPI, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os
from services.parser import extract_text_from_file
#from services.openai_service import generate_financial_plan
from services.mistral_service import analyze_with_mistral
from services.excel_generator import create_excel_plan, excel___


import shutil
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Callable


def save_upload_file(upload_file: UploadFile, destination: Path) -> None:
    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()


def save_upload_file_tmp(upload_file: UploadFile) -> Path:
    try:
        suffix = Path(upload_file.filename).suffix
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(upload_file.file, tmp)
            tmp_path = Path(tmp.name)
    finally:
        upload_file.file.close()
    return tmp_path


def handle_upload_file(
    upload_file: UploadFile, handler: Callable[[Path], None]
) -> None:
    tmp_path = save_upload_file_tmp(upload_file)
    try:
        handler(tmp_path)  # Do something with the saved temp file
    finally:
        tmp_path.unlink()  # Delete the temp file


class Base(BaseModel):
    net : str
    net_other : str
    depenses_fixes : str
    depenses_variables : str
    Objectif_épargne : str
    Dettes : str
    informations_sup : str

app = FastAPI(title="Assistant Financier IA")

# Autoriser les requêtes du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en prod : limiter au domaine de ton front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dossier pour servir les fichiers Excel générés
app.mount("/files", StaticFiles(directory="files"), name="files")


@app.post("/analyze")
async def analyze_finances(
    data: str = Form(...),
    file: UploadFile = File(...),
):

    description = json.loads(data)
    print(description)
    des = f"""
    - Revenu mensuel net : {description['net']}
    - Autres revenus : {description['net_other']}
    - Dépenses fixes : {description['depenses_fixes']}
    - Dépenses variables : {description['depenses_variables']}
    - Objectif d’épargne : {description['objectif_epargne']}
    - Dettes : {description['dettes']}
    - Informations supplémentaires : {description['informations_sup']}
    """
    
    #file_content = await file.read()
    #file_size = len(file_content)
    
    if file:
        tmp_path = save_upload_file_tmp(file)
        print(tmp_path)
        client_text = extract_text_from_file(tmp_path)
        os.remove(tmp_path)
    
    #print(client_text)
    #print(des)
    try:
        
        ai_response = analyze_with_mistral(des, client_text)
        #print(client_text)
        #print(ai_response)
        file_path = excel___(ai_response)
    except Exception as e:
        print(f"Erreur lors de l'analyse ou de la génération du fichier Excel : {e}")
        return {"error": str(e)}
    
    #ai_response = analyze_with_mistral(des, file)
    
    

    return {"file_url": f"http://localhost:8000/files/{file_path.split('/')[-1]}"}
