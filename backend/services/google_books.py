import requests

GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes"

def search_book_in_google_books(book_name):
    params = {"q": book_name}
    response = requests.get(GOOGLE_BOOKS_API_URL, params=params)

    if response.status_code == 200:
        return response.json()

    # Intentar con el título sin acentos si falla
    book_name_without_accents = book_name.replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
    params["q"] = book_name_without_accents
    response = requests.get(GOOGLE_BOOKS_API_URL, params=params)

    return response.json() if response.status_code == 200 else "No se encontró información del libro."
