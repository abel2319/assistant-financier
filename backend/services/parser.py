from docx import Document
import pandas as pd
import os

def extract_text_from_file(path):
    ext = os.path.splitext(path)[1].lower()
    text = ""
    if ext == ".docx":
        doc = Document(path)
        text = "\n".join([p.text for p in doc.paragraphs])
    elif ext in [".xls", ".xlsx"]:
        df = pd.read_excel(path)
        text = df.to_string(index=False)
    else:
        text = "Type de fichier non reconnu."
    return text
