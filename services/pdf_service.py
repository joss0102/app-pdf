import pdfplumber
import re
import requests
from services.google_books import search_book_in_google_books

async def process_pdf(file, bookTitle=None):
    if bookTitle:
        return search_book_in_google_books(bookTitle)

    extracted_title = await extract_book_name_from_pdf(file)

    if not extracted_title:
        return "No se pudo encontrar un título en el PDF."

    return search_book_in_google_books(extracted_title)

async def extract_book_name_from_pdf(file):
    with pdfplumber.open(file.file) as pdf:
        text = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())

    # Normalizar el texto
    text = re.sub(r"[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()

    # Expresión regular para detectar títulos
    title_pattern = re.compile(r"(?m)^(?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ0-9]+){1,5})$")
    matches = title_pattern.findall(text)

    for possible_title in matches:
        if 3 < len(possible_title) < 100:
            return possible_title.strip()

    # Si no encuentra título, usa la línea más larga
    lines = text.split("\n")
    longest_line = max(lines, key=len, default="Título no encontrado").strip()

    return longest_line
